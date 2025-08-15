import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { driverId = 123456, customerName = "Ahmed Al-Rashid", orderType = "pickup" } = await req.json().catch(() => ({}));
    
    // Create test QR data that matches what our AI verification expects
    // Format: DRIVER_ID:123456|ORDER_ID:ORD-2024-001|TYPE:pickup|CUSTOMER:Ahmed Al-Rashid|ADDRESS:123 Main St
    const qrData = `DRIVER_ID:${driverId}|ORDER_ID:ORD-2024-001|TYPE:${orderType}|CUSTOMER:${customerName}|ADDRESS:123 Main St`;
    
    console.log('Generating QR code with data:', qrData);
    
    // Use QR Server API to generate a real scannable QR code
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;
    
    // Fetch the QR code image
    const qrResponse = await fetch(qrImageUrl);
    
    if (!qrResponse.ok) {
      throw new Error('Failed to generate QR code');
    }
    
    const qrImageBuffer = await qrResponse.arrayBuffer();
    
    return new Response(qrImageBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'image/png',
        'Content-Disposition': 'inline; filename="test-qr-code.png"'
      }
    });
    
  } catch (error) {
    console.error('QR generation error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate QR code',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});