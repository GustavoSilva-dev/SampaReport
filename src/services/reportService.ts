import { apiRequest, jsonRequest } from './apiService'
import type { ReportRequestDTO, ReportResponseDTO } from '../types'

const REPORTS_CACHE_KEY = 'reports'

export async function createReport(reportData: ReportRequestDTO): Promise<unknown> {
  const response = await jsonRequest('POST', '/api/reports', reportData)
  return parseResponse(response)
}

export async function getReports(): Promise<ReportResponseDTO[]> {
  const response = await apiRequest('/api/reports')
  const reports = await parseResponse<ReportResponseDTO[]>(response)
  localStorage.setItem(REPORTS_CACHE_KEY, JSON.stringify(reports))
  return reports
}

export function getCachedReports(): ReportResponseDTO[] {
  const cached = localStorage.getItem(REPORTS_CACHE_KEY)
  if (!cached) return []

  try {
    const reports = JSON.parse(cached) as ReportResponseDTO[]
    return Array.isArray(reports) ? reports : []
  } catch {
    localStorage.removeItem(REPORTS_CACHE_KEY)
    return []
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  const responseText = await response.text()
  let responseBody: unknown

  try {
    responseBody = responseText ? JSON.parse(responseText) : undefined
  } catch {
    responseBody = undefined
  }

  if (!response.ok) {
    if (typeof responseBody === 'object' && responseBody !== null) {
      if ('message' in responseBody) throw new Error(String(responseBody.message))
      if ('mensagem' in responseBody) throw new Error(String(responseBody.mensagem))
      if ('error' in responseBody) throw new Error(String(responseBody.error))
    }

    throw new Error(responseText || `A API retornou o erro ${response.status}.`)
  }

  return responseBody as T
}
