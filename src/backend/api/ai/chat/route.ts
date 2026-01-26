import { NextRequest, NextResponse } from 'next/server'

// Environment variables for API keys
const COHERE_API_KEY = process.env.COHERE_API_KEY
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

interface ChatRequest {
  message: string
  country?: string
  context?: string
}

interface CohereResponse {
  text: string
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

// Cohere API function
async function getCohereResponse(message: string, context?: string): Promise<string> {
  if (!COHERE_API_KEY) {
    throw new Error('Cohere API key not configured')
  }

  const systemPrompt = `You are a geopolitical intelligence analyst AI assistant. Your role is to:
1. Provide factual, objective analysis of global events
2. Focus on intelligence, security, and political developments
3. Use professional, analytical tone
4. Cite when information is based on open sources
5. Avoid speculation and clearly mark assessments vs facts

Context: ${context || 'General geopolitical analysis'}

Respond with structured intelligence briefings when appropriate.`

  try {
    const response = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COHERE_API_KEY}`,
        'Content-Type': 'application/json',
        'Cohere-Version': '2022-12-06'
      },
      body: JSON.stringify({
        model: 'command',
        prompt: `${systemPrompt}\n\nUser: ${message}\n\nAssistant:`,
        max_tokens: 500,
        temperature: 0.3,
        k: 0,
        stop_sequences: ["\nUser:"],
        return_likelihoods: 'NONE'
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Cohere API error:', response.status, errorData)
      throw new Error(`Cohere API error: ${response.status}`)
    }

    const data = await response.json()
    return data.generations[0]?.text?.trim() || 'No response generated'
  } catch (error) {
    console.error('Cohere API request failed:', error)
    throw error
  }
}

// OpenAI API function (fallback)
async function getOpenAIResponse(message: string, context?: string): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured')
  }

  const systemPrompt = `You are a geopolitical intelligence analyst AI assistant. Provide factual, objective analysis of global events with focus on intelligence, security, and political developments. Use professional, analytical tone and structure responses as intelligence briefings when appropriate.

Context: ${context || 'General geopolitical analysis'}`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.3
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenAI API error:', response.status, errorData)
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data: OpenAIResponse = await response.json()
    return data.choices[0]?.message?.content?.trim() || 'No response generated'
  } catch (error) {
    console.error('OpenAI API request failed:', error)
    throw error
  }
}

// Fallback responses for when APIs are not available
function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('ukraine') || lowerMessage.includes('russia')) {
    return `🔴 **INTELLIGENCE BRIEFING: UKRAINE-RUSSIA CONFLICT**

**Current Status:** Active military operations ongoing in eastern regions
**Key Developments:**
• International military aid continues to flow to Ukrainian forces
• Diplomatic efforts focus on humanitarian corridors
• Economic sanctions remain in effect against Russian entities

**Assessment:** Situation remains highly volatile with potential for escalation. Recommend continued monitoring of border regions and supply line activities.

**Note:** This is a demo response. Please configure your AI API keys for real intelligence analysis.`
  }
  
  if (lowerMessage.includes('china') || lowerMessage.includes('taiwan')) {
    return `📊 **INTELLIGENCE BRIEFING: CHINA-TAIWAN TENSIONS**

**Current Status:** Elevated military posturing in Taiwan Strait
**Key Developments:**
• Increased PLA naval activities near Taiwan territorial waters
• Semiconductor export controls affecting regional tech supply chains
• International diplomatic pressure for peaceful resolution

**Assessment:** Tensions remain high but within manageable parameters. Monitor for unusual military buildup or policy changes.

**Note:** This is a demo response. Please configure your AI API keys for real intelligence analysis.`
  }
  
  return `🤖 **AI ANALYSIS**

I understand you're asking about "${message}". 

**Available Analysis Areas:**
• Global conflict zones and tension areas
• Cybersecurity threats and incidents  
• Economic sanctions and trade impacts
• Military movements and exercises
• Diplomatic developments

Please specify which area you'd like me to focus on, or ask about a specific country or region for a detailed intelligence briefing.

**Note:** This is a demo response. To enable full AI capabilities, please configure your API keys in the environment variables (COHERE_API_KEY or OPENAI_API_KEY).`
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { message, country, context } = body

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Message is required and must be a non-empty string' },
        { status: 400 }
      )
    }

    let response: string
    let usingFallback = false

    // Try Cohere first
    if (COHERE_API_KEY) {
      try {
        console.log('Attempting Cohere API...')
        response = await getCohereResponse(message, context)
      } catch (cohereError) {
        console.warn('Cohere API failed:', cohereError)
        
        // Try OpenAI as fallback
        if (OPENAI_API_KEY) {
          try {
            console.log('Attempting OpenAI API as fallback...')
            response = await getOpenAIResponse(message, context)
          } catch (openaiError) {
            console.warn('OpenAI API also failed:', openaiError)
            response = getFallbackResponse(message)
            usingFallback = true
          }
        } else {
          response = getFallbackResponse(message)
          usingFallback = true
        }
      }
    } else if (OPENAI_API_KEY) {
      // Try OpenAI if Cohere is not configured
      try {
        console.log('Attempting OpenAI API...')
        response = await getOpenAIResponse(message, context)
      } catch (openaiError) {
        console.warn('OpenAI API failed:', openaiError)
        response = getFallbackResponse(message)
        usingFallback = true
      }
    } else {
      // No API keys configured
      response = getFallbackResponse(message)
      usingFallback = true
    }

    return NextResponse.json({
      success: true,
      data: { 
        response,
        usingFallback,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('AI Chat API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Method not allowed. Use POST to send messages.' 
    },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Method not allowed. Use POST to send messages.' 
    },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Method not allowed. Use POST to send messages.' 
    },
    { status: 405 }
  )
}