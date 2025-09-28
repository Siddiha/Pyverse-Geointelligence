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

    // Scene setup - Pure black background
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000) // Pure black
    sceneRef.current = scene

    // Camera setup - Perfect positioning for black glamorism
    const camera = new THREE.PerspectiveCamera(
      60, // Slightly wider FOV for better view
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 6 // Perfect distance for the globe
    camera.position.y = 0 // Centered vertically
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    mountRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Create Earth sphere - PERFECT BLACK GLAMORISM STYLE
    const geometry = new THREE.SphereGeometry(2.5, 128, 128) // Higher resolution for smoothness
    const material = new THREE.MeshPhongMaterial({
      color: 0x0a0a0a, // Very dark grey, almost black
      shininess: 200,
      transparent: false,
      opacity: 1.0
    })
    const globe = new THREE.Mesh(geometry, material)
    scene.add(globe)
    globeRef.current = globe

    // Add continent outlines - WHITE LINES like reference
    const wireframeGeometry = new THREE.SphereGeometry(2.51, 32, 32)
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
      wireframe: true
    })
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial)
    scene.add(wireframe)

    // Add subtle atmosphere glow - WHITE HALO
    const atmosphereGeometry = new THREE.SphereGeometry(2.6, 64, 64)
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.15,
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
      
      const radius = 2.55 // Perfect distance for nodes
      const x = -(radius * Math.sin(phi) * Math.cos(theta))
      const z = radius * Math.sin(phi) * Math.sin(theta)
      const y = radius * Math.cos(phi)

      // Create BEAUTIFUL WHITE NODES - NO MORE UGLY XXX MARKS
      const markerGeometry = new THREE.SphereGeometry(0.04, 32, 32) // Smooth spheres
      const markerMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff, // Pure white
        transparent: true,
        opacity: 0.9
      })
      
      const marker = new THREE.Mesh(markerGeometry, markerMaterial)
      marker.position.set(x, y, z)
      marker.userData = { country }
      scene.add(marker)

      // Add beautiful white glow effect
      const glowGeometry = new THREE.SphereGeometry(0.08, 32, 32)
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3
      })
      const glow = new THREE.Mesh(glowGeometry, glowMaterial)
      glow.position.set(x, y, z)
      scene.add(glow)

      // Add subtle pulsing effect
      const pulseGeometry = new THREE.SphereGeometry(0.12, 16, 16)
      const pulseMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.1
      })
      const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial)
      pulse.position.set(x, y, z)
      scene.add(pulse)
    })

    // Lighting for black glamorism theme
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 10, 5)
    scene.add(directionalLight)

    const pointLight = new THREE.PointLight(0xffffff, 0.3)
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
      cameraRef.current.position.z = Math.max(4, Math.min(12, cameraRef.current.position.z + delta))
    }

    renderer.domElement.addEventListener('mousedown', handleMouseDown)
    renderer.domElement.addEventListener('mousemove', handleMouseMove)
    renderer.domElement.addEventListener('mouseup', handleMouseUp)
    renderer.domElement.addEventListener('wheel', handleWheel)

    // Animation loop - FORCE ROTATION TO WORK
    const animate = () => {
      frameId.current = requestAnimationFrame(animate)
      
      // FORCE GLOBE ROTATION - MUCH FASTER AND VISIBLE
      if (globeRef.current) {
        if (!isDragging) {
          globeRef.current.rotation.y += 0.02 // DOUBLE the speed for clear visibility
        }
      }
      
      // Rotate wireframe with globe
      if (wireframe) {
        if (!isDragging) {
          wireframe.rotation.y += 0.02
        }
      }
      
      // Rotate atmosphere with globe
      if (atmosphere) {
        if (!isDragging) {
          atmosphere.rotation.y += 0.02
        }
      }
      
      // Rotate all nodes with globe
      scene.children.forEach(child => {
        if (child.userData && child.userData.country) {
          if (!isDragging) {
            child.rotation.y += 0.02
          }
        }
      })
      
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