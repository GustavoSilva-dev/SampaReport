import { apiRequest } from './apiService'
import type { GeneralRatingResponse } from '../types'

const GENERAL_RATING_CACHE_KEY = 'general-rating'

export function getCachedGeneralRating(): GeneralRatingResponse {
  const cached = localStorage.getItem(GENERAL_RATING_CACHE_KEY)
  if (!cached) return { generalRating: 0, totalReviews: 0 }

  try {
    return normalizeRating(JSON.parse(cached))
  } catch {
    localStorage.removeItem(GENERAL_RATING_CACHE_KEY)
    return { generalRating: 0, totalReviews: 0 }
  }
}

export async function getGeneralRating(): Promise<GeneralRatingResponse> {
  try {
    const response = await apiRequest('/api/metrics/general-rating')
    if (!response.ok) return getCachedGeneralRating()

    const data = await response.json().catch(() => null) as Partial<GeneralRatingResponse> | null
    const rating = normalizeRating(data)
    localStorage.setItem(GENERAL_RATING_CACHE_KEY, JSON.stringify(rating))
    return rating
  } catch {
    return getCachedGeneralRating()
  }
}

function normalizeRating(data: unknown): GeneralRatingResponse {
  if (!data || typeof data !== 'object') {
    return { generalRating: 0, totalReviews: 0 }
  }

  const rating = 'generalRating' in data ? Number(data.generalRating) : 0
  const reviews = 'totalReviews' in data ? Number(data.totalReviews) : 0

  return {
    generalRating: Number.isFinite(rating) ? Math.min(Math.max(rating, 0), 5) : 0,
    totalReviews: Number.isFinite(reviews) ? Math.max(Math.trunc(reviews), 0) : 0,
  }
}
