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
    console.log('Processing verification for driver ID:', driverId);

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

    // Simple validation without AI for testing
    console.log('Performing simple validation test');
    
    // Parse QR data manually
    const qrParts = qrData.split('|');
    const driverIdMatch = qrParts.find(part => part.startsWith('DRIVER_ID:'));
    const orderIdMatch = qrParts.find(part => part.startsWith('ORDER_ID:'));
    
    const extractedDriverId = driverIdMatch ? driverIdMatch.split(':')[1] : null;
    const extractedOrderId = orderIdMatch ? orderIdMatch.split(':')[1] : null;
    
    console.log('Extracted from QR:', { extractedDriverId, extractedOrderId });
    
    // Simple validation
    const isValid = extractedDriverId === driverId.toString();
    const confidence = isValid ? 95 : 10;
    const reason = isValid ? 
      `QR code verified: Driver ID ${extractedDriverId} matches expected ${driverId}` :
      `Driver ID mismatch: QR contains ${extractedDriverId}, expected ${driverId}`;

    const aiResult = {
      isValid,
      confidence,
      extractedDriverId,
      extractedOrderId,
      reason,
      scanType
    };

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