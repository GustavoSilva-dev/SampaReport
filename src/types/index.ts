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
  justificativa?: {
    dsImagemDepoisUrl?: string
    dsJustificativa: string
  }
  avaliacao?: number
}

export interface Comentario {
  id: number
  idReport: number
  conteudo: string
  dataCriacao: string
  autor: {
    id: number
    nome: string
    role: string
  }
}

export interface HistoricoReport {
  idHistory: number
  idReport: number
  dsStatusAnterior?: string
  dsStatusNovo: string
  dtMudanca: string
  dsJustificativa: string
}
