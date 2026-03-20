'use client'

import { Suspense, useState, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Globe, MessageCircle, Mic, TrendingUp } from 'lucide-react'

// Dynamic imports to prevent SSR issues with Three.js
const InteractiveGlobe = dynamic(() => import('@/components/globe-3d'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
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

const MIN_PANEL_WIDTH = 280
const MAX_PANEL_WIDTH = 600

export default function HomePage() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const [panelWidth, setPanelWidth] = useState(384) // default w-96 = 384px
  const isDragging = useRef(false)

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country)
  }

  const startResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    isDragging.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    const onMouseMove = (ev: MouseEvent) => {
      if (!isDragging.current) return
      const newWidth = window.innerWidth - ev.clientX
      setPanelWidth(Math.min(MAX_PANEL_WIDTH, Math.max(MIN_PANEL_WIDTH, newWidth)))
    }

    const onMouseUp = () => {
      isDragging.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }, [])

  return (
    <div className="h-screen w-full flex flex-col bg-black overflow-hidden">
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-black/90 backdrop-blur-xl border-b border-white/20 p-4 z-50"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Globe className="h-8 w-8 text-blue-400" />
              <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Tunnel
              </h1>
              <p className="text-xs text-gray-400">Prospects View</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-all duration-300"
            >
              <TrendingUp className="h-4 w-4 text-white" />
              <span className="text-sm text-gray-300">Live Updates</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </motion.div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsVoiceActive(!isVoiceActive)}
              className={`p-3 rounded-lg transition-all duration-300 ${
                isVoiceActive 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <Mic className="h-5 w-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="p-3 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all duration-300"
            >
              <MessageCircle className="h-5 w-5" />
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
          className="flex-1 relative bg-black"
        >
          <Suspense fallback={
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
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
            className="absolute bottom-6 left-6 bg-black/80 backdrop-blur-xl border border-white/20 p-4 rounded-xl"
          >
            <div className="text-sm text-gray-300 mb-2">Globe Controls</div>
            <div className="space-y-2 text-xs text-gray-400">
              <div>🖱️ Drag to rotate</div>
              <div>🔍 Scroll to zoom</div>
              <div>📍 Click countries for news</div>
            </div>
          </motion.div>
        </motion.main>

        {/* Drag Handle */}
        <div
          onMouseDown={startResize}
          className="w-1 cursor-col-resize bg-white/10 hover:bg-orange-500/60 transition-colors duration-150 flex-shrink-0 group relative"
          title="Drag to resize"
        >
          <div className="absolute inset-y-0 -left-1 -right-1" />
        </div>

        {/* News Panel */}
        <motion.aside
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ width: panelWidth }}
          className="bg-black/90 backdrop-blur-xl border-l border-white/20 flex flex-col flex-shrink-0"
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