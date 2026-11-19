import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { getReportHistory, type ReportHistory } from '../../services/logService'

interface AuditModalProps {
  isOpen: boolean
  onClose: () => void
  reportId: number
  statusAtual: string
}

interface AuditStage {
  status: string
  title: string
  activeDescription: string
}

const auditStages: AuditStage[] = [
  { status: 'PENDENTE_COMUNIDADE', title: 'Ocorrência Registrada pelo Cidadão', activeDescription: 'Aguardando apoio comunitário' },
  { status: 'APROVADO_COMUNIDADE', title: 'Aprovação Comunitária (5/5 Votos)', activeDescription: 'Aguardando andamento da prefeitura' },
  { status: 'EM_ANDAMENTO', title: 'Atendimento & Equipe em Campo', activeDescription: 'Chamado encaminhado para a equipe responsável' },
  { status: 'EM_HOMOLOGACAO', title: 'Homologação & Envio do Antes/Depois', activeDescription: 'Aguardando avaliação cidadã' },
  { status: 'CONCLUIDO', title: 'Conclusão & Avaliação Cidadã', activeDescription: 'Chamado Concluído!' },
]

const statusMap: Record<string, string> = {
  'Aguardando Aprovação': 'PENDENTE_COMUNIDADE',
  'Aguardando Atendimento': 'APROVADO_COMUNIDADE',
  'Aguardando Homologação': 'EM_HOMOLOGACAO',
  PENDENTE_COMUNIDADE: 'PENDENTE_COMUNIDADE',
  APROVADO_COMUNIDADE: 'APROVADO_COMUNIDADE',
  'Aprovado pela Comunidade': 'APROVADO_COMUNIDADE',
  'Em Andamento': 'EM_ANDAMENTO',
  'Em Homologação': 'EM_HOMOLOGACAO',
  'Concluído': 'CONCLUIDO',
  EM_ANDAMENTO: 'EM_ANDAMENTO',
  EM_HOMOLOGACAO: 'EM_HOMOLOGACAO',
  CONCLUIDO: 'CONCLUIDO',
  AGUARDANDO_APROVACAO: 'PENDENTE_COMUNIDADE',
  AGUARDANDO_HOMOLOGACAO: 'APROVADO_COMUNIDADE',
}

function formatHistoryDate(value: string) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const datePart = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' })
    .format(date)
    .replace('.', '')
  const timePart = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(date)

  return `${datePart.charAt(0).toUpperCase()}${datePart.slice(1)}, ${timePart}h`
}

export function AuditModal({ isOpen, onClose, reportId, statusAtual }: AuditModalProps) {
  const [history, setHistory] = useState<ReportHistory[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isOpen) return
    let isActive = true

    async function loadHistory() {
      setIsLoading(true)
      setError('')
      setHistory([])

      try {
        const result = await getReportHistory(reportId)
        if (isActive) setHistory(result)
      } catch (loadError) {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : 'Erro ao carregar histórico da ocorrência')
        }
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    void loadHistory()
    return () => {
      isActive = false
    }
  }, [isOpen, reportId])

  if (!isOpen) return null

  const currentStatus = statusMap[statusAtual] ?? statusAtual
  const currentStageIndex = auditStages.findIndex((stage) => stage.status === currentStatus)

  return createPortal(
    <div
      className="fixed inset-0 z-[1100] flex items-start justify-center overflow-y-auto overscroll-contain bg-black/50 p-3 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="audit-modal-title"
    >
      <div className="reveal-up my-auto w-full max-w-md rounded-2xl border border-zinc-100 bg-white p-5 shadow-xl sm:p-6">
        <header className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 id="audit-modal-title" className="font-bold text-zinc-900">Log de Auditoria &amp; Registros</h2>
            <p className="mt-1 truncate text-xs text-zinc-500">#SP-2026: Código {reportId} <span aria-hidden="true">•</span> Acompanhamento Atualizado</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-lg leading-none text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
            aria-label="Fechar histórico de auditoria"
          >
            ×
          </button>
        </header>

        {isLoading && (
          <p className="mt-6 text-sm text-zinc-500" role="status">Carregando registros...</p>
        )}
        {error && (
          <p className="mt-6 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p>
        )}

        {!isLoading && !error && <div className="mt-6 space-y-5">
          {auditStages.map((stage, index) => {
            const stageHistory = [...history].reverse().find((item) => {
              const mappedStatus = statusMap[item.statusNovo] ?? item.statusNovo
              return mappedStatus === stage.status
            })
            const isCompleted = currentStageIndex >= 0
              ? index < currentStageIndex
              : Boolean(stageHistory)
            const isActive = currentStageIndex >= 0
              ? index === currentStageIndex
              : Boolean(stageHistory) && index === auditStages.length - 1

            return (
              <div key={stage.status} className="flex items-start gap-3">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${isCompleted || isActive ? 'bg-emerald-700 text-white' : 'bg-zinc-200 text-zinc-500'}`}>
                  {index + 1}
                </div>
                <div className="min-w-0 pt-0.5">
                  <p className={`text-sm font-medium ${isCompleted || isActive ? 'text-zinc-900' : 'text-zinc-500'}`}>{stage.title}</p>
                  {isCompleted && stageHistory && (
                    <p className="mt-1 text-xs text-zinc-400">{formatHistoryDate(stageHistory.dataAlteracao)}</p>
                  )}
                  {isActive && (
                    <>
                      {stageHistory?.dataAlteracao && <p className="mt-1 text-xs text-zinc-400">{formatHistoryDate(stageHistory.dataAlteracao)}</p>}
                      <p className="mt-1 text-xs font-medium text-[#12a879] animate-pulse">{stage.activeDescription}</p>
                    </>
                  )}
                  {!isCompleted && !isActive && (
                    <p className="mt-1 text-xs text-zinc-400">Aguardando trâmite</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>}
      </div>
    </div>,
    document.body,
  )
}
