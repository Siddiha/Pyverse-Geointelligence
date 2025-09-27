'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface CountryNodeProps {
  country: string
  lat: number
  lng: number
  onClick: () => void
  isHovered: boolean
  onHover: (country: string | null) => void
}

export default function CountryNode({ 
  country, 
  lat, 
  lng, 
  onClick, 
  isHovered, 
  onHover 
}: CountryNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [clicked, setClicked] = useState(false)

  // Convert lat/lng to 3D coordinates on sphere
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  
  const radius = 5.1 // Slightly above Earth surface
  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)

  // Animation frame
  useFrame(() => {
    if (meshRef.current) {
      const scale = isHovered ? 1.5 : clicked ? 1.3 : 1
      meshRef.current.scale.setScalar(scale)
      meshRef.current.rotation.y += 0.01
    }
  })

  const handleClick = (e: any) => {
    e.stopPropagation()
    setClicked(!clicked)
    onClick()
  }

  const handlePointerOver = (e: any) => {
    e.stopPropagation()
    onHover(country)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = (e: any) => {
    e.stopPropagation()
    onHover(null)
    document.body.style.cursor = 'auto'
  }

  const getNodeColor = () => {
    if (clicked) return '#ff6b6b'
    if (isHovered) return '#4ecdc4'
    return '#74b9ff'
  }

  return (
    <group position={[x, y, z]}>
      {/* Main node */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial 
          color={getNodeColor()}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Glow effect */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial 
          color={getNodeColor()}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Pulse ring for active nodes */}
      {(clicked || isHovered) && (
        <mesh>
          <ringGeometry args={[0.1, 0.15, 16]} />
          <meshBasicMaterial 
            color={getNodeColor()}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Country label on hover */}
      {isHovered && (
        <mesh position={[0, 0.2, 0]}>
          <planeGeometry args={[1, 0.3]} />
          <meshBasicMaterial 
            color="#000000"
            transparent
            opacity={0.7}
          />
        </mesh>
      )}
    </group>
  )
}