import { jsonRequest } from './apiService'

export interface UsuarioRequestDTO {
    nome: string
    email: string
    senha: string
    perfil?: string
}

export interface LoginRequestDTO {
    email: string
    senha: string
}

export interface UsuarioResponseDTO {
    id: number
    nome: string
    email: string
    perfil: string
    dataCriacao: string
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
            if ('message' in responseBody) {
                throw new Error(String(responseBody.message))
            }

            if ('mensagem' in responseBody) {
                throw new Error(String(responseBody.mensagem))
            }
        }

        throw new Error(responseText || `A API retornou o erro ${response.status}.`)
    }

    return responseBody as T
}

export async function handleLogin(credentials: LoginRequestDTO): Promise<UsuarioResponseDTO> {
    const response = await jsonRequest('POST', '/api/usuarios/login', credentials)
    const usuario = await parseResponse<UsuarioResponseDTO>(response)

    localStorage.setItem('logged-user', JSON.stringify(usuario))

    return usuario
}

export async function handleRegister(userData: UsuarioRequestDTO): Promise<UsuarioResponseDTO> {
    const response = await jsonRequest('POST', '/api/usuarios', {
        nome: userData.nome,
        email: userData.email,
        senha: userData.senha,
        perfil: userData.perfil || 'ROLE_USER',
    })

    const usuario = await parseResponse<UsuarioResponseDTO>(response)

    localStorage.setItem('logged-user', JSON.stringify(usuario))

    return usuario
}
