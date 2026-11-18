export interface MapCoordinates {
  latitude: number
  longitude: number
}

export interface LocationSuggestion extends MapCoordinates {
  displayName: string
}

interface NominatimResult {
  lat: string
  lon: string
  display_name: string
  address?: {
    road?: string
    pedestrian?: string
    footway?: string
    suburb?: string
    neighbourhood?: string
    city_district?: string
    city?: string
    town?: string
    municipality?: string
  }
}

const NOMINATIM_HEADERS = {
  Accept: 'application/json',
  'Accept-Language': 'pt-BR',
}

export async function searchLocations(address: string): Promise<LocationSuggestion[]> {
  const query = address.trim()
  if (query.length < 3) return []

  const params = new URLSearchParams({
    q: `${query}, São Paulo, Brasil`,
    format: 'json',
    limit: '3',
    addressdetails: '1',
    countrycodes: 'br',
  })
  const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
    headers: NOMINATIM_HEADERS,
  })

  if (!response.ok) {
    throw new Error('Não foi possível pesquisar locais no mapa.')
  }

  const results = await response.json() as NominatimResult[]
  return results
    .filter((result) => result.address?.road || result.address?.pedestrian || result.address?.footway)
    .map((result) => ({
      displayName: result.display_name,
      latitude: Number(result.lat),
      longitude: Number(result.lon),
    }))
}

export async function getCoordinatesFromAddress(address: string): Promise<MapCoordinates | null> {
  const query = address.trim()
  if (!query) return null

  const params = new URLSearchParams({
    q: query,
    format: 'json',
    limit: '1',
    addressdetails: '1',
    countrycodes: 'br',
  })
  const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
    headers: NOMINATIM_HEADERS,
  })

  if (!response.ok) {
    throw new Error('Não foi possível buscar o endereço no mapa.')
  }

  const results = await response.json() as NominatimResult[]
  const result = results[0]
  if (!result) return null

  return {
    latitude: Number(result.lat),
    longitude: Number(result.lon),
  }
}

export async function getAddressFromCoordinates(lat: number, lon: number): Promise<string> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    format: 'json',
    addressdetails: '1',
  })
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params}`, {
    headers: NOMINATIM_HEADERS,
  })

  if (!response.ok) {
    throw new Error('Não foi possível obter o endereço da sua localização.')
  }

  const result = await response.json() as NominatimResult
  const address = result.address
  if (!address) return result.display_name

  const street = address.road || address.pedestrian || address.footway
  const neighborhood = address.suburb || address.neighbourhood || address.city_district
  const city = address.city || address.town || address.municipality

  return [street, neighborhood, city].filter(Boolean).join(', ') || result.display_name
}

export async function getCityFromCoordinates(lat: number, lon: number): Promise<string> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    format: 'json',
    addressdetails: '1',
  })
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params}`, {
    headers: NOMINATIM_HEADERS,
  })

  if (!response.ok) {
    throw new Error('Não foi possível obter a cidade da localização.')
  }

  const result = await response.json() as NominatimResult
  console.log(result);
  const city = result.address?.road + (result.address?.suburb ? ", " + result.address?.suburb : '')
    || result.address?.town
    || result.address?.municipality
    || result.address?.suburb
    || result.address?.neighbourhood

  return city || 'São Paulo'
}
