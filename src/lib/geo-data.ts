// Major countries and their coordinates for the globe
export const countryCoordinates = {
  'United States': { lat: 39.8283, lng: -98.5795 },
  'China': { lat: 35.8617, lng: 104.1954 },
  'India': { lat: 20.5937, lng: 78.9629 },
  'Brazil': { lat: -14.2350, lng: -51.9253 },
  'Russia': { lat: 61.5240, lng: 105.3188 },
  'Japan': { lat: 36.2048, lng: 138.2529 },
  'Germany': { lat: 51.1657, lng: 10.4515 },
  'United Kingdom': { lat: 55.3781, lng: -3.4360 },
  'France': { lat: 46.2276, lng: 2.2137 },
  'Italy': { lat: 41.8719, lng: 12.5674 },
  'Canada': { lat: 56.1304, lng: -106.3468 },
  'Australia': { lat: -25.2744, lng: 133.7751 },
  'Mexico': { lat: 23.6345, lng: -102.5528 },
  'South Korea': { lat: 35.9078, lng: 127.7669 },
  'Spain': { lat: 40.4637, lng: -3.7492 },
  'Turkey': { lat: 38.9637, lng: 35.2433 },
  'Indonesia': { lat: -0.7893, lng: 113.9213 },
  'Netherlands': { lat: 52.1326, lng: 5.2913 },
  'Saudi Arabia': { lat: 23.8859, lng: 45.0792 },
  'Switzerland': { lat: 46.8182, lng: 8.2275 },
  'Taiwan': { lat: 23.6978, lng: 120.9605 },
  'Belgium': { lat: 50.5039, lng: 4.4699 },
  'Argentina': { lat: -38.4161, lng: -63.6167 },
  'Sweden': { lat: 60.1282, lng: 18.6435 },
  'Poland': { lat: 51.9194, lng: 19.1451 },
  'Ireland': { lat: 53.4129, lng: -8.2439 },
  'Israel': { lat: 31.0461, lng: 34.8516 },
  'Nigeria': { lat: 9.0820, lng: 8.6753 },
  'Egypt': { lat: 26.0975, lng: 30.0444 },
  'South Africa': { lat: -30.5595, lng: 22.9375 },
  'Thailand': { lat: 15.8700, lng: 100.9925 },
  'Malaysia': { lat: 4.2105, lng: 101.9758 },
  'Singapore': { lat: 1.3521, lng: 103.8198 },
  'Philippines': { lat: 12.8797, lng: 121.7740 },
  'Vietnam': { lat: 14.0583, lng: 108.2772 },
  'Chile': { lat: -35.6751, lng: -71.5430 },
  'Norway': { lat: 60.4720, lng: 8.4689 },
  'Finland': { lat: 61.9241, lng: 25.7482 },
  'Denmark': { lat: 56.2639, lng: 9.5018 },
  'Ukraine': { lat: 48.3794, lng: 31.1656 },
  'Bangladesh': { lat: 23.6850, lng: 90.3563 },
  'Pakistan': { lat: 30.3753, lng: 69.3451 },
  'Kenya': { lat: -0.0236, lng: 37.9062 },
  'Morocco': { lat: 31.7917, lng: -7.0926 },
  'New Zealand': { lat: -40.9006, lng: 174.8860 },
  'Portugal': { lat: 39.3999, lng: -8.2245 },
  'Greece': { lat: 39.0742, lng: 21.8243 },
  'Czech Republic': { lat: 49.8175, lng: 15.4730 },
  'Hungary': { lat: 47.1625, lng: 19.5033 },
  'Austria': { lat: 47.5162, lng: 14.5501 },
  'Colombia': { lat: 4.5709, lng: -74.2973 }
}

export const getCountryByCoordinates = (lat: number, lng: number) => {
  const threshold = 5 // degrees
  for (const [country, coords] of Object.entries(countryCoordinates)) {
    if (
      Math.abs(coords.lat - lat) < threshold &&
      Math.abs(coords.lng - lng) < threshold
    ) {
      return country
    }
  }
  return null
}

export const getDistanceBetweenCountries = (country1: string, country2: string) => {
  const coords1 = countryCoordinates[country1 as keyof typeof countryCoordinates]
  const coords2 = countryCoordinates[country2 as keyof typeof countryCoordinates]
  
  if (!coords1 || !coords2) return null
  
  const R = 6371 // Earth's radius in km
  const dLat = (coords2.lat - coords1.lat) * Math.PI / 180
  const dLng = (coords2.lng - coords1.lng) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coords1.lat * Math.PI / 180) * Math.cos(coords2.lat * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}