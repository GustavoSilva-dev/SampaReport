import { apiRequest } from './apiService'

export interface ReportHistory {
  id: number
  reportId: number
  statusAnterior: string | null
  statusNovo: string
  dataAlteracao: string
}

interface ReportHistoryResponse {
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

export async function getReportHistory(reportId: number): Promise<ReportHistory[]> {
  const response = await apiRequest(`/api/reports/${reportId}/history`, {
    method: 'GET',
  })

  if (!response.ok) {
    throw new Error(`Erro ao carregar histórico da ocorrência #${reportId}`)
  }

  const result = await response.json() as ReportHistoryResponse[]

  return result.map((item) => ({
    id: item.id ?? item.idHistory ?? 0,
    reportId: item.reportId ?? item.idReport ?? reportId,
    statusAnterior: item.statusAnterior ?? item.dsStatusAnterior ?? null,
    statusNovo: item.statusNovo ?? item.dsStatusNovo ?? '',
    dataAlteracao: item.dataAlteracao ?? item.dtMudanca ?? '',
  }))
}
