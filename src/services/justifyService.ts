import { apiRequest } from './apiService'
import type { Justificativa } from '../types'

const JUSTIFY_CACHE_KEY = 'justify-list'

function getCachedJustifications(): Record<number, Justificativa> {
  const cached = localStorage.getItem(JUSTIFY_CACHE_KEY)
  if (!cached) return {}

  try {
    const value = JSON.parse(cached) as Record<number, Justificativa>
    return value && typeof value === 'object' ? value : {}
  } catch {
    localStorage.removeItem(JUSTIFY_CACHE_KEY)
    return {}
  }
}

export function getCachedJustificativa(reportId: number): Justificativa | null {
  return getCachedJustifications()[reportId] ?? null
}

export async function getJustificativaByReportId(reportId: number): Promise<Justificativa | null> {
  try {
    const response = await apiRequest(`/api/reports/${reportId}/justify`)
    if (!response.ok) return getCachedJustificativa(reportId)

    const data = await response.json().catch(() => null) as Justificativa | null
    if (!data) return getCachedJustificativa(reportId)

    const cache = getCachedJustifications()
    cache[reportId] = data
    localStorage.setItem(JUSTIFY_CACHE_KEY, JSON.stringify(cache))
    return data
  } catch {
    return getCachedJustificativa(reportId)
  }
}
