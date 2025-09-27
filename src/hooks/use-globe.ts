import { useState, useCallback } from 'react'

interface GlobeState {
  selectedCountry: string | null
  hoveredCountry: string | null
  isRotating: boolean
  zoom: number
}

export const useGlobe = () => {
  const [state, setState] = useState<GlobeState>({
    selectedCountry: null,
    hoveredCountry: null,
    isRotating: true,
    zoom: 15
  })

  const selectCountry = useCallback((country: string | null) => {
    setState(prev => ({ ...prev, selectedCountry: country }))
  }, [])

  const hoverCountry = useCallback((country: string | null) => {
    setState(prev => ({ ...prev, hoveredCountry: country }))
  }, [])

  const toggleRotation = useCallback(() => {
    setState(prev => ({ ...prev, isRotating: !prev.isRotating }))
  }, [])

  const setZoom = useCallback((zoom: number) => {
    setState(prev => ({ ...prev, zoom: Math.max(8, Math.min(25, zoom)) }))
  }, [])

  return {
    ...state,
    selectCountry,
    hoverCountry,
    toggleRotation,
    setZoom
  }
}