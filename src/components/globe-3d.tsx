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
  const frameId = useRef<number>()
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

  useEffect(() => {
    if (!mountRef.current) return

    const mount = mountRef.current
    const width = mount.clientWidth
    const height = mount.clientHeight

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
    camera.position.z = 6

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    mount.appendChild(renderer.domElement)

    // ── Single group — everything rotates together ──
    const globeGroup = new THREE.Group()
    scene.add(globeGroup)

    // Globe sphere
    const globeMesh = new THREE.Mesh(
      new THREE.SphereGeometry(2.5, 128, 128),
      new THREE.MeshPhongMaterial({ color: 0x0a0a0a, shininess: 200 })
    )
    globeGroup.add(globeMesh)

    // Wireframe overlay
    const wireframe = new THREE.Mesh(
      new THREE.SphereGeometry(2.51, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3, wireframe: true })
    )
    globeGroup.add(wireframe)

    // Atmosphere glow
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(2.6, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15, side: THREE.BackSide })
    )
    globeGroup.add(atmosphere)

    // Country markers — stored for raycasting
    const markers: THREE.Mesh[] = []

    Object.entries(countryCoordinates).forEach(([country, coords]) => {
      const { lat, lng } = coords
      const phi = (90 - lat) * (Math.PI / 180)
      const theta = (lng + 180) * (Math.PI / 180)
      const r = 2.55
      const x = -(r * Math.sin(phi) * Math.cos(theta))
      const z = r * Math.sin(phi) * Math.sin(theta)
      const y = r * Math.cos(phi)

      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 })
      )
      marker.position.set(x, y, z)
      marker.userData = { country }
      globeGroup.add(marker)
      markers.push(marker)

      // Glow ring
      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(0.09, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.25 })
      )
      glow.position.set(x, y, z)
      globeGroup.add(glow)
    })

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.4))
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
    dirLight.position.set(10, 10, 5)
    scene.add(dirLight)
    const pointLight = new THREE.PointLight(0xffffff, 0.3)
    pointLight.position.set(-10, -10, -5)
    scene.add(pointLight)

    // ── Mouse / drag state ──
    let isDragging = false
    let didDrag = false
    let prevMouse = { x: 0, y: 0 }

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true
      didDrag = false
      prevMouse = { x: e.clientX, y: e.clientY }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const dx = e.clientX - prevMouse.x
      const dy = e.clientY - prevMouse.y
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) didDrag = true
      globeGroup.rotation.y += dx * 0.008
      globeGroup.rotation.x += dy * 0.008
      prevMouse = { x: e.clientX, y: e.clientY }
    }

    const handleMouseUp = (e: MouseEvent) => {
      if (!didDrag) {
        // It was a click — check for marker hit
        const rect = renderer.domElement.getBoundingClientRect()
        const mouse = new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1
        )
        const raycaster = new THREE.Raycaster()
        raycaster.setFromCamera(mouse, camera)
        raycaster.params.Points = { threshold: 0.1 }

        const hits = raycaster.intersectObjects(markers)
        if (hits.length > 0) {
          const country = hits[0].object.userData.country as string
          setSelectedCountry(country)
          onCountryClick?.(country)
        }
      }
      isDragging = false
    }

    const handleWheel = (e: WheelEvent) => {
      camera.position.z = Math.max(4, Math.min(12, camera.position.z + e.deltaY * 0.01))
    }

    renderer.domElement.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    renderer.domElement.addEventListener('wheel', handleWheel)

    // ── Animation loop ──
    const animate = () => {
      frameId.current = requestAnimationFrame(animate)
      if (!isDragging) {
        globeGroup.rotation.y += 0.003 // slow steady auto-spin
      }
      renderer.render(scene, camera)
    }
    animate()

    // Resize
    const handleResize = () => {
      if (!mount) return
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      if (frameId.current) cancelAnimationFrame(frameId.current)
      renderer.domElement.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      renderer.domElement.removeEventListener('wheel', handleWheel)
      window.removeEventListener('resize', handleResize)
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [onCountryClick])

  return (
    <div className="w-full h-full relative">
      <div ref={mountRef} className="w-full h-full" />

      {selectedCountry && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-white/20 p-4 rounded-xl"
        >
          <div className="text-center">
            <h3 className="text-lg font-bold text-white">{selectedCountry}</h3>
            <p className="text-sm text-gray-300">Loading latest news...</p>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 right-6 bg-black/80 backdrop-blur-xl border border-white/20 p-4 rounded-xl"
      >
        <div className="text-sm text-gray-300 mb-2">Live Statistics</div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between gap-4">
            <span className="text-gray-400">Countries:</span>
            <span className="text-blue-400">{Object.keys(countryCoordinates).length}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-400">News Sources:</span>
            <span className="text-green-400">200+</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-400">Updates:</span>
            <span className="text-yellow-400">Real-time</span>
          </div>
        </div>
      </motion.div>

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
          <div>📍 Click markers for news</div>
        </div>
      </motion.div>
    </div>
  )
}
