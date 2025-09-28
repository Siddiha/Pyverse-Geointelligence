
// AI client functions with real API integration
export const getCohereResponse = async (message: string, context?: string): Promise<string> => {
  const cohereApiKey = process.env.COHERE_API_KEY
  
  if (!cohereApiKey) {
    console.warn('COHERE_API_KEY not found, using mock response')
    await new Promise(resolve => setTimeout(resolve, 1000))
    return 'I can help you analyze global news and provide insights about different countries. Please add your Cohere API key to enable real AI responses.'
  }

  try {
    const response = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cohereApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'command',
        prompt: `${context || 'You are a global intelligence AI assistant specializing in news analysis and geopolitical insights.'}\n\nUser: ${message}\nAssistant:`,
        max_tokens: 500,
        temperature: 0.7,
        stop_sequences: ['User:'],
        return_likelihoods: 'NONE'
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Cohere API error response:', errorText)
      throw new Error(`Cohere API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    return data.generations?.[0]?.text || 'I apologize, but I could not generate a response at this time.'
  } catch (error) {
    console.error('Cohere API error:', error)
    throw error
  }
}

export const getOpenAIResponse = async (message: string, context?: string): Promise<string> => {
  const openaiApiKey = process.env.OPENAI_API_KEY
  
  if (!openaiApiKey) {
    console.warn('OPENAI_API_KEY not found, using mock response')
    await new Promise(resolve => setTimeout(resolve, 1500))
    return 'This is a mock AI response. Please add your OpenAI API key to enable real responses.'
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: context || 'You are a global intelligence AI assistant specializing in news analysis and geopolitical insights.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || 'I apologize, but I could not generate a response at this time.'
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw error
  }
}

export const getNewsAnalysisPrompt = (country?: string): string => {
  const basePrompt = 'You are a global intelligence AI assistant specializing in news analysis and geopolitical insights. Provide accurate, up-to-date information about global events, political developments, and economic trends.'
  
  return country 
    ? `${basePrompt} Focus specifically on news and events related to ${country}.`
    : basePrompt
}
