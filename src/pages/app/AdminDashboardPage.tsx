import { useEffect, useMemo, useState } from 'react'
import { FaCheckCircle, FaClipboardList, FaTools } from 'react-icons/fa'
import { GeneralRatingCard } from '../../components/GeneralRatingCard'
import { CompletionModal } from '../../components/modal/CompletionModal'
import { DetailsModal } from '../../components/modal/DetailsModal'
import { PlatformHeader } from '../../components/PlatformHeader'
import { concluirServico, updateReportStatus } from '../../services/adminService'
import { getCachedReports } from '../../services/reportService'
import { getCachedUsers } from '../../services/userService'
import { getCityFromCoordinates } from '../../services/mapsService'
import type { JustificativaRequestDTO, ReportResponseDTO, ReportStatus } from '../../types'

const categoryLabels: Record<string, string> = {
  ASFALTO_BURACOS: 'Asfalto / Buracos',
  ILUMINACAO_PUBLICA: 'Iluminação Pública',
  SINALIZACAO_TRANSITO: 'Sinalização de Trânsito',
  LIXO_ENTULHO: 'Lixo / Entulho',
  ESGOTO_ALAGAMENTO: 'Esgoto / Alagamento',
  MOBILIDADE_CALCADAS: 'Mobilidade / Calçadas',
}

function getStatusLabel(status: ReportStatus | string) {
  if (status === 'PENDENTE_COMUNIDADE') return 'Aguardando Aprovação'
  if (status === 'APROVADO_COMUNIDADE' || status === 'AGUARDANDO_HOMOLOGACAO') return 'Aguardando Homologação'
  if (status === 'EM_ANDAMENTO') return 'Em Andamento'
  if (status === 'EM_HOMOLOGACAO') return 'Em Homologação'
  if (status === 'CONCLUIDO') return 'Concluído'
  return 'Cancelado'
}

function statusClass(status: ReportStatus | string) {
  if (status === 'APROVADO_COMUNIDADE' || status === 'AGUARDANDO_HOMOLOGACAO') return 'bg-amber-100 text-amber-800'
  if (status === 'EM_ANDAMENTO') return 'bg-sky-100 text-sky-800'
  if (status === 'EM_HOMOLOGACAO') return 'bg-emerald-100 text-emerald-800'
  if (status === 'CONCLUIDO') return 'bg-emerald-100 text-emerald-800'
  return 'bg-zinc-100 text-zinc-700'
}

function getAddress(report: ReportResponseDTO) {
  const address = getCityFromCoordinates(report.latitude, report.longitude)
  return address
}

function ReportActions({ report, onAttend, onComplete, onDetails, isUpdating }: {
  report: ReportResponseDTO
  onAttend: (reportId: number) => void
  onComplete: (report: ReportResponseDTO) => void
  onDetails: (report: ReportResponseDTO) => void
  isUpdating: boolean
}) {
  const status: string = report.status
  return (
    <div className="flex flex-wrap items-center gap-2">
      {(status === 'APROVADO_COMUNIDADE' || status === 'AGUARDANDO_HOMOLOGACAO') && (
        <button type="button" disabled={isUpdating} onClick={() => onAttend(report.id)} className="rounded-md bg-emerald-500 px-3 py-2 text-[11px] font-medium text-white hover:bg-emerald-600 disabled:opacity-60">
          {isUpdating ? 'Atualizando...' : 'Atender'}
        </button>
      )}
      {status === 'EM_ANDAMENTO' && (
        <button type="button" disabled={isUpdating} onClick={() => onComplete(report)} className="rounded-md bg-emerald-500 px-3 py-2 text-[11px] font-medium text-white hover:bg-emerald-600 disabled:opacity-60">
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
  const [reports, setReports] = useState<ReportResponseDTO[]>(() => getCachedReports())
  const [completionReport, setCompletionReport] = useState<ReportResponseDTO | null>(null)
  const [detailsReport, setDetailsReport] = useState<ReportResponseDTO | null>(null)
  const [updatingReportId, setUpdatingReportId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [addresses, setAddresses] = useState<Record<number, string>>({})
  const users = useMemo(() => getCachedUsers(), [])

  useEffect(() => {
    let isActive = true
    void Promise.all(
      getCachedReports().map(async (report) => ({
        id: report.id,
        address: await getAddress(report).catch(() => ''),
      })),
    ).then((results) => {
      if (!isActive) return
      setAddresses(Object.fromEntries(results.map((item) => [item.id, item.address])))
    })

    return () => {
      isActive = false
    }
  }, [])

  const operationalReports = reports.filter((report) =>
    report.quantidadeUpvotes >= 5 ||
    ['APROVADO_COMUNIDADE', 'AGUARDANDO_HOMOLOGACAO', 'EM_ANDAMENTO', 'EM_HOMOLOGACAO', 'CONCLUIDO'].includes(report.status),
  )

  const waitingCount = reports.filter((report) =>
    ['APROVADO_COMUNIDADE', 'AGUARDANDO_HOMOLOGACAO'].includes(report.status),
  ).length
  const inProgressCount = reports.filter((report) => report.status === 'EM_ANDAMENTO').length
  const completedCount = reports.filter((report) =>
    ['EM_HOMOLOGACAO', 'CONCLUIDO'].includes(report.status),
  ).length

  function persistReports(updatedReports: ReportResponseDTO[]) {
    setReports(updatedReports)
    localStorage.setItem('reports-list', JSON.stringify(updatedReports))
  }

  async function attendReport(reportId: number) {
    setUpdatingReportId(reportId)
    setError('')
    try {
      await updateReportStatus(reportId, 'EM_ANDAMENTO')
      const updatedReports = reports.map((report) =>
        report.id === reportId ? { ...report, status: 'EM_ANDAMENTO' as ReportStatus } : report,
      )
      persistReports(updatedReports)
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Não foi possível atender o chamado.')
    } finally {
      setUpdatingReportId(null)
    }
  }

  async function completeReport(reportId: number, dto: JustificativaRequestDTO) {
    setError('')
    await concluirServico(reportId, dto)
    const updatedReports = reports.map((report) =>
      report.id === reportId
        ? { ...report, status: 'EM_HOMOLOGACAO' as ReportStatus, fotoDepoisUrl: dto.fotoDepoisUrl }
        : report,
    )
    persistReports(updatedReports)
    setCompletionReport(null)
  }

  return (
    <div className="min-h-screen platform-bg text-zinc-900">
      <PlatformHeader active="admin" />
      <main className="mx-auto max-w-[1240px] px-5 pb-12 sm:px-8">
        <section className="py-5">
          <h1 className="text-2xl font-bold tracking-[-0.8px] text-[#183c36]">Painel de Gestão e Operações</h1>
          <p className="mt-1 text-xs text-zinc-600">Acompanhe e gerencie as ocorrências enviadas pela comunidade para a Subprefeitura.</p>
          <div className="mt-4"><GeneralRatingCard /></div>
          {error && <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p>}
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
                {operationalReports.map((report) => (
                  <tr key={report.id} className="text-xs">
                    <td className="px-3 py-3 font-medium text-zinc-700">Código {report.id}</td>
                    <td className="max-w-[290px] px-3 py-3">
                      <div className="flex items-center gap-2">
                        <img src={report.fotoAntesUrl} alt="" className="h-9 w-9 rounded-md object-cover" />
                        <div className="min-w-0"><p className="truncate font-medium text-zinc-900">{report.titulo}</p><p className="truncate text-[10px] text-zinc-500">{addresses[report.id] || 'São Paulo'}</p></div>
                      </div>
                    </td>
                    <td className="px-3 py-3"><span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-medium text-emerald-800">{report.quantidadeUpvotes}/5 Votos</span></td>
                    <td className="px-3 py-3"><span className={`animate-pulse rounded-full px-2 py-1 text-[10px] font-medium ${statusClass(report.status)}`}>{getStatusLabel(report.status)}</span></td>
                    <td className="px-3 py-3"><ReportActions report={report} onAttend={attendReport} onComplete={setCompletionReport} onDetails={setDetailsReport} isUpdating={updatingReportId === report.id} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-3 p-3 md:hidden">
            {operationalReports.map((report) => (
              <article key={report.id} className="space-y-3 rounded-xl border border-zinc-200 p-4">
                <div className="flex items-start gap-3">
                  <img src={report.fotoAntesUrl} alt="" className="h-12 w-12 rounded-lg object-cover" />
                  <div className="min-w-0"><p className="text-[10px] font-medium text-emerald-700">Código {report.id}</p><h2 className="text-sm font-semibold text-zinc-900">{report.titulo}</h2><p className="mt-1 text-[10px] text-zinc-500">{addresses[report.id] || 'São Paulo'}</p></div>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-[10px]"><span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-800">{report.quantidadeUpvotes}/5 Votos</span><span className={`animate-pulse rounded-full px-2 py-1 ${statusClass(report.status)}`}>{getStatusLabel(report.status)}</span></div>
                <ReportActions report={report} onAttend={attendReport} onComplete={setCompletionReport} onDetails={setDetailsReport} isUpdating={updatingReportId === report.id} />
              </article>
            ))}
          </div>
        </section>
      </main>
      {completionReport && <CompletionModal report={completionReport} onClose={() => setCompletionReport(null)} onComplete={completeReport} />}
      {detailsReport && (
        <DetailsModal
          report={detailsReport}
          address={addresses[detailsReport.id] || 'São Paulo'}
          categoryLabel={categoryLabels[detailsReport.categoria] || detailsReport.categoria}
          authorName={users.find((user) => user.id === detailsReport.usuarioId)?.nome || 'Cidadão'}
          onClose={() => setDetailsReport(null)}
        />
      )}
    </div>
  )
}

export default AdminDashboardPage
