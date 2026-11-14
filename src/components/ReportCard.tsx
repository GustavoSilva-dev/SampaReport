import type { Report } from '../types'
import { FaMapMarkerAlt } from 'react-icons/fa'

interface ReportCardProps {
  report: Report
}

const statusMessages: Record<string, string> = {
  'Aguardando Atendimento': 'Em triagem pela prefeitura',
  'Em Andamento': 'A prefeitura já está trabalhando no seu chamado',
  'Em Homologação': 'Aguardando avaliação do usuário final',
}

export function ReportCard({ report }: ReportCardProps) {
  const initial = report.autor.nome.substring(0, 1).toUpperCase()
  const approvalProgress = Math.min((report.quantidadeApoios / 5) * 100, 100)
  const reachedApprovalGoal = report.quantidadeApoios >= 5
  const statusMessage = statusMessages[report.status]

  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-2.5 shadow-sm reveal-up">
      <div className="flex items-center gap-2 px-0.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-medium text-emerald-800">{initial}</div>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="text-[11px] font-medium text-zinc-900">{report.autor.nome}</p>
          <p className="flex items-center gap-1 text-[9px] text-zinc-500">
            <span>{report.dataCriacao} · </span>
            <FaMapMarkerAlt className="h-1.5 animate-ping text-emerald-500" />
            <span className="truncate">{report.endereco}</span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            disabled
            className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-700 shadow-sm transition-colors hover:border-emerald-300 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Ver Histórico de Auditoria
          </button>
          <span className={`rounded-full px-2 py-1 text-[9px] animate-pulse ${report.status === 'Aguardando Atendimento' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>{report.status}</span>
        </div>
      </div>

      <span className="mt-2 inline-flex rounded-full bg-zinc-100 px-2 py-1 text-[9px] text-zinc-700">{report.categoria}</span>
      <h2 className="mt-1 text-sm font-medium leading-5 text-zinc-900">{report.titulo}</h2>
      <div className="relative mt-2 h-60 overflow-hidden rounded-lg bg-zinc-100">
        <img src={report.imagemUrl} alt="" className="h-full w-full object-cover" />
        {statusMessage && (
          <div className="absolute bottom-2 left-2 max-w-[calc(100%-1rem)] rounded-md animate-bounce border-2 border-emerald-700 bg-white/90 px-2 py-1 text-[9px] font-medium leading-3 text-zinc-700 shadow-sm backdrop-blur-sm">
            {statusMessage}
          </div>
        )}
      </div>
      <p className="mt-2 text-[12px] leading-4 text-zinc-600">{report.descricao}</p>
      <div className="mt-2 rounded-lg bg-emerald-50 px-2.5 py-2">
        <div className="flex items-center justify-between gap-2 text-[10px]">
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
        <div className="flex gap-2">
          <button type="button" className="rounded-md border border-zinc-200 px-2 py-1 text-[10px] text-zinc-700 hover:bg-zinc-50">♡ Apoiar ({report.quantidadeApoios})</button>
          <button type="button" className="rounded-md border border-zinc-200 px-2 py-1 text-[10px] text-zinc-700 hover:bg-zinc-50">▢ Comentários (8)</button>
        </div>
      </div>
    </article>
  )
}
