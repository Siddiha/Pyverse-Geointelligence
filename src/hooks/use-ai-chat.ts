import { useState, useCallback } from 'react'

export const useAiChat = () => {
  const [loading, setLoading] = useState(false)

  const sendMessage = useCallback(async (message: string): Promise<string> => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to get AI response')
      }

      return data.data.response
    } catch (error) {
      console.error('AI Chat error:', error)
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