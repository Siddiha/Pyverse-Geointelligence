'use client'

import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { countryCoordinates } from '@/lib/geo-data'

interface GlobeProps {
  onCountryClick?: (country: string) => void
}

export default function InteractiveGlobe({ onCountryClick }: GlobeProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const cameraRef = useRef<THREE.PerspectiveCamera>()
  const globeRef = useRef<THREE.Mesh>()
  const frameId = useRef<number>()
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000011)
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 15
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    mountRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Create Earth sphere
    const geometry = new THREE.SphereGeometry(5, 64, 64)
    const material = new THREE.MeshPhongMaterial({
      color: 0x1e40af,
      shininess: 100,
      transparent: true,
      opacity: 0.9
    })
    const globe = new THREE.Mesh(geometry, material)
    scene.add(globe)
    globeRef.current = globe

    // Add atmosphere glow
    const atmosphereGeometry = new THREE.SphereGeometry(5.1, 64, 64)
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x87ceeb,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide
    })
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
    scene.add(atmosphere)

    // Add country markers
    Object.entries(countryCoordinates).forEach(([country, coords]) => {
      const { lat, lng } = coords
      
      // Convert to spherical coordinates
      const phi = (90 - lat) * (Math.PI / 180)
      const theta = (lng + 180) * (Math.PI / 180)
      
      const radius = 5.2
      const x = -(radius * Math.sin(phi) * Math.cos(theta))
      const z = radius * Math.sin(phi) * Math.sin(theta)
      const y = radius * Math.cos(phi)

      // Create marker
      const markerGeometry = new THREE.SphereGeometry(0.05, 8, 8)
      const markerMaterial = new THREE.MeshBasicMaterial({
        color: 0x74b9ff,
        transparent: true,
        opacity: 0.8
      })
      
      const marker = new THREE.Mesh(markerGeometry, markerMaterial)
      marker.position.set(x, y, z)
      marker.userData = { country }
      scene.add(marker)

      // Add glow effect
      const glowGeometry = new THREE.SphereGeometry(0.08, 8, 8)
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x74b9ff,
        transparent: true,
        opacity: 0.3
      })
      const glow = new THREE.Mesh(glowGeometry, glowMaterial)
      glow.position.set(x, y, z)
      scene.add(glow)
    })

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(10, 10, 5)
    scene.add(directionalLight)

    const pointLight = new THREE.PointLight(0x4facfe, 0.5)
    pointLight.position.set(-10, -10, -5)
    scene.add(pointLight)

    // Mouse controls
    let isDragging = false
    let previousMousePosition = { x: 0, y: 0 }

    const handleMouseDown = (event: MouseEvent) => {
      isDragging = true
      previousMousePosition = { x: event.clientX, y: event.clientY }
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging || !globeRef.current) return

      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
      }

      globeRef.current.rotation.y += deltaMove.x * 0.01
      globeRef.current.rotation.x += deltaMove.y * 0.01

      previousMousePosition = { x: event.clientX, y: event.clientY }
    }

    const handleMouseUp = () => {
      isDragging = false
    }

    const handleWheel = (event: WheelEvent) => {
      if (!cameraRef.current) return
      
      const delta = event.deltaY * 0.01
      cameraRef.current.position.z = Math.max(8, Math.min(25, cameraRef.current.position.z + delta))
    }

    renderer.domElement.addEventListener('mousedown', handleMouseDown)
    renderer.domElement.addEventListener('mousemove', handleMouseMove)
    renderer.domElement.addEventListener('mouseup', handleMouseUp)
    renderer.domElement.addEventListener('wheel', handleWheel)

    // Animation loop
    const animate = () => {
      frameId.current = requestAnimationFrame(animate)
      
      // Auto-rotate globe slowly
      if (globeRef.current && !isDragging) {
        globeRef.current.rotation.y += 0.002
      }
      
      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      if (frameId.current) {
        cancelAnimationFrame(frameId.current)
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.domElement.removeEventListener('mousedown', handleMouseDown)
      renderer.domElement.removeEventListener('mousemove', handleMouseMove)
      renderer.domElement.removeEventListener('mouseup', handleMouseUp)
      renderer.domElement.removeEventListener('wheel', handleWheel)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
    }
  }, [])

  return (
    <div className="w-full h-full relative">
      <div ref={mountRef} className="w-full h-full" />
      
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

      {/* Controls Info */}
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
          <div>📍 Click markers for news</div>
        </div>
      </motion.div>
    </div>
  )
}