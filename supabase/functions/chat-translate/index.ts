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
    const { message, targetLanguage, sourceLanguage } = await req.json()
    
    console.log('Translation request:', { message, targetLanguage, sourceLanguage })
    
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
    
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found in environment')
      throw new Error('GEMINI_API_KEY not found')
    }

    console.log('Making request to Gemini API...')
    
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
              text: `Translate the following text from ${sourceLanguage || 'auto-detected language'} to ${targetLanguage}. Only return the translated text, nothing else. Do not include explanations or notes.

Text to translate: ${message}

Translation:`
            }]
          }]
        })
      }
    )

    console.log('Gemini API response status:', response.status)
    
    const data = await response.json()
    console.log('Gemini API response data:', JSON.stringify(data, null, 2))
    
    if (!response.ok) {
      console.error('Gemini API error:', data)
      throw new Error(data.error?.message || `Gemini API error: ${response.status}`)
    }

    const translatedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || message
    console.log('Extracted translation:', translatedText)

    return new Response(
      JSON.stringify({ 
        translatedText,
        originalText: message,
        sourceLanguage: sourceLanguage || 'auto-detected',
        targetLanguage 
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