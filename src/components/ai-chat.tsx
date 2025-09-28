'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, X, Loader2, AlertCircle } from 'lucide-react'

interface AiChatProps {
  onClose: () => void
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function AiChat({ onClose }: AiChatProps) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your GeoIntel AI assistant. I can analyze global events, provide intelligence briefings, and answer questions about geopolitical situations. What would you like to know?',
      timestamp: new Date()
    }
  ])
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (message: string) => {
    try {
      setError(null)
      
      // For demo purposes, we'll use a simple response system
      // Replace this with your actual API call
      const response = await simulateAIResponse(message)
      
      return response
    } catch (error) {
      throw new Error('Failed to get AI response')
    }
  }

  // Simulate AI response - replace with actual Cohere API call
  const simulateAIResponse = async (message: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API delay

    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('ukraine') || lowerMessage.includes('russia')) {
      return `🔴 **INTELLIGENCE BRIEFING: UKRAINE-RUSSIA CONFLICT**

**Current Status:** Active military operations ongoing in eastern regions
**Key Developments:**
• International military aid continues to flow to Ukrainian forces
• Diplomatic efforts focus on humanitarian corridors
• Economic sanctions remain in effect against Russian entities

**Assessment:** Situation remains highly volatile with potential for escalation. Recommend continued monitoring of border regions and supply line activities.

**Sources:** NATO Intelligence, OSINT analysis, diplomatic channels`
    }
    
    if (lowerMessage.includes('china') || lowerMessage.includes('taiwan')) {
      return `📊 **INTELLIGENCE BRIEFING: CHINA-TAIWAN TENSIONS**

**Current Status:** Elevated military posturing in Taiwan Strait
**Key Developments:**
• Increased PLA naval activities near Taiwan territorial waters
• Semiconductor export controls affecting regional tech supply chains
• International diplomatic pressure for peaceful resolution

**Assessment:** Tensions remain high but within manageable parameters. Monitor for unusual military buildup or policy changes.

**Sources:** Regional intelligence networks, commercial satellite imagery`
    }
    
    if (lowerMessage.includes('middle east') || lowerMessage.includes('israel')) {
      return `⚡ **INTELLIGENCE BRIEFING: MIDDLE EAST SITUATION**

**Current Status:** Multiple regional flashpoints requiring monitoring
**Key Developments:**
• Ongoing security operations in contested territories
• International mediation efforts continue
• Regional power dynamics shifting with new alliances

**Assessment:** Complex multi-actor situation with potential for rapid escalation. Recommend close monitoring of all parties.

**Sources:** Regional intelligence assets, diplomatic reporting`
    }
    
    if (lowerMessage.includes('cyber') || lowerMessage.includes('hack')) {
      return `🔒 **CYBERSECURITY INTELLIGENCE BRIEFING**

**Current Status:** Elevated cyber threat environment globally
**Key Developments:**
• State-sponsored APT groups targeting critical infrastructure
• Ransomware attacks on government and private sector increasing
• Attribution analysis ongoing for recent major incidents

**Assessment:** Cyber threats pose significant risk to national security. Enhanced defensive measures recommended.

**Sources:** Cybersecurity agencies, threat intelligence platforms`
    }
    
    if (lowerMessage.includes('economic') || lowerMessage.includes('sanctions')) {
      return `💰 **ECONOMIC INTELLIGENCE BRIEFING**

**Current Status:** Global economic pressures affecting geopolitical stability
**Key Developments:**
• Sanctions regimes impacting international trade flows
• Energy market volatility affecting regional alliances
• Supply chain disruptions creating new dependencies

**Assessment:** Economic factors increasingly driving geopolitical decisions. Monitor for policy shifts.

**Sources:** Financial intelligence, trade data analysis`
    }
    
    // General response
    return `🤖 **AI ANALYSIS**

I understand you're asking about "${message}". Based on current intelligence feeds, I can provide analysis on:

• Global conflict zones and tension areas
• Cybersecurity threats and incidents  
• Economic sanctions and trade impacts
• Military movements and exercises
• Diplomatic developments

Please specify which area you'd like me to focus on, or ask about a specific country or region for a detailed intelligence briefing.

**Note:** All assessments are based on open-source intelligence and should not be considered classified information.`
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await sendMessage(input)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      setError('Failed to get response. Please try again.')
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '⚠️ I apologize, but I encountered an error processing your request. Please try again or rephrase your question.',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickQuestions = [
    "What's the current situation in Ukraine?",
    "Analyze China-Taiwan tensions",
    "Brief me on Middle East developments",
    "Show cybersecurity threat status",
    "Economic sanctions impact analysis"
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-4xl h-[85vh] bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-medium">GeoIntel AI Assistant</h3>
              <p className="text-xs text-orange-400">Global Intelligence & Analysis • CLASSIFIED</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-900/30 border-b border-red-700/30 flex items-center space-x-2"
          >
            <AlertCircle className="h-4 w-4 text-red-400" />
            <span className="text-red-300 text-sm">{error}</span>
          </motion.div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-[85%] ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' 
                      ? 'bg-orange-600' 
                      : 'bg-gradient-to-r from-orange-600 to-red-600'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>

                  {/* Message */}
                  <div className={`p-4 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-800/70 text-gray-100 border border-gray-700'
                  }`}>
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </div>
                    <p className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-gray-800/70 border border-gray-700 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-orange-400" />
                    <span className="text-sm text-gray-300">Analyzing intelligence data...</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        <div className="p-4 border-t border-gray-700 bg-gray-800/30">
          <div className="mb-3">
            <p className="text-xs text-gray-400 mb-2">Quick Intelligence Queries:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInput(question)}
                  disabled={loading}
                  className="px-3 py-1.5 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-lg text-xs transition-colors disabled:opacity-50"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="flex space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about global events, conflicts, or intelligence analysis..."
              className="flex-1 bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}