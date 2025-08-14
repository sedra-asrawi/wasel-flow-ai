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
    
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    
    console.log('OpenAI API Key exists:', !!OPENAI_API_KEY)
    console.log('API Key length:', OPENAI_API_KEY?.length || 0)
    
    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY not found in environment')
      throw new Error('OPENAI_API_KEY not found')
    }

    console.log('Making request to OpenAI API...')
    
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
            content: `You are a professional translator. Translate the given text to ${targetLanguage}. ONLY return the translated text, nothing else. No explanations, no notes, no quotes - just the direct translation.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 150,
        temperature: 0.1,
      })
    })

    console.log('OpenAI API response status:', response.status)
    
    const data = await response.json()
    console.log('OpenAI API response data:', JSON.stringify(data, null, 2))
    
    if (!response.ok) {
      console.error('OpenAI API error:', data)
      
      // Check for quota exceeded error
      if (data.error?.code === 'insufficient_quota') {
        throw new Error('OpenAI API quota exceeded. Please check your billing.')
      }
      
      throw new Error(data.error?.message || `OpenAI API error: ${response.status}`)
    }

    const translatedText = data.choices?.[0]?.message?.content?.trim() || message
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