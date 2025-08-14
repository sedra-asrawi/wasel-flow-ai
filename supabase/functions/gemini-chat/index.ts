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
    const { message, temperature = 0.5, max_tokens = 2000, persona = "Default" } = await req.json()
    console.log('Received message:', message)
    
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
    console.log('GEMINI_API_KEY exists:', !!GEMINI_API_KEY)
    
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found in environment variables')
      throw new Error('GEMINI_API_KEY not found')
    }

    // Persona instructions matching your Python code
    const persona_instructions: { [key: string]: string } = {
      "Default": "",
      "Creative Writer": "You are a creative writer. Respond with imaginative, vivid, and poetic language.",
      "Technical Expert": "You are a technical expert. Respond with accuracy, precision, and depth.",
      "Witty Historian": "You are a witty historian. Explain things with historical context and clever humor.",
    }

    const instruction = persona_instructions[persona] || ""

    // Weather tool function (matching your Python implementation)
    const get_weather = (city: string): string => {
      const fake_db: { [key: string]: string } = {
        "kuwait": "temp: 44, condition: ☀️ hot & sunny",
        "london": "temp: 18, condition: 🌧️ light rain", 
        "paris": "temp: 22, condition: ⛅ partly cloudy",
        "unknown": "city not known"
      }
      return fake_db[city.toLowerCase()] || fake_db["unknown"]
    }

    // Check if weather tool should be used
    let final_text = message
    if (message.toLowerCase().includes("weather")) {
      console.log('🤖 Gemini wants to fetch weather data...')
      
      let city = "unknown"
      if (message.toLowerCase().includes("kuwait")) {
        city = "kuwait"
      } else if (message.toLowerCase().includes("london")) {
        city = "london"
      } else if (message.toLowerCase().includes("paris")) {
        city = "paris"
      }

      const tool_output = get_weather(city)
      final_text = `${instruction}\n\nBased on this weather info: ${tool_output}\n\n${message}`
    } else {
      final_text = instruction ? `${instruction}\n\n${message}` : message
    }

    // Use gemini-2.0-flash-exp (similar to your gemini-2.5-pro)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are Wasel AI, a helpful assistant for delivery drivers in Kuwait. You help with delivery questions, route optimization, customer service, and general support. Keep responses concise and helpful. ${final_text}`
            }]
          }],
          generationConfig: {
            temperature: temperature,
            maxOutputTokens: max_tokens,
            candidateCount: 1,
          }
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

    // Estimate tokens (matching your Python function)
    const estimate_tokens = (text: string): number => {
      return Math.floor(text.length / 4) // rough approximation: 1 token ≈ 4 chars
    }

    const estimated_tokens = estimate_tokens(aiResponse)
    console.log(`📊 Usage: ${estimated_tokens} tokens`)

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        tokens_used: estimated_tokens,
        model: "gemini-2.0-flash-exp"
      }),
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