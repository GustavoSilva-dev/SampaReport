export type UserRole = 'ROLE_USER' | 'ROLE_ADMIN'

export type ReportType =
  | 'ASFALTO_BURACOS'
  | 'ILUMINACAO_PUBLICA'
  | 'SINALIZACAO_TRANSITO'
  | 'LIXO_ENTULHO'
  | 'ESGOTO_ALAGAMENTO'
  | 'MOBILIDADE_CALCADAS'

export interface ReportRequestDTO {
  titulo: string
  descricao: string
  categoria: ReportType
  latitude: number
  longitude: number
  fotoAntesUrl: string
  usuarioId: number
}

export type ReportStatus =
  | 'PENDENTE_COMUNIDADE'
  | 'APROVADO_COMUNIDADE'
  | 'EM_ANDAMENTO'
  | 'EM_HOMOLOGACAO'
  | 'CONCLUIDO'
  | 'CANCELADO'

export interface ReportResponseDTO {
  id: number
  titulo: string
  descricao: string
  categoria: ReportType | string
  latitude: number
  longitude: number
  fotoAntesUrl: string
  status: ReportStatus
  quantidadeUpvotes: number
  dataCriacao: string
  usuarioId: number
}

export type AdminStatus = 'AGUARDANDO_HOMOLOGACAO' | 'EM_ANDAMENTO' | 'CONCLUIDO'

export interface AdminReport {
  id: number
  titulo: string
  descricao: string
  endereco: string
  categoria: string
  status: AdminStatus
  quantidadeApoios: number
  imagemUrl: string
  autor: string
}

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
  justificativa?: Justificativa
  avaliacao?: number
}

export interface Justificativa {
  id: number
  fotoDepoisUrl: string
  notaTecnica: string
  dataConclusao: string
  adminId: number
  reportId: number
}

export interface ComentarioRequestDTO {
  texto: string
  usuarioId: number
}

export interface ComentarioResponseDTO {
  id: number
  texto: string
  dataCriacao: string
  usuarioId: number
  reportId: number
  usuarioNome: string
}

export interface ReportHistory {
  id: number
  reportId: number
  statusAnterior: string | null
  statusNovo: string
  dataAlteracao: string
}

export interface ReportHistoryResponse {
  id?: number
  idHistory?: number
  reportId?: number
  idReport?: number
  statusAnterior?: string | null
  dsStatusAnterior?: string | null
  statusNovo?: string
  dsStatusNovo?: string
  dataAlteracao?: string
  dtMudanca?: string
}

export interface StatusUpdateDTO {
  status: string
}

export interface JustificativaRequestDTO {
  fotoDepoisUrl: string
  notaTecnica: string
  adminId: number
}

export interface GeneralRatingResponse {
  generalRating: number
  totalReviews: number
}