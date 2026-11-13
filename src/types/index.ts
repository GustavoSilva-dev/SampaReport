export type UserRole = 'ROLE_USER' | 'ROLE_ADMIN'

export interface Usuario {
  id: string
  nome: string
  email: string
  role: UserRole
}

export interface Report {
  id: string
  titulo: string
  descricao: string
  categoria: string
  endereco: string
  dataCriacao: string
  status: string
  quantidadeApoios: number
  imagemUrl: string
  autor: Usuario
}
