import { apiRequest, jsonRequest } from './apiService'
import type { ReportRequestDTO, ReportResponseDTO } from '../types'

const REPORTS_CACHE_KEY = 'reports-list'
const USER_REPORTS_CACHE_KEY = 'logged-user-reports'

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

export async function getUserReports(usuarioId: number): Promise<ReportResponseDTO[]> {
  try {
    const response = await apiRequest(`/api/usuarios/${usuarioId}/reports`)
    const reports = await parseResponse<ReportResponseDTO[]>(response)
    localStorage.setItem(USER_REPORTS_CACHE_KEY, JSON.stringify(reports))
    return reports
  } catch (error) {
    const cached = getCachedUserReports()
    if (cached.length > 0) return cached
    throw error
  }
}

export async function updateReport(reportId: number, reportData: ReportRequestDTO): Promise<ReportResponseDTO> {
  const response = await jsonRequest('PUT', `/api/reports/${reportId}`, reportData)
  const updated = await parseResponse<ReportResponseDTO>(response)

  const globalCache = getCachedReports().map((report) =>
    report.id === reportId ? { ...report, ...updated, id: reportId } : report,
  )
  localStorage.setItem(REPORTS_CACHE_KEY, JSON.stringify(globalCache))

  const loggedUser = JSON.parse(localStorage.getItem('logged-user') || '{}') as { id?: number }
  if (loggedUser.id) {
    const userCache = getCachedUserReports().map((report) =>
      report.id === reportId ? { ...report, ...updated, id: reportId } : report,
    )
    localStorage.setItem(USER_REPORTS_CACHE_KEY, JSON.stringify(userCache))
  }

  return updated
}

export async function deleteReport(reportId: number): Promise<void> {
  const response = await apiRequest(`/api/reports/${reportId}`, { method: 'DELETE' })
  if (!response.ok) {
    throw new Error('Não foi possível excluir a ocorrência.')
  }

  localStorage.setItem(
    REPORTS_CACHE_KEY,
    JSON.stringify(getCachedReports().filter((report) => report.id !== reportId)),
  )
  localStorage.setItem(
    USER_REPORTS_CACHE_KEY,
    JSON.stringify(getCachedUserReports().filter((report) => report.id !== reportId)),
  )
}

export function getCachedUserReports(): ReportResponseDTO[] {
  const cached = localStorage.getItem(USER_REPORTS_CACHE_KEY)
  if (!cached) return []

  try {
    const reports = JSON.parse(cached) as ReportResponseDTO[]
    return Array.isArray(reports) ? reports : []
  } catch {
    localStorage.removeItem(USER_REPORTS_CACHE_KEY)
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
