import { useEffect, useMemo, useState } from 'react'
import { FaCheckCircle, FaClipboardList, FaSearch, FaSyncAlt, FaTools } from 'react-icons/fa'
import { GeneralRatingCard } from '../../components/GeneralRatingCard'
import { PlatformHeader } from '../../components/PlatformHeader'
import { ReportCard } from '../../components/ReportCard'
import { getCityFromCoordinates } from '../../services/mapsService'
import { getCachedUserReports, getUserReports } from '../../services/reportService'
import {
  darUpvote,
  getCachedUpvoteEntries,
  getUserUpvotes,
  type UserUpvoteCacheEntry,
} from '../../services/upvoteService'
import type { Report, ReportResponseDTO } from '../../types'

const categoryLabels: Record<string, string> = {
  ASFALTO_BURACOS: 'Asfalto / Buracos',
  ILUMINACAO_PUBLICA: 'Iluminação Pública',
  SINALIZACAO_TRANSITO: 'Sinalização de Trânsito',
  LIXO_ENTULHO: 'Lixo / Entulho',
  ESGOTO_ALAGAMENTO: 'Esgoto / Alagamento',
  MOBILIDADE_CALCADAS: 'Mobilidade / Calçadas',
}

const statusLabels: Record<string, string> = {
  PENDENTE_COMUNIDADE: 'Aguardando Aprovação',
  APROVADO_COMUNIDADE: 'Aguardando Atendimento',
  EM_ANDAMENTO: 'Em Andamento',
  EM_HOMOLOGACAO: 'Em Homologação',
  CONCLUIDO: 'Concluído',
  CANCELADO: 'Cancelado',
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

function mapResponseToReport(item: ReportResponseDTO, userName: string, userId: number): Report {
  return {
    id: String(item.id),
    titulo: item.titulo,
    descricao: item.descricao,
    categoria: categoryLabels[item.categoria] || item.categoria,
    endereco: 'Carregando endereço...',
    dataCriacao: formatDate(item.dataCriacao),
    status: statusLabels[item.status] || item.status,
    quantidadeApoios: item.quantidadeUpvotes,
    imagemUrl: item.fotoAntesUrl,
    autor: {
      id: String(userId),
      nome: userName || 'Cidadão',
      email: '',
      role: 'ROLE_USER',
    },
  }
}

async function mapResponseToReportWithAddress(item: ReportResponseDTO, userName: string, userId: number): Promise<Report> {
  const report = mapResponseToReport(item, userName, userId)

  try {
    report.endereco = await getCityFromCoordinates(item.latitude, item.longitude)
  } catch {
    report.endereco = ''
  }

  return report
}

function MyReports() {
  const loggedUser = JSON.parse(localStorage.getItem('logged-user') || '{}') as {
    id?: number
    nome?: string
  }
  const [query, setQuery] = useState('')
  const [myReports, setMyReports] = useState<Report[]>(() =>
    getCachedUserReports().map((item) =>
      mapResponseToReport(item, loggedUser.nome || 'Cidadão', loggedUser.id || item.usuarioId),
    ),
  )
  const [isLoading, setIsLoading] = useState(
    Boolean(loggedUser.id) && !localStorage.getItem('logged-user-reports'),
  )
  const [userUpvotes, setUserUpvotes] = useState<number[]>(() => {
    if (!loggedUser.id) return []
    return getCachedUpvoteEntries()
      .filter((entry) => entry.usuarioId === loggedUser.id)
      .map((entry) => entry.reportId)
  })
  const [upvotingReportId, setUpvotingReportId] = useState<number | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loggedUser.id) return
    let isActive = true

    void getUserUpvotes(loggedUser.id)
      .then((ids) => {
        if (isActive) setUserUpvotes(ids)
      })
      .catch(() => {
        // Keep the cached upvotes if synchronization is unavailable.
      })

    return () => {
      isActive = false
    }
  }, [loggedUser.id])

  useEffect(() => {
    if (!loggedUser.id) {
      setIsLoading(false)
      return
    }
    if (localStorage.getItem('logged-user-reports')) {
      setIsLoading(false)
      return
    }

    let isActive = true

    async function loadMyReports() {
      setIsLoading(true)
      setError('')

      try {
        const response = await getUserReports(loggedUser.id as number)
        const mappedReports = await Promise.all(
          response.map((item) =>
            mapResponseToReportWithAddress(
              item,
              loggedUser.nome || 'Cidadão',
              loggedUser.id as number,
            ),
          ),
        )
        if (isActive) setMyReports(mappedReports)
      } catch (loadError) {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : 'Não foi possível carregar seus reports.')
        }
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    void loadMyReports()
    return () => {
      isActive = false
    }
  }, [loggedUser.id, loggedUser.nome])

  async function handleRefresh() {
    if (!loggedUser.id || isLoading) return

    setIsLoading(true)
    setError('')

    try {
      const response = await getUserReports(loggedUser.id)
      const mappedReports = await Promise.all(
        response.map((item) =>
          mapResponseToReportWithAddress(
            item,
            loggedUser.nome || 'Cidadão',
            loggedUser.id as number,
          ),
        ),
      )
      setMyReports(mappedReports)
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : 'Não foi possível atualizar seus reports.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleUpvote(reportId: number) {
    if (!loggedUser.id) {
      setError('Faça login para apoiar uma ocorrência.')
      return
    }
    if (userUpvotes.includes(reportId) || upvotingReportId !== null) return

    setUpvotingReportId(reportId)
    setError('')

    try {
      await darUpvote(reportId, loggedUser.id)

      setUserUpvotes((current) => [...current, reportId])

      const entries = getCachedUpvoteEntries()
      const nextEntries: UserUpvoteCacheEntry[] = [
        ...entries.filter((entry) =>
          !(entry.reportId === reportId && entry.usuarioId === loggedUser.id),
        ),
        { reportId, usuarioId: loggedUser.id },
      ]
      localStorage.setItem('user-upvotes', JSON.stringify(nextEntries))

      setMyReports((current) =>
        current.map((report) =>
          report.id === String(reportId)
            ? { ...report, quantidadeApoios: report.quantidadeApoios + 1 }
            : report,
        ),
      )

      const cachedReports = getCachedUserReports()
      const updatedReports = cachedReports.map((report) =>
        report.id === reportId
          ? { ...report, quantidadeUpvotes: report.quantidadeUpvotes + 1 }
          : report,
      )
      localStorage.setItem('logged-user-reports', JSON.stringify(updatedReports))
    } catch (upvoteError) {
      setError(upvoteError instanceof Error ? upvoteError.message : 'Não foi possível registrar o apoio.')
    } finally {
      setUpvotingReportId(null)
    }
  }

  const filteredReports = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return myReports

    return myReports.filter((report) =>
      `${report.titulo} ${report.descricao} #SP-${report.id}`.toLowerCase().includes(normalizedQuery),
    )
  }, [query, myReports])

  const totalReportados = myReports.length
  const totalConcluidos = myReports.filter((report) => report.status === 'Concluído').length
  const totalEmAndamento = myReports.filter((report) =>
    ['Aguardando Aprovação', 'Aguardando Atendimento', 'Em Andamento', 'Em Homologação']
      .includes(report.status),
  ).length

  const metrics = [
    { label: 'Total Reportados', icon: FaClipboardList, value: totalReportados },
    { label: 'Concluídos', icon: FaCheckCircle, value: totalConcluidos },
    { label: 'Em Andamento', icon: FaTools, value: totalEmAndamento },
  ]

  return (
    <div className="min-h-screen platform-bg text-zinc-900">
      <PlatformHeader active="reports" />
      <main className="mx-auto max-w-[1240px] px-5 pb-12 sm:px-8">
        <section className="border-b border-zinc-200 py-4">
          <GeneralRatingCard isLoading={isLoading} />
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold tracking-[-0.8px] text-[#183c36]">Meus Chamados &amp; Reports</h1>
            {loggedUser.id && (
              <button
                type="button"
                onClick={() => void handleRefresh()}
                disabled={isLoading}
                className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800 transition-colors hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaSyncAlt aria-hidden="true" className={isLoading ? 'animate-spin' : ''} />
                Atualizar
              </button>
            )}
          </div>
          <p className="mt-1 text-xs text-zinc-600">Acompanhe e valide o andamento das solicitações de zeladoria urbana abertas por você em São Paulo.</p>

          {!loggedUser.id && (
            <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Faça login para visualizar seus reports.
            </p>
          )}
          {error && (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {metrics.map(({ label, icon: Icon, value }) => (
              <article key={label} className="flex items-center gap-3 rounded-xl border border-emerald-700 moveRight moveRight-delay-1 bg-white px-4 py-3 shadow-sm">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <Icon aria-hidden="true" className="text-sm" />
                </span>
                <div>
                  <p className="text-[10px] text-zinc-500">{label}</p>
                  <p className="text-[1.5rem] mt-1 font-semibold leading-5 ratingAnimation">{value}</p>
                </div>
              </article>
            ))}
          </div>

          <label className="mt-4 flex h-10 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 shadow-sm focus-within:border-emerald-500">
            <FaSearch aria-hidden="true" className="text-xs text-zinc-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full bg-transparent text-xs outline-none placeholder:text-zinc-400"
              placeholder="Buscar por rua, bairro ou número de protocolo (#SP-2025)..."
              aria-label="Buscar nos meus reports"
            />
          </label>
        </section>

        <section className="mx-0 flex max-w-4xl flex-col space-y-4 pt-5" aria-label="Meus reports">
          {isLoading && myReports.length === 0 && (
            <p className="rounded-2xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-500">
              Carregando seus reports...
            </p>
          )}
          {!isLoading && filteredReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              currentUserId={loggedUser.id ? String(loggedUser.id) : undefined}
              hasUpvoted={userUpvotes.includes(Number(report.id))}
              isUpvoting={upvotingReportId === Number(report.id)}
              onUpvote={handleUpvote}
            />
          ))}
          {!isLoading && filteredReports.length === 0 && loggedUser.id && (
            <p className="rounded-2xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-500">
              Nenhum report encontrado.
            </p>
          )}
        </section>
      </main>
    </div>
  )
}

export default MyReports
