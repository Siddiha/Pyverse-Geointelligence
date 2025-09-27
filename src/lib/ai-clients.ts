
// Simple AI client functions for development
export const getCohereResponse = async (message: string, context?: string): Promise<string> => {
  // Mock response for development
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  if (message.toLowerCase().includes('news')) {
    return 'I can help you analyze global news and provide insights about different countries.'
  }
  
  return 'I understand your question. How can I assist you with global intelligence today?'
}

export const getOpenAIResponse = async (message: string, context?: string): Promise<string> => {
  // Mock response for development
  await new Promise(resolve => setTimeout(resolve, 1500))
  return 'This is a mock AI response. Add your OpenAI API key to enable real responses.'
}

export const getNewsAnalysisPrompt = (country?: string): string => {
  return country 
    ? 'You are analyzing news and events for ' + country
    : 'You are analyzing global news and events'
}
