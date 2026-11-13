import type { Report } from '../types'

interface ReportCardProps {
  report: Report
}

export function ReportCard({ report }: ReportCardProps) {
  const initial = report.autor.nome.substring(0, 1).toUpperCase()
  const progress = (report.quantidadeApoios / 5) * 100

  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-2.5 shadow-sm reveal-up">
      <div className="flex items-center gap-2 px-0.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-medium text-emerald-800">{initial}</div>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="text-[11px] font-medium text-zinc-900">{report.autor.nome}</p>
          <p className="text-[9px] text-zinc-500">{report.dataCriacao} · {report.endereco.split(',')[1]?.trim() ?? report.endereco}</p>
        </div>
        <span className="rounded-full bg-amber-100 px-2 py-1 text-[9px] text-amber-800 animate-pulse">{report.status}</span>
      </div>
      <span className="mt-2 inline-flex rounded-full bg-zinc-100 px-2 py-1 text-[9px] text-zinc-700">{report.categoria}</span>
      <h2 className="mt-1 text-sm font-medium leading-5 text-zinc-900">{report.titulo}</h2>
      <div className="mt-2 h-60 overflow-hidden rounded-lg bg-zinc-100">
        <img src={report.imagemUrl} alt="" className="h-full w-full object-cover" />
      </div>
      <p className="mt-2 text-[12px] leading-4 text-zinc-600">{report.descricao}</p>
      <div className="mt-2 flex items-center justify-between text-[12px] text-zinc-600">
        <span className="text-emerald-700">↗ Progresso: {report.quantidadeApoios} de 5 apoios</span>
        <span className="text-[10px]">Mínimo de 5 Apoios</span>
      </div>
      <div className="mt-1 h-3 overflow-hidden rounded-full bg-zinc-200"><div className="h-full rounded-full bg-[#12a879] animate-pulse" style={{ width: `${progress}%` }} /></div>
      <div className="mt-2 flex items-center justify-between border-t border-zinc-100 pt-2">
        <div className="flex gap-2">
          <button type="button" className="rounded-md border border-zinc-200 px-2 py-1 text-[10px] text-zinc-700 hover:bg-zinc-50">♡ Apoiar ({report.quantidadeApoios})</button>
          <button type="button" className="rounded-md border border-zinc-200 px-2 py-1 text-[10px] text-zinc-700 hover:bg-zinc-50">▢ Comentários (8)</button>
        </div>
        <button type="button" disabled className="cursor-not-allowed text-[10px] text-zinc-400">Ver Detalhes&nbsp; →</button>
      </div>
    </article>
  )
}
