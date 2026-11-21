import { apiRequest, jsonRequest } from './apiService'

export interface UpvoteRequestDTO {
  usuarioId: number
}

export interface UserUpvoteCacheEntry {
  reportId: number
  usuarioId: number
}

export async function darUpvote(reportId: number, usuarioId: number): Promise<unknown> {
  const response = await jsonRequest(
    'POST',
    `/api/reports/${reportId}/upvote`,
    { usuarioId } as UpvoteRequestDTO,
  )
  return parseResponse(response)
}

export async function getUserUpvotes(usuarioId: number): Promise<number[]> {
  const response = await apiRequest(`/api/usuarios/${usuarioId}/upvotes`)
  const reports = await parseResponse<Array<{ id: number }>>(response)
  const upvotedIds = reports.map((report) => report.id)
  const entries = upvotedIds.map((reportId) => ({ reportId, usuarioId }))
  localStorage.setItem(
    'user-upvotes',
    JSON.stringify(entries),
  )
  return upvotedIds
}

export function getCachedUpvoteEntries(): UserUpvoteCacheEntry[] {
  const cached = localStorage.getItem('user-upvotes')
  if (!cached) return []

  try {
    const entries = JSON.parse(cached) as UserUpvoteCacheEntry[]
    return Array.isArray(entries) ? entries : []
  } catch {
    localStorage.removeItem('user-upvotes')
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
