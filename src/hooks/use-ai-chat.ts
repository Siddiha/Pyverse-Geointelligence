import { useState, useCallback } from 'react'

export const useAiChat = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(async (message: string): Promise<string> => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to get AI response')
      }

      return data.data.response
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      console.error('AI Chat error:', errorMessage)
      setError(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    sendMessage,
    loading,
    error
  }
}