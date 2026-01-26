
// AI client helper functions - Use the backend API route instead of calling directly
// These are kept for reference but should not be called from frontend

export const getCohereResponse = async (message: string, context?: string): Promise<string> => {
  // DEPRECATED: Use the backend API route /api/ai/chat instead
  // Keeping this for backward compatibility reference
  throw new Error('Use the backend API route /api/ai/chat instead')
}

export const getOpenAIResponse = async (message: string, context?: string): Promise<string> => {
  // DEPRECATED: Use the backend API route /api/ai/chat instead
  // Keeping this for backward compatibility reference
  throw new Error('Use the backend API route /api/ai/chat instead')
}

export const getNewsAnalysisPrompt = (country?: string): string => {
  const basePrompt = 'You are a global intelligence AI assistant specializing in news analysis and geopolitical insights. Provide accurate, up-to-date information about global events, political developments, and economic trends.'
  
  return country 
    ? `${basePrompt} Focus specifically on news and events related to ${country}.`
    : basePrompt
}
