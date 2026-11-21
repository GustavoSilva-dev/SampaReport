import { apiRequest, jsonRequest } from './apiService'
import type { Avaliacao, AvaliacaoRequestDTO } from '../types'

const GRADES_CACHE_KEY = 'grades-history'

export function getCachedGrades(): Avaliacao[] {
  const cached = localStorage.getItem(GRADES_CACHE_KEY)
  if (!cached) return []

  try {
    const grades = JSON.parse(cached) as Avaliacao[]
    return Array.isArray(grades) ? grades : []
  } catch {
    localStorage.removeItem(GRADES_CACHE_KEY)
    return []
  }
}

export async function getGrades(): Promise<Avaliacao[]> {
  try {
    const response = await apiRequest('/api/reports/grade')
    if (!response.ok) return getCachedGrades()

    const grades = await response.json().catch(() => null) as Avaliacao[] | null
    const result = Array.isArray(grades) ? grades : getCachedGrades()
    localStorage.setItem(GRADES_CACHE_KEY, JSON.stringify(result))
    return result
  } catch {
    return getCachedGrades()
  }
}

export async function sendGrade(reportId: number, dto: AvaliacaoRequestDTO): Promise<Avaliacao> {
  const response = await jsonRequest(
    'POST',
    `/api/reports/${reportId}/grade`,
    { nota: dto.nota, usuarioId: dto.usuarioId } as AvaliacaoRequestDTO,
  )

  if (!response.ok) {
    throw new Error('Não foi possível enviar sua avaliação.')
  }

  const grade = await response.json() as Avaliacao
  const grades = getCachedGrades().filter((item) => item.reportId !== reportId)
  localStorage.setItem(GRADES_CACHE_KEY, JSON.stringify([...grades, grade]))
  return grade
}
