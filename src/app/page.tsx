'use client'

import { Suspense, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Globe, MessageCircle, Mic, TrendingUp } from 'lucide-react'

// Dynamic imports to prevent SSR issues with Three.js
const InteractiveGlobe = dynamic(() => import('@/components/globe-3d'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
    </div>
  )
})

const NewsPanel = dynamic(() => import('@/components/news-panel'), {
  ssr: false
})

const AiChat = dynamic(() => import('@/components/ai-chat'), {
  ssr: false
})

const VoiceAssistant = dynamic(() => import('@/components/voice-assistant'), {
  ssr: false
})

export default function HomePage() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isVoiceActive, setIsVoiceActive] = useState(false)

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country)
  }

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="glass-effect border-b border-white/10 p-4 z-50"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Globe className="h-8 w-8 text-white-400" />
              <div className="absolute inset-0 bg-white-400 rounded-full animate-ping opacity-20"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                GeoIntel AI
              </h1>
              <p className="text-xs text-gray-400">Global Intelligence Agent</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 glass-effect px-3 py-2 rounded-lg"
            >
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="text-sm text-gray-300">Live Updates</span>
              <div className="w-2 h-2 bg-white-400 rounded-full animate-pulse"></div>
            </motion.div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsVoiceActive(!isVoiceActive)}
              className={`glass-effect p-2 rounded-lg transition-colors ${
                isVoiceActive ? 'bg-red-500/20 text-red-400' : 'hover:bg-white/10 text-blue-400'
              }`}
            >
              <Mic className="h-5 w-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="glass-effect p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <MessageCircle className="h-5 w-5 text-purple-400" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Globe Section */}
        <motion.main 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex-1 relative globe-container"
        >
          <Suspense fallback={
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading Earth...</p>
              </div>
            </div>
          }>
            <InteractiveGlobe onCountryClick={handleCountrySelect} />
          </Suspense>
          
          {/* Floating Controls */}
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute bottom-6 left-6 glass-effect p-4 rounded-xl"
          >
            <div className="text-sm text-gray-300 mb-2">Globe Controls</div>
            <div className="space-y-2 text-xs text-gray-400">
              <div>🖱️ Drag to rotate</div>
              <div>🔍 Scroll to zoom</div>
              <div>📍 Click countries for news</div>
            </div>
          </motion.div>
        </motion.main>

        {/* News Panel */}
        <motion.aside 
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-96 glass-effect border-l border-white/10 flex flex-col"
        >
          <Suspense fallback={
            <div className="h-full flex items-center justify-center">
              <div className="animate-pulse text-gray-400">Loading news...</div>
            </div>
          }>
            <NewsPanel selectedCountry={selectedCountry} />
          </Suspense>
        </motion.aside>
      </div>

      {/* AI Chat Overlay */}
      {isChatOpen && (
        <Suspense>
          <AiChat onClose={() => setIsChatOpen(false)} />
        </Suspense>
      )}

      {/* Voice Assistant */}
      {isVoiceActive && (
        <Suspense>
          <VoiceAssistant onClose={() => setIsVoiceActive(false)} />
        </Suspense>
      )}
    </div>
  )
}