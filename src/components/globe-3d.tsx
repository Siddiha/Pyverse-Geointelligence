'use client'

import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import CountryNode from './country-node'
import { countryCoordinates } from '@/lib/geo-data'

interface GlobeProps {
  onCountryClick?: (country: string) => void
}

function Earth({ onCountryClick }: GlobeProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  // Rotate the Earth
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002
    }
  })

  return (
    <group>
      {/* Main Earth sphere */}
      <Sphere ref={meshRef} args={[5, 64, 64]} position={[0, 0, 0]}>
        <meshPhongMaterial 
          color="#1e40af"
          shininess={100}
        />
      </Sphere>

      {/* Atmosphere glow */}
      <Sphere args={[5.1, 64, 64]} position={[0, 0, 0]}>
        <meshBasicMaterial 
          color="#87ceeb"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Country nodes */}
      {Object.entries(countryCoordinates).map(([country, coords]) => (
        <CountryNode
          key={country}
          country={country}
          lat={coords.lat}
          lng={coords.lng}
          onClick={() => onCountryClick?.(country)}
          isHovered={hovered === country}
          onHover={setHovered}
        />
      ))}

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1}
        castShadow
      />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#4facfe" />
    </group>
  )
}

export default function InteractiveGlobe({ onCountryClick }: GlobeProps) {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

  const handleCountryClick = (country: string) => {
    setSelectedCountry(country)
    onCountryClick?.(country)
  }

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <Earth onCountryClick={handleCountryClick} />
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          minDistance={8}
          maxDistance={25}
          autoRotate={false}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>

      {/* Selected Country Info */}
      {selectedCountry && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="absolute top-6 left-1/2 transform -translate-x-1/2 glass-effect p-4 rounded-xl"
        >
          <div className="text-center">
            <h3 className="text-lg font-bold text-white">{selectedCountry}</h3>
            <p className="text-sm text-gray-300">Loading latest news...</p>
          </div>
        </motion.div>
      )}

      {/* Globe Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 right-6 glass-effect p-4 rounded-xl"
      >
        <div className="text-sm text-gray-300 mb-2">Live Statistics</div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-400">Countries:</span>
            <span className="text-blue-400">{Object.keys(countryCoordinates).length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">News Sources:</span>
            <span className="text-green-400">200+</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Updates:</span>
            <span className="text-yellow-400">Real-time</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}