import type { Report } from '../types'
import { FaHistory, FaMapMarkerAlt } from 'react-icons/fa'
import { useState } from 'react'
import { CommentModal } from './modal/CommentModal'
import { AuditModal } from './modal/AuditModal'
import { MdEngineering } from "react-icons/md";

interface ReportCardProps {
  report: Report
  currentUserId?: string
  hasUpvoted?: boolean
  isUpvoting?: boolean
  onUpvote?: (reportId: number) => void
}

const statusMessages: Record<string, string> = {
  'Aguardando Atendimento': 'Em triagem pela prefeitura',
  'Em Andamento': 'A prefeitura já está trabalhando no seu chamado',
  'Em Homologação': 'Aguardando avaliação do usuário final',
}

export function ReportCard({ report, currentUserId, hasUpvoted = false, isUpvoting = false, onUpvote }: ReportCardProps) {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)
  const [isAuditOpen, setIsAuditOpen] = useState(false)
  const [activePhoto, setActivePhoto] = useState(0)
  const reportId = Number(report.id.replace(/\D/g, '')) || 0
  const initial = report.autor.nome.substring(0, 1).toUpperCase()
  const approvalProgress = Math.min((report.quantidadeApoios / 5) * 100, 100)
  const reachedApprovalGoal = report.quantidadeApoios >= 5
  const statusMessage = statusMessages[report.status]
  const photos = [report.imagemUrl, report.justificativa?.dsImagemDepoisUrl].filter((image): image is string => Boolean(image))
  const hasBeforeAndAfter = photos.length > 1
  const isPendingEvaluation = report.status === 'Em Homologação'
  const isCompleted = report.status === 'Concluído'
  const isReportOwner = report.autor.id === currentUserId

  return (
    <article className="w-full min-w-0 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm reveal-up sm:p-5">
      <div className="flex flex-wrap items-center gap-2 px-0.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-medium text-emerald-800">{initial}</div>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="text-[11px] font-medium text-zinc-900">{report.autor.nome}</p>
          <p className="flex min-w-0 items-center gap-1 text-[9px] text-zinc-500">
            <FaMapMarkerAlt className="h-1.5 w-2.5 shrink-0 text-emerald-500 animate-ping" title="Localização" />
            <span className="truncate">{report.dataCriacao} · {report.endereco}</span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 max-[400px]:basis-full max-[400px]:items-end">
          <button
            type="button"
            onClick={() => setIsAuditOpen(true)}
            className="flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-700 shadow-sm transition-colors hover:border-emerald-300 hover:bg-emerald-100"
          >
            <FaHistory className="text-emerald-700" /> Ver Linha do Tempo
          </button>
          <span className={`rounded-full px-2 py-1 text-[9px] animate-pulse ${
            isCompleted ? 'bg-emerald-100 text-emerald-800' :
            isPendingEvaluation ? 'bg-emerald-100 text-emerald-800' :
            report.status === 'Em Andamento' ? 'bg-blue-100 text-blue-800' :
            'bg-amber-100 text-amber-800'
          }`}>{report.status}</span>
        </div>
      </div>

      <span className="mt-2 inline-flex rounded-full bg-zinc-100 px-2 py-1 text-[9px] text-zinc-700">{report.categoria}</span>
      <h2 className="mt-1 text-sm font-medium leading-5 text-zinc-900">{report.titulo}</h2>
      <div className="relative mt-3 h-60 overflow-hidden rounded-xl bg-zinc-100">
        <img src={photos[activePhoto]} alt="" className="h-full w-full object-cover" />
        {hasBeforeAndAfter && (
          <>
            <button
              type="button"
              onClick={() => setActivePhoto((current) => (current - 1 + photos.length) % photos.length)}
              className="absolute left-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-sm text-white transition-colors hover:bg-black/75"
              aria-label="Ver foto anterior"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => setActivePhoto((current) => (current + 1) % photos.length)}
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-sm text-white transition-colors hover:bg-black/75"
              aria-label="Ver próxima foto"
            >
              ›
            </button>
            <span className="absolute bottom-2 left-2 rounded-md bg-black/65 px-2 py-1 text-[9px] text-white">
              {activePhoto + 1}/2 · {activePhoto === 0 ? 'Foto do Problema' : 'Reparo Concluído'}
            </span>
          </>
        )}
        {statusMessage && (
          <div className={`absolute ${hasBeforeAndAfter ? 'bottom-10' : 'bottom-2'} left-2 max-w-[calc(100%-1rem)] rounded-md border border-emerald-700 bg-white/90 px-2 py-1 text-[9px] font-medium leading-3 text-zinc-700 shadow-sm backdrop-blur-sm animate-bounce`}>
            {statusMessage}
          </div>
        )}
      </div>
      <p className="mt-2 text-[12px] leading-4 text-zinc-600">{report.descricao}</p>
      {report.justificativa && (
        <div className="mt-3 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2.5">
          <p className="text-[10px] font-semibold text-emerald-800 gap-1 flex items-center">
            <MdEngineering /> Nota da Prefeitura</p>
          <p className="mt-1 text-[11px] leading-4 text-emerald-900">{report.justificativa.dsJustificativa}</p>
        </div>
      )}
      <div className="mt-2 rounded-lg bg-emerald-50 px-2.5 py-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[10px]">
          <span className={`font-medium ${reachedApprovalGoal ? 'text-emerald-800' : 'text-emerald-700'}`}>
            {reachedApprovalGoal ? '✺ Meta Cidadã Concluída' : '↗ Meta de Apoios'}
          </span>
          <span className="shrink-0 font-medium text-emerald-800 animate-pulse">{report.quantidadeApoios} de 5 apoios ({approvalProgress}%)</span>
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-emerald-100">
          <div className={`h-full rounded-full animate-pulse ${reachedApprovalGoal ? 'bg-emerald-800' : 'bg-[#12a879]'}`} style={{ width: `${approvalProgress}%` }} />
        </div>
        <p className="mt-1 text-[9px] text-emerald-700">
          {reachedApprovalGoal ? 'A comunidade atingiu o mínimo necessário para acionar a Prefeitura.' : 'Mínimo de 5 apoios para acionar a Prefeitura.'}
        </p>
      </div>
      <div className="mt-2 flex items-center border-t border-zinc-100 pt-2">
        <div className="flex w-full flex-wrap items-center gap-2">
          {isPendingEvaluation && (
            <button type="button" onClick={() => setIsAuditOpen(true)} className="w-full rounded-md bg-[#12a879] px-3 py-2 text-[11px] font-medium text-white transition-colors hover:bg-emerald-700">
              Avaliar Reparo
            </button>
          )}
          <button
            type="button"
            disabled={hasUpvoted || isUpvoting}
            onClick={() => onUpvote?.(reportId)}
            className={`rounded-md px-2 py-1 text-[10px] transition-colors ${
              hasUpvoted
                ? 'upvoteAnimate cursor-not-allowed border border-[#12a879] bg-[#e6f7f2] text-[#183c36]'
                : 'border border-zinc-200 text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60'
            }`}
          >
            {hasUpvoted ? '❤ Apoiado' : `♡ Apoiar (${report.quantidadeApoios})`}
          </button>
          <button type="button" onClick={() => setIsCommentsOpen(true)} className="rounded-md border border-zinc-200 px-2 py-1 text-[10px] text-zinc-700 hover:bg-zinc-50">▢ Comentários (8)</button>
          {isCompleted && report.avaliacao && (
            <p className="rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-800">
              <span className="animate-spin absolute flex items-center">✦</span> 
              <span className="ml-3">Avaliado com {report.avaliacao}/5 estrelas</span>
            </p>
          )}
          {isReportOwner ? (
            <button type="button" className="rounded-md border border-red-200 px-2 py-1 text-[10px] text-red-700 hover:bg-red-50">
              Excluir
            </button>
          ) : null}
        </div>
      </div>
      <CommentModal
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        reportId={reportId}
        reportTitulo={report.titulo}
        report={report}
      />
      <AuditModal
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        reportId={reportId}
        statusAtual={report.status}
      />
    </article>
  )
}
