'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mic, MicOff, Volume2, X } from 'lucide-react'

interface VoiceAssistantProps {
  onClose: () => void
}

export default function VoiceAssistant({ onClose }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    // Initialize voice recognition
    if ('webkitSpeechRecognition' in window) {
      // Voice recognition logic here
    }
  }, [])

  const startListening = () => {
    setIsListening(true)
    // Start voice recognition
  }

  const stopListening = () => {
    setIsListening(false)
    // Stop voice recognition
  }

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.voice = speechSynthesis.getVoices()[0]
      speechSynthesis.speak(utterance)
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
            className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center"
          >
            {isListening ? (
              <Mic className="h-12 w-12 text-white" />
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
              : isListening 
                ? 'Listening...' 
                : 'Press to speak'
            }
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Ask me about global news and events
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
          <div className="bg-blue-500/20 rounded-lg p-3 mb-4">
            <div className="flex items-start space-x-2">
              <Volume2 className="h-4 w-4 text-blue-400 mt-0.5" />
              <p className="text-white text-sm">{response}</p>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isListening
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            } disabled:opacity-50`}
          >
            {isListening ? 'Stop' : 'Start'} Recording
          </button>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 space-y-2">
          <p className="text-gray-400 text-xs">Try saying:</p>
          <div className="space-y-1">
            {[
              '"Show me news from Japan"',
              '"What\'s happening in Europe?"',
              '"Tell me about breaking news"'
            ].map((example, index) => (
              <button
                key={index}
                onClick={() => setTranscript(example.slice(1, -1))}
                className="block w-full text-left px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 text-xs transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}