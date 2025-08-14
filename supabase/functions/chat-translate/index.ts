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
    
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not found')
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are a professional translator. Translate the given text from ${sourceLanguage || 'auto-detected language'} to ${targetLanguage}. IMPORTANT: Only return the translated text in ${targetLanguage}, nothing else. Do not include any explanations, notes, or the original text. If the text is already in ${targetLanguage}, still provide a clear translation or return the text as is.`
            },
            {
              role: 'user',
              content: `Translate this text to ${targetLanguage}: ${message}`
            }
          ],
        temperature: 0.3,
      })
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to translate message')
    }

    const translatedText = data.choices?.[0]?.message?.content || message

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