import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

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
    
    console.log('Translation request for message:', message)
    
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
    
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found')
      throw new Error('GEMINI_API_KEY not found')
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `If this text is in English, just return it as is. If it's in any other language, translate it to English. Only return the text, nothing else: "${message}"`
          }]
        }],
        generationConfig: {
          temperature: 0,
          maxOutputTokens: 100,
        }
      })
    })

    const data = await response.json()
    console.log('Gemini response:', data)
    
    if (!response.ok) {
      console.error('Gemini error:', data)
      throw new Error(data.error?.message || 'Gemini API failed')
    }

    const translatedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || message

    return new Response(
      JSON.stringify({ 
        translatedText
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Translation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})