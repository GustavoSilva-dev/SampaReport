import { apiRequest } from './apiService'

export interface UsuarioResponseDTO {
  id: number
  nome: string
  email: string
  perfil: string
  dataCriacao: string
}

const USERS_CACHE_KEY = 'platform-users'

export async function getUsers(): Promise<UsuarioResponseDTO[]> {
  const response = await apiRequest('/api/usuarios')
  const users = await parseResponse<UsuarioResponseDTO[]>(response)
  localStorage.setItem(USERS_CACHE_KEY, JSON.stringify(users))
  return users
}

export function getCachedUsers(): UsuarioResponseDTO[] {
  const cached = localStorage.getItem(USERS_CACHE_KEY)
  if (!cached) return []

  try {
    const users = JSON.parse(cached) as UsuarioResponseDTO[]
    return Array.isArray(users) ? users : []
  } catch {
    localStorage.removeItem(USERS_CACHE_KEY)
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
    }

    throw new Error(responseText || `A API retornou o erro ${response.status}.`)
  }

  return responseBody as T
}
