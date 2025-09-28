'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Mic, MicOff, Volume2, X, Loader2 } from 'lucide-react'

interface VoiceAssistantProps {
  onClose: () => void
}

// Extend Window interface for speech recognition
declare global {
  interface Window {
    webkitSpeechRecognition: any
    SpeechRecognition: any
  }
}

export default function VoiceAssistant({ onClose }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [error, setError] = useState('')
  
  const recognitionRef = useRef<any>(null)
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = 'en-US'

        recognitionRef.current.onstart = () => {
          setIsListening(true)
          setError('')
        }

        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = ''
          let interimTranscript = ''

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript
            } else {
              interimTranscript += transcript
            }
          }

          setTranscript(finalTranscript || interimTranscript)
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          setError(`Speech recognition error: ${event.error}`)
          setIsListening(false)
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
          if (transcript.trim()) {
            processVoiceCommand(transcript)
          }
        }
      } else {
        setError('Speech recognition not supported in this browser')
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (synthesisRef.current) {
        speechSynthesis.cancel()
      }
    }
  }, [transcript])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('')
      setResponse('')
      setError('')
      try {
        recognitionRef.current.start()
        console.log('Voice recognition started')
      } catch (error) {
        console.error('Failed to start voice recognition:', error)
        setError('Failed to start voice recognition. Please try again.')
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  const processVoiceCommand = async (command: string) => {
    setIsProcessing(true)
    setResponse('')
    
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: command })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        const aiResponse = data.data.response
        setResponse(aiResponse)
        speakResponse(aiResponse)
      } else {
        throw new Error(data.error || 'Failed to get AI response')
      }
    } catch (error) {
      console.error('Voice command processing error:', error)
      const errorMessage = 'Sorry, I encountered an error processing your request.'
      setResponse(errorMessage)
      speakResponse(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any current speech
      speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8
      
      // Try to use a natural voice
      const voices = speechSynthesis.getVoices()
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Microsoft') ||
        voice.lang.startsWith('en')
      )
      
      if (preferredVoice) {
        utterance.voice = preferredVoice
      }
      
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      
      synthesisRef.current = utterance
      speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md glass-effect rounded-xl p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-medium">Voice Assistant</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Voice Visualizer */}
        <div className="flex items-center justify-center mb-6">
          <motion.div
            animate={{
              scale: isListening ? [1, 1.2, 1] : 1,
              opacity: isListening ? [0.7, 1, 0.7] : 0.5,
            }}
            transition={{
              duration: 1.5,
              repeat: isListening ? Infinity : 0,
            }}
            className={`w-32 h-32 rounded-full flex items-center justify-center ${
              isListening 
                ? 'bg-gradient-to-r from-white to-gray-300' 
                : 'bg-gradient-to-r from-gray-600 to-gray-800'
            }`}
          >
            {isProcessing ? (
              <Loader2 className="h-12 w-12 text-black animate-spin" />
            ) : isListening ? (
              <Mic className="h-12 w-12 text-black" />
            ) : (
              <MicOff className="h-12 w-12 text-white" />
            )}
          </motion.div>
        </div>

        {/* Status */}
        <div className="text-center mb-6">
          <p className="text-white font-medium">
            {isProcessing 
              ? 'Processing...' 
              : isSpeaking
                ? 'Speaking...'
                : isListening 
                  ? 'Listening...' 
                  : 'Press to speak'
            }
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {error ? error : 'Ask me about global news and events'}
          </p>
        </div>

        {/* Transcript */}
        {transcript && (
          <div className="bg-white/10 rounded-lg p-3 mb-4">
            <p className="text-white text-sm">{transcript}</p>
          </div>
        )}

        {/* Response */}
        {response && (
          <div className="bg-white/10 rounded-lg p-3 mb-4">
            <div className="flex items-start space-x-2">
              <Volume2 className="h-4 w-4 text-white mt-0.5" />
              <p className="text-white text-sm">{response}</p>
            </div>
            {isSpeaking && (
              <div className="mt-2">
                <button
                  onClick={stopSpeaking}
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Stop speaking
                </button>
              </div>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing || isSpeaking}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isListening
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-white hover:bg-gray-200 text-black'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isListening ? 'Stop' : 'Start'} Recording
          </button>
          
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="px-6 py-3 rounded-lg font-medium bg-gray-600 hover:bg-gray-700 text-white transition-colors"
            >
              Stop Speaking
            </button>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 space-y-2">
          <p className="text-gray-400 text-xs">Try saying:</p>
          <div className="space-y-1">
            {[
              'Show me news from Japan',
              'What\'s happening in Europe?',
              'Tell me about breaking news',
              'What are the latest global events?',
              'Show me news from the United States'
            ].map((example, index) => (
              <button
                key={index}
                onClick={() => {
                  setTranscript(example)
                  processVoiceCommand(example)
                }}
                disabled={isProcessing || isListening}
                className="block w-full text-left px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}