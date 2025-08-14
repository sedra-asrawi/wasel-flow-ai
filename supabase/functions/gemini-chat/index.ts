import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message } = await req.json()
    console.log('Received message:', message)
    
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
    console.log('GEMINI_API_KEY exists:', !!GEMINI_API_KEY)
    
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found in environment variables')
      throw new Error('GEMINI_API_KEY not found')
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are Wasel AI, a helpful assistant for delivery drivers in Kuwait. You help with delivery questions, route optimization, customer service, and general support. Keep responses concise and helpful. User message: ${message}`
            }]
          }]
        })
      }
    )

    const data = await response.json()
    console.log('Gemini API response status:', response.status)
    console.log('Gemini API response data:', JSON.stringify(data, null, 2))
    
    if (!response.ok) {
      console.error('Gemini API error:', data)
      throw new Error(data.error?.message || `Gemini API failed with status ${response.status}`)
    }

    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not process your request.'

    return new Response(
      JSON.stringify({ response: aiResponse }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Edge function error:', error)
    console.error('Error stack:', error.stack)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})