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
    const body = await req.json()
    const message = body.message || body.text
    
    console.log('Translation request for message:', message)
    
    if (!message) {
      throw new Error('No message provided')
    }

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
    
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found')
      throw new Error('GEMINI_API_KEY not found')
    }

    // Check if text contains non-English characters (matching your Python logic)
    const nonEnglishPattern = /[\u0900-\u097F\u0600-\u06FF\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF]/;
    const isNonEnglish = nonEnglishPattern.test(message)
    
    console.log('Non-English detected:', isNonEnglish)

    // If it's already English, return as is
    if (!isNonEnglish) {
      console.log('Text is already English, returning original')
      return new Response(
        JSON.stringify({ 
          translatedText: message,
          isTranslated: false
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      )
    }

    // Use Gemini to translate (similar to your Python genai approach)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Translate this text to English. If it's already in English, return it unchanged. Only return the translated text, nothing else: "${message}"`
          }]
        }],
        generationConfig: {
          temperature: 0,
          maxOutputTokens: 100,
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Gemini API error:', errorData)
      throw new Error(`Gemini API failed: ${response.status}`)
    }

    const data = await response.json()
    console.log('Gemini response:', data)
    
    const translatedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || message

    console.log('Translation result:', translatedText)

    return new Response(
      JSON.stringify({ 
        translatedText: translatedText,
        isTranslated: true
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Translation error:', error)
    return new Response(
      JSON.stringify({ 
        translatedText: message || "Translation failed",
        isTranslated: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})