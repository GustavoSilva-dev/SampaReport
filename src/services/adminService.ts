import { jsonRequest } from './apiService'
import type { JustificativaRequestDTO, StatusUpdateDTO } from '../types'

export async function updateReportStatus(reportId: number, status: string): Promise<unknown> {
  const response = await jsonRequest('PATCH', `/api/reports/${reportId}/status`, {
    status,
  } as StatusUpdateDTO)

  if (!response.ok) {
    throw new Error('Nao foi possivel atualizar o status do report.')
  }

  return response.json().catch(() => null)
}

export async function concluirServico(reportId: number, dto: JustificativaRequestDTO): Promise<unknown> {
  const response = await jsonRequest('POST', `/api/reports/${reportId}/justify`, dto)

  if (!response.ok) {
    throw new Error('Nao foi possivel concluir o atendimento.')
  }
  
  return response.json().catch(() => null)
}
