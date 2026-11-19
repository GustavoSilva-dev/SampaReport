import { apiRequest, jsonRequest } from './apiService'
import type { ComentarioResponseDTO, ComentarioRequestDTO } from '../types'

export async function getComments(reportId: number): Promise<ComentarioResponseDTO[]> {
  const response = await apiRequest(`/api/reports/${reportId}/comments`, {
    method: 'GET',
  })

  if (!response.ok) {
    throw new Error(`Erro ao carregar os comentários da ocorrência #${reportId}`)
  }

  return response.json()
}

export async function addComment(reportId: number, dto: ComentarioRequestDTO): Promise<ComentarioResponseDTO> {
  const response = await jsonRequest('POST', `/api/reports/${reportId}/comments`, dto)

  if (!response.ok) {
    throw new Error('Não foi possível enviar o comentário')
  }

  return response.json()
}
