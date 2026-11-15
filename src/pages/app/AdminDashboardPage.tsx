import { useState } from 'react'
import { FaCheckCircle, FaClipboardList, FaTools } from 'react-icons/fa'
import { GeneralRatingCard } from '../../components/GeneralRatingCard'
import { CompletionModal } from '../../components/modal/CompletionModal'
import { DetailsModal } from '../../components/modal/DetailsModal'
import { PlatformHeader } from '../../components/PlatformHeader'
import type { AdminReport, AdminStatus } from '../../types'

const initialReports: AdminReport[] = [
  {
    id: 1,
    titulo: 'Buraco profundo na faixa exclusiva de ônibus',
    descricao: 'Cratera com risco de acidentes para motociclistas e retenção das linhas de ônibus.',
    endereco: 'Rua dos Pinheiros, 450 - Pinheiros',
    categoria: 'Asfalto / Buracos',
    status: 'AGUARDANDO_HOMOLOGACAO',
    quantidadeApoios: 5,
    imagemUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=160&q=80',
    autor: 'Autriga Toledo',
  },
  {
    id: 2,
    titulo: 'Boca de lobo entupida com risco de alagamento',
    descricao: 'A drenagem está obstruída por resíduos e pode causar alagamento durante as chuvas.',
    endereco: 'Rua Tietê, 820 - São Paulo',
    categoria: 'Drenagem / Alagamento',
    status: 'EM_ANDAMENTO',
    quantidadeApoios: 7,
    imagemUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=160&q=80',
    autor: 'Autriga Toledo',
  },
  {
    id: 3,
    titulo: 'Rua toda LED apagada e a fiação exposta',
    descricao: 'Postes sem iluminação e fiação exposta aumentam o risco para moradores.',
    endereco: 'Rua Monte Noite, 1024 - Pordaza',
    categoria: 'Iluminação Pública',
    status: 'EM_ANDAMENTO',
    quantidadeApoios: 5,
    imagemUrl: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=160&q=80',
    autor: 'Autriga Toledo',
  },
  {
    id: 4,
    titulo: 'Recapeamento de vala aberta pela companhia',
    descricao: 'Vala aberta após manutenção precisa de recapeamento para liberar a via.',
    endereco: 'Av. Mísema, 310 - Moema',
    categoria: 'Asfalto / Buracos',
    status: 'EM_ANDAMENTO',
    quantidadeApoios: 5,
    imagemUrl: 'https://images.unsplash.com/photo-1531835551805-16d864c8d6c7?auto=format&fit=crop&w=160&q=80',
    autor: 'Autriga Toledo',
  },
  {
    id: 5,
    titulo: 'Descarte irregular de entulho e móveis',
    descricao: 'Materiais ocupam a calçada e dificultam a passagem de pedestres.',
    endereco: 'Rua Paraná, 710 - Moema',
    categoria: 'Lixo / Entulho',
    status: 'AGUARDANDO_HOMOLOGACAO',
    quantidadeApoios: 9,
    imagemUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=160&q=80',
    autor: 'Autriga Toledo',
  },
  {
    id: 6,
    titulo: 'Faixa de pedestres apagada em cruzamento movimentado',
    descricao: 'A sinalização horizontal foi restaurada e o serviço aguarda apenas o registro final.',
    endereco: 'Av. Ibirapuera, 1200 - Moema',
    categoria: 'Sinalização',
    status: 'CONCLUIDO',
    quantidadeApoios: 8,
    imagemUrl: 'https://images.unsplash.com/photo-1494522358652-f30e61a60313?auto=format&fit=crop&w=160&q=80',
    autor: 'Autriga Toledo',
  },
]

const statusLabels: Record<AdminStatus, string> = {
  AGUARDANDO_HOMOLOGACAO: 'Aguardando Homologação',
  EM_ANDAMENTO: 'Em Andamento',
  CONCLUIDO: 'Concluído',
}

function statusClass(status: AdminStatus) {
  if (status === 'AGUARDANDO_HOMOLOGACAO') return 'bg-amber-100 text-amber-800'
  if (status === 'EM_ANDAMENTO') return 'bg-sky-100 text-sky-800'
  return 'bg-emerald-100 text-emerald-800'
}

function ReportActions({ report, onAttend, onComplete, onDetails }: {
  report: AdminReport
  onAttend: (reportId: number) => void
  onComplete: (report: AdminReport) => void
  onDetails: (report: AdminReport) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {report.status === 'AGUARDANDO_HOMOLOGACAO' && (
        <button type="button" onClick={() => onAttend(report.id)} className="rounded-md bg-emerald-500 px-3 py-2 text-[11px] font-medium text-white hover:bg-emerald-600">
          Atender
        </button>
      )}
      {report.status === 'EM_ANDAMENTO' && (
        <button type="button" onClick={() => onComplete(report)} className="rounded-md bg-emerald-500 px-3 py-2 text-[11px] font-medium text-white hover:bg-emerald-600">
          Concluir Serviço
        </button>
      )}
      <button type="button" onClick={() => onDetails(report)} className="rounded-md border border-zinc-200 px-3 py-2 text-[11px] text-zinc-700 hover:bg-zinc-50">
        Ver Detalhes
      </button>
    </div>
  )
}

function AdminDashboardPage() {
  const [reports, setReports] = useState(initialReports)
  const [completionReport, setCompletionReport] = useState<AdminReport | null>(null)
  const [detailsReport, setDetailsReport] = useState<AdminReport | null>(null)
  const waitingCount = reports.filter((report) => report.status === 'AGUARDANDO_HOMOLOGACAO' && report.quantidadeApoios >= 5).length
  const inProgressCount = reports.filter((report) => report.status === 'EM_ANDAMENTO').length
  const completedCount = reports.filter((report) => report.status === 'CONCLUIDO').length

  function attendReport(reportId: number) {
    setReports((current) => current.map((report) => report.id === reportId ? { ...report, status: 'EM_ANDAMENTO' } : report))
  }

  function completeReport(reportId: number) {
    setReports((current) => current.map((report) => report.id === reportId ? { ...report, status: 'CONCLUIDO' } : report))
    setCompletionReport(null)
  }

  return (
    <div className="min-h-screen platform-bg text-zinc-900">
      <PlatformHeader active="admin" />
      <main className="mx-auto max-w-[1240px] px-5 pb-12 sm:px-8">
        <section className="py-5">
          <h1 className="text-2xl font-bold tracking-[-0.8px] text-[#183c36]">Painel de Gestão e Operações</h1>
          <p className="mt-1 text-xs text-zinc-600">Acompanhe e gerencie as ocorrências enviadas pela comunidade para a Subprefeitura.</p>
          <div className="mt-4"><GeneralRatingCard rating={4.7} totalReviews={312} /></div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {[
              { label: 'Aguardando Atendimento', value: waitingCount, note: 'Aguardando Protocolamento', icon: FaClipboardList },
              { label: 'Em Andamento', value: inProgressCount, note: 'Equipes em campo', icon: FaTools },
              { label: 'Concluídos', value: completedCount, note: 'Serviços finalizados', icon: FaCheckCircle },
            ].map(({ label, value, note, icon: Icon }) => (
              <article key={label} className="moveRight rounded-xl border border-emerald-700 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700"><Icon className="text-emerald-600" aria-hidden="true" />{label}:</div>
                <p className="mt-1 text-3xl font-bold text-[#183c36]"><span className="ratingAnimation">{value}</span> <span className="text-xs font-normal text-zinc-600">({note})</span></p>
              </article>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="hidden overflow-x-auto md:block">
            <table className="reveal-up w-full min-w-[760px] text-left">
              <thead className="bg-zinc-100/70 text-[11px] text-zinc-700">
                <tr><th className="px-3 py-3">Código</th><th className="px-3 py-3">Ocorrência</th><th className="px-3 py-3">Apoio Comunitário</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Ações</th></tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {reports.map((report) => (
                  <tr key={report.id} className="text-xs">
                    <td className="px-3 py-3 font-medium text-zinc-700">Código {report.id}</td>
                    <td className="max-w-[290px] px-3 py-3"><div className="flex items-center gap-2"><img src={report.imagemUrl} alt="" className="h-9 w-9 rounded-md object-cover" /><div className="min-w-0"><p className="truncate font-medium text-zinc-900">{report.titulo}</p><p className="truncate text-[10px] text-zinc-500">{report.endereco}</p></div></div></td>
                    <td className="px-3 py-3"><span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-medium text-emerald-800">{report.quantidadeApoios}/5 Votos</span></td>
                    <td className="px-3 py-3"><span className={`animate-pulse rounded-full px-2 py-1 text-[10px] font-medium ${statusClass(report.status)}`}>{statusLabels[report.status]}</span></td>
                    <td className="px-3 py-3"><ReportActions report={report} onAttend={attendReport} onComplete={setCompletionReport} onDetails={setDetailsReport} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-3 p-3 md:hidden">
            {reports.map((report) => (
              <article key={report.id} className="space-y-3 rounded-xl border border-zinc-200 p-4">
                <div className="flex items-start gap-3"><img src={report.imagemUrl} alt="" className="h-12 w-12 rounded-lg object-cover" /><div className="min-w-0"><p className="text-[10px] font-medium text-emerald-700">Código {report.id}</p><h2 className="text-sm font-semibold text-zinc-900">{report.titulo}</h2><p className="mt-1 text-[10px] text-zinc-500">{report.endereco}</p></div></div>
                <div className="flex flex-wrap items-center gap-2 text-[10px]"><span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-800">{report.quantidadeApoios}/5 Votos</span><span className={`animate-pulse rounded-full px-2 py-1 ${statusClass(report.status)}`}>{statusLabels[report.status]}</span></div>
                <ReportActions report={report} onAttend={attendReport} onComplete={setCompletionReport} onDetails={setDetailsReport} />
              </article>
            ))}
          </div>
        </section>
      </main>
      {completionReport && <CompletionModal report={completionReport} onClose={() => setCompletionReport(null)} onComplete={completeReport} />}
      {detailsReport && <DetailsModal report={detailsReport} onClose={() => setDetailsReport(null)} />}
    </div>
  )
}

export default AdminDashboardPage
