import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { HistoricoReport } from '../../types'

interface AuditModalProps {
  isOpen: boolean
  onClose: () => void
  reportId: number
  codigoProtocolo: string
  statusAtual: string
}

interface AuditStage {
  status: string
  title: string
}

const auditStages: AuditStage[] = [
  { status: 'AGUARDANDO_APROVACAO', title: 'Ocorrência Registrada pelo Cidadão' },
  { status: 'AGUARDANDO_HOMOLOGACAO', title: 'Aprovação Comunitária (5/5 Votos)' },
  { status: 'EM_ANDAMENTO', title: 'Atendimento & Equipe em Campo' },
  { status: 'EM_HOMOLOGACAO', title: 'Homologação & Envio do Antes/Depois' },
  { status: 'CONCLUIDO', title: 'Conclusão & Avaliação Cidadã' },
]

const currentStatusMap: Record<string, string> = {
  'Aguardando Aprovação': 'AGUARDANDO_APROVACAO',
  'Aguardando Atendimento': 'AGUARDANDO_HOMOLOGACAO',
  'Aguardando Homologação': 'AGUARDANDO_HOMOLOGACAO',
  'Em Andamento': 'EM_ANDAMENTO',
  'Em Homologação': 'EM_HOMOLOGACAO',
  Concluído: 'CONCLUIDO',
}

const mockHistory: HistoricoReport[] = [
  {
    idHistory: 1,
    idReport: 1,
    dsStatusNovo: 'AGUARDANDO_APROVACAO',
    dtMudanca: '2025-02-15T14:32:00',
  },
  {
    idHistory: 2,
    idReport: 2,
    dsStatusAnterior: 'AGUARDANDO_APROVACAO',
    dsStatusNovo: 'AGUARDANDO_APROVACAO',
    dtMudanca: '2025-02-02T14:20:00',
  },
  {
    idHistory: 3,
    idReport: 2,
    dsStatusAnterior: 'AGUARDANDO_APROVACAO',
    dsStatusNovo: 'AGUARDANDO_HOMOLOGACAO',
    dtMudanca: '2025-02-02T16:10:00',
    dsJustificativa: 'A comunidade atingiu a meta mínima de apoios.',
  },
  {
    idHistory: 4,
    idReport: 3,
    dsStatusAnterior: 'AGUARDANDO_APROVACAO',
    dsStatusNovo: 'AGUARDANDO_APROVACAO',
    dtMudanca: '2025-02-01T10:15:00',
  },
  {
    idHistory: 5,
    idReport: 3,
    dsStatusAnterior: 'AGUARDANDO_APROVACAO',
    dsStatusNovo: 'AGUARDANDO_HOMOLOGACAO',
    dtMudanca: '2025-02-02T11:30:00',
  },
  {
    idHistory: 6,
    idReport: 3,
    dsStatusAnterior: 'AGUARDANDO_HOMOLOGACAO',
    dsStatusNovo: 'EM_ANDAMENTO',
    dtMudanca: '2025-02-03T08:45:00',
    dsJustificativa: 'Chamado encaminhado para a equipe responsável.',
  },
]

function formatHistoryDate(value: string) {
  const date = new Date(value)
  const datePart = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' })
    .format(date)
    .replace('.', '')
  const timePart = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(date)

  return `${datePart.charAt(0).toUpperCase()}${datePart.slice(1)}, ${timePart}h`
}

export function AuditModal({ isOpen, onClose, reportId, codigoProtocolo, statusAtual }: AuditModalProps) {
  const [history, setHistory] = useState<HistoricoReport[]>([])

  useEffect(() => {
    if (!isOpen) return

    // Mock do GET /api/reports/${reportId}/history
    setHistory(mockHistory.filter((item) => item.idReport === reportId))
  }, [isOpen, reportId])

  if (!isOpen) return null

  const currentStatus = currentStatusMap[statusAtual] ?? statusAtual
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
            <p className="mt-1 truncate text-xs text-zinc-500">{codigoProtocolo} <span aria-hidden="true">•</span> Acompanhamento Atualizado</p>
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

        <div className="mt-6 space-y-5">
          {auditStages.map((stage, index) => {
            const stageHistory = history.find((item) => item.dsStatusNovo === stage.status)
            const isCompleted = Boolean(stageHistory) || (currentStageIndex >= index && currentStageIndex >= 0)

            return (
              <div key={stage.status} className="flex items-start gap-3">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${isCompleted ? 'bg-emerald-700 text-white' : 'bg-zinc-200 text-zinc-500'}`}>
                  {index + 1}
                </div>
                <div className="min-w-0 pt-0.5">
                  <p className={`text-sm font-medium ${isCompleted ? 'text-zinc-900' : 'text-zinc-500'}`}>{stage.title}</p>
                  <p className="mt-1 text-xs text-zinc-400">
                    {stageHistory ? formatHistoryDate(stageHistory.dtMudanca) : 'Aguardando trâmite'}
                  </p>
                  {stageHistory?.dsJustificativa && <p className="mt-1 text-xs leading-4 text-emerald-700 animate-pulse">{stageHistory.dsJustificativa}</p>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>,
    document.body,
  )
}
