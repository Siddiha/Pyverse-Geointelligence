import { useState, useCallback } from 'react'

export const useAiChat = () => {
  const [loading, setLoading] = useState(false)

  const sendMessage = useCallback(async (message: string): Promise<string> => {
    setLoading(true)
    
    try {
      // Simple mock response
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      if (message.toLowerCase().includes('news')) {
        return "I can help you find the latest news from any country. Just click on a country on the globe!"
      }
      
      return `I understand you're asking about: "${message}". How can I help you with global intelligence today?`
    } catch (error) {
      return 'Sorry, I encountered an error. Please try again.'
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    sendMessage,
    loading
  }
}