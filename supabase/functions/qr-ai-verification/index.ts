import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { qrData, driverId, scanType } = await req.json();

    console.log('QR Verification Request:', { qrData, driverId, scanType });

    if (!qrData || !driverId || !scanType) {
      throw new Error('Missing required parameters: qrData, driverId, scanType');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get driver information
    const { data: driverData, error: driverError } = await supabase
      .from('drivers')
      .select('*')
      .eq('driver_id', driverId)
      .single();

    if (driverError || !driverData) {
      console.error('Driver lookup error:', driverError);
      throw new Error('Driver not found');
    }

    console.log('Driver found:', driverData.full_name);

    // Use Gemini AI to analyze QR data and verify it matches the driver
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not set');
    }

    const prompt = `
You are a QR code verification AI for a delivery service. Analyze the following QR code data and determine if it's valid for the given driver and scan type.

QR Code Data: "${qrData}"
Driver ID: ${driverId}
Driver Name: ${driverData.full_name}
Scan Type: ${scanType} (pickup or delivery)

Your task:
1. Parse the QR code data to extract relevant information (order ID, driver ID, etc.)
2. Verify if the QR code contains the correct driver ID (${driverId})
3. Check if the QR code format is appropriate for the scan type (${scanType})
4. Determine if this is a valid QR code for delivery operations

Respond with a JSON object:
{
  "isValid": boolean,
  "confidence": number (0-100),
  "extractedDriverId": string or null,
  "extractedOrderId": string or null,
  "reason": string (explanation of why it's valid or invalid),
  "scanType": "${scanType}"
}

Be strict in validation - only return isValid: true if you're confident this QR code is legitimate for this driver and scan type.
`;

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      }),
    });

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.status}`);
    }

    const geminiData = await geminiResponse.json();
    const aiResponseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponseText) {
      throw new Error('No response from Gemini AI');
    }

    console.log('AI Response:', aiResponseText);

    // Parse AI response (handle potential markdown formatting)
    let aiResult;
    try {
      const jsonMatch = aiResponseText.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : aiResponseText;
      aiResult = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      throw new Error('Invalid AI response format');
    }

    // Additional validation logic based on database
    let finalResult = {
      isValid: aiResult.isValid,
      confidence: aiResult.confidence || 0,
      reason: aiResult.reason || 'AI verification completed',
      driverName: driverData.full_name,
      extractedOrderId: aiResult.extractedOrderId,
      scanType: scanType,
      timestamp: new Date().toISOString()
    };

    // If AI says it's valid, do additional checks
    if (aiResult.isValid) {
      // Check if extracted driver ID matches
      if (aiResult.extractedDriverId && aiResult.extractedDriverId !== driverId.toString()) {
        finalResult.isValid = false;
        finalResult.reason = `Driver ID mismatch: expected ${driverId}, found ${aiResult.extractedDriverId}`;
      }

      // Check if order exists in database if we have an order ID
      if (aiResult.extractedOrderId) {
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('order_id', aiResult.extractedOrderId)
          .single();

        if (orderError || !orderData) {
          console.log('Order not found in database:', aiResult.extractedOrderId);
          // Don't fail validation just because order isn't in our system
          // But log it for audit purposes
        } else {
          console.log('Order found in database:', orderData);
          finalResult.reason += ` Order ${aiResult.extractedOrderId} verified in database.`;
        }
      }
    }

    console.log('Final verification result:', finalResult);

    return new Response(JSON.stringify(finalResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('QR verification error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      isValid: false,
      confidence: 0,
      reason: 'Verification failed due to system error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});