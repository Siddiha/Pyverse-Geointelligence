export interface CountryCoordinates {
  lat: number
  lng: number
}

export interface CountryNode {
  country: string
  coordinates: CountryCoordinates
  isActive: boolean
  isHovered: boolean
  newsCount: number
}

export interface GlobeSettings {
  autoRotate: boolean
  rotationSpeed: number
  enableZoom: boolean
  showCountryLabels: boolean
  showNewsMarkers: boolean
}