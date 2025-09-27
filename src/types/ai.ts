export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  country?: string
  newsContext?: string[]
}

export interface AIProvider {
  name: 'cohere' | 'openai' | 'vapi'
  isAvailable: boolean
  rateLimitRemaining?: number
}

export interface VoiceSettings {
  language: string
  voice: string
  speed: number
  pitch: number
}