import type { Avaliacao, Justificativa, Report } from '../types'
import { FaHistory, FaMapMarkerAlt, FaComments } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { CommentModal } from './modal/CommentModal'
import { AuditModal } from './modal/AuditModal'
import { MdEngineering } from "react-icons/md";
import { getCachedJustificativa, getJustificativaByReportId } from '../services/justifyService'
import { getCachedGrades, getGrades, sendGrade } from '../services/gradeService'
import { GradeModal } from './modal/GradeModal'
import { CreateReportModal } from './modal/CreateReportModal'
import { deleteReport } from '../services/reportService'

interface ReportCardProps {
  report: Report
  currentUserId?: string
  hasUpvoted?: boolean
  isUpvoting?: boolean
  onUpvote?: (reportId: number) => void
  onGradeApplied?: (reportId: number) => void
}

const statusMessages: Record<string, string> = {
  'Aguardando Atendimento': 'Em triagem pela prefeitura',
  'Em Andamento': 'A prefeitura já está trabalhando no seu chamado',
  'Em Homologação': 'Aguardando avaliação do usuário final',
}

export function ReportCard({
  report,
  currentUserId,
  hasUpvoted = false,
  isUpvoting = false,
  onUpvote,
  onGradeApplied,
}: ReportCardProps) {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)
  const [isAuditOpen, setIsAuditOpen] = useState(false)
  const [isGradeOpen, setIsGradeOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSubmittingGrade, setIsSubmittingGrade] = useState(false)
  const [grade, setGrade] = useState<Avaliacao | null>(null)
  const [localStatus, setLocalStatus] = useState(report.status)
  const [activePhoto, setActivePhoto] = useState(0)
  const [justificativa, setJustificativa] = useState<Justificativa | null>(null)
  const reportId = Number(report.id.replace(/\D/g, '')) || 0
  const initial = report.autor.nome.substring(0, 1).toUpperCase()
  const approvalProgress = Math.min((report.quantidadeApoios / 5) * 100, 100)
  const reachedApprovalGoal = report.quantidadeApoios >= 5
  const statusMessage = statusMessages[report.status]
  const isPendingEvaluation = localStatus === 'Em Homologação'
  const isCompleted = localStatus === 'Concluído'
  const isReportOwner = report.autor.id === currentUserId

  useEffect(() => {
    setLocalStatus(report.status)
  }, [report.status])

  useEffect(() => {
    const needsJustification = localStatus === 'Em Homologação' || localStatus === 'Concluído'
    if (!needsJustification) {
      setJustificativa(null)
      setActivePhoto(0)
      return
    }

    setJustificativa(getCachedJustificativa(reportId))
    getJustificativaByReportId(reportId).then(setJustificativa)
  }, [localStatus, reportId])

  useEffect(() => {
    setGrade(getCachedGrades().find((item) => item.reportId === reportId) ?? null)
    getGrades().then((grades) => {
      setGrade(grades.find((item) => item.reportId === reportId) ?? null)
    })
  }, [reportId])

  function formatCompletionDate(value: string) {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date)
  }

  const photos = [report.imagemUrl, justificativa?.fotoDepoisUrl].filter((image): image is string => Boolean(image))
  const hasBeforeAndAfter = photos.length > 1

  async function handleGrade(nota: number) {
    const loggedUser = JSON.parse(localStorage.getItem('logged-user') || '{}') as { id?: number }
    if (!loggedUser.id || isSubmittingGrade) return

    setIsSubmittingGrade(true)
    try {
      const createdGrade = await sendGrade(reportId, {
        nota,
        usuarioId: loggedUser.id,
      })
      setGrade(createdGrade)
      setLocalStatus('Concluído')

      const reportsCache = localStorage.getItem('reports-list')
      if (reportsCache) {
        const reports = JSON.parse(reportsCache) as Array<{ id: number; status: string; avaliacao?: number }>
        localStorage.setItem(
          'reports-list',
          JSON.stringify(reports.map((item) =>
            item.id === reportId
              ? { ...item, status: 'CONCLUIDO', avaliacao: nota }
              : item,
          )),
        )
      }

      const userReportsCache = localStorage.getItem('logged-user-reports')
      if (userReportsCache) {
        const reports = JSON.parse(userReportsCache) as Array<{ id: number; status: string; avaliacao?: number }>
        localStorage.setItem(
          'logged-user-reports',
          JSON.stringify(reports.map((item) =>
            item.id === reportId
              ? { ...item, status: 'CONCLUIDO', avaliacao: nota }
              : item,
          )),
        )
      }

      setIsGradeOpen(false)
      onGradeApplied?.(reportId)
    } finally {
      setIsSubmittingGrade(false)
    }
  }

  async function handleDelete() {
    if (isDeleting) return
    setIsDeleting(true)
    try {
      await deleteReport(reportId)
      onGradeApplied?.(reportId)
    } finally {
      setIsDeleting(false)
    }
  }

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
              {activePhoto === 0 ? 'Antes (Foto do Problema)' : 'Depois (Foto da Correção)'}
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
      {justificativa && (
        <div className="mt-3 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2.5">
          <p className="text-[10px] font-semibold text-emerald-800 gap-1 flex items-center">
            <MdEngineering /> Nota da Prefeitura</p>
          <p className="mt-1 text-[11px] leading-4 text-emerald-900">{justificativa.notaTecnica}</p>
          {justificativa.dataConclusao && (
            <p className="mt-1 text-[9px] font-medium text-zinc-500">
              Concluído em {formatCompletionDate(justificativa.dataConclusao)}
            </p>
          )}
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
          {isPendingEvaluation && report.autor.id === currentUserId && !grade && (
            <button type="button" onClick={() => setIsGradeOpen(true)} className="w-full rounded-md bg-[#12a879] px-3 py-2 text-[11px] font-medium text-white transition-colors hover:bg-emerald-700">
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
          <button type="button" onClick={() => setIsCommentsOpen(true)} className="rounded-md border border-zinc-200 px-2 py-1 text-[10px] text-zinc-700 hover:bg-zinc-50">
            <FaComments className="inline-block mr-1" />
            Comentários
          </button>
          {isCompleted && grade && (
            <p className="rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-800">
              <span className="animate-spin absolute flex items-center">✦</span> 
              <span className="ml-3">Avaliado com {grade.nota}/5</span>
            </p>
          )}
          {isReportOwner ? (
            <>
              <button type="button" onClick={() => setIsEditOpen(true)} className="rounded-md border border-emerald-200 px-2 py-1 text-[10px] text-emerald-700 hover:bg-emerald-50">
                Editar
              </button>
              <button type="button" disabled={isDeleting} onClick={() => void handleDelete()} className="rounded-md border border-red-200 px-2 py-1 text-[10px] text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60">
                {isDeleting ? 'Excluindo...' : 'Excluir'}
              </button>
            </>
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
      <GradeModal
        isOpen={isGradeOpen}
        reportTitle={report.titulo}
        isSubmitting={isSubmittingGrade}
        onClose={() => setIsGradeOpen(false)}
        onGrade={handleGrade}
      />
      <CreateReportModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        mode="edit"
        reportId={reportId}
        initialData={{
          titulo: report.titulo,
          descricao: report.descricao,
          categoria: report.categoria,
          endereco: report.endereco,
          fotoAntesUrl: report.imagemUrl,
        }}
        onSuccess={() => onGradeApplied?.(reportId)}
      />
    </article>
  )
}
