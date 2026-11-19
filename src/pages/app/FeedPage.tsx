import { useEffect, useMemo, useState } from 'react'
import { PlatformHeader } from '../../components/PlatformHeader'
import { ReportCard } from '../../components/ReportCard'
import { FaSearch } from 'react-icons/fa'
import { GeneralRatingCard } from '../../components/GeneralRatingCard'
import type { Report, ReportResponseDTO } from '../../types'
import MapCard from '../../components/MapCard'
import { getCachedReports, getReports } from '../../services/reportService'
import { getCachedUsers, getUsers, type UsuarioResponseDTO } from '../../services/userService'
import { getCityFromCoordinates } from '../../services/mapsService'
import {
  darUpvote,
  getCachedUpvoteEntries,
  getUserUpvotes,
  type UserUpvoteCacheEntry,
} from '../../services/upvoteService'
import { getGrades } from '../../services/gradeService'

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

function mapResponseToReportSync(item: ReportResponseDTO, users: UsuarioResponseDTO[]): Report {
  const author = users.find((user) => user.id === item.usuarioId)

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
      id: String(author?.id ?? item.usuarioId),
      nome: author?.nome || 'Cidadão',
      email: author?.email || '',
      role: author?.perfil === 'ROLE_ADMIN' ? 'ROLE_ADMIN' : 'ROLE_USER',
    },
  }
}

async function mapResponseToReport(item: ReportResponseDTO, users: UsuarioResponseDTO[]): Promise<Report> {
  const report = mapResponseToReportSync(item, users)

  try {
    report.endereco = await getCityFromCoordinates(item.latitude, item.longitude)
  } catch {
    report.endereco = ''
  }

  return report
}

function FeedPage() {
  const [query, setQuery] = useState('')
  const [feedVersion, setFeedVersion] = useState(0)
  const [reports, setReports] = useState<Report[]>(() =>
    getCachedReports().map((item) => mapResponseToReportSync(item, getCachedUsers())),
  )
  const [apiReports, setApiReports] = useState<ReportResponseDTO[]>(() => getCachedReports())
  const [apiUsers, setApiUsers] = useState<UsuarioResponseDTO[]>(() => getCachedUsers())
  const [userUpvotes, setUserUpvotes] = useState<number[]>(() => {
    const loggedUser = JSON.parse(localStorage.getItem('logged-user') || '{}') as { id?: number }
    if (!loggedUser.id) return []
    return getCachedUpvoteEntries()
      .filter((entry) => entry.usuarioId === loggedUser.id)
      .map((entry) => entry.reportId)
  })
  const [upvotingReportId, setUpvotingReportId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const loggedUser = JSON.parse(localStorage.getItem('logged-user') || '{}') as { id?: number }

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem('logged-user') || '{}') as { id?: number }
    if (!loggedUser.id) return

    let isActive = true
    void getUserUpvotes(loggedUser.id)
      .then((ids) => {
        if (isActive) setUserUpvotes(ids)
      })
      .catch(() => {
        // Keep the cached upvotes if the synchronization request fails.
      })

    return () => {
      isActive = false
    }
  }, [])

  useEffect(() => {
    let isActive = true

    async function loadReports() {
      setIsLoading(true)
      setError('')
      try {
        const [reportsResult, usersResult] = await Promise.allSettled([
          getReports(),
          getUsers(),
          getGrades(),
        ])
        const response = reportsResult.status === 'fulfilled'
          ? reportsResult.value
          : getCachedReports()
        const users = usersResult.status === 'fulfilled'
          ? usersResult.value
          : getCachedUsers()

        if (isActive) {
          if (reportsResult.status === 'rejected') {
            setError(reportsResult.reason instanceof Error
              ? reportsResult.reason.message
              : 'Não foi possível carregar as ocorrências.')
          }
          setApiReports(response)
          setApiUsers(users)
          const mappedReports = await Promise.all(
            response.map((item) => mapResponseToReport(item, users)),
          )
          setReports(mappedReports)
        }
      } catch (loadError) {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : 'Não foi possível carregar as ocorrências.')
        }
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    void loadReports()
    return () => {
      isActive = false
    }
  }, [feedVersion])

  const filteredReports = useMemo(
    () => reports.filter((report) => `${report.titulo} ${report.categoria} ${report.endereco}`.toLowerCase().includes(query.toLowerCase())),
    [query, reports],
  )

  async function handleUpvote(reportId: number) {
    const loggedUser = JSON.parse(localStorage.getItem('logged-user') || '{}') as { id?: number }
    if (!loggedUser.id) {
      setError('Faça login para apoiar uma ocorrência.')
      return
    }

    if (userUpvotes.includes(reportId) || upvotingReportId !== null) return

    setUpvotingReportId(reportId)
    setError('')

    try {
      await darUpvote(reportId, loggedUser.id)

      const nextUserUpvotes = [...userUpvotes, reportId]
      setUserUpvotes(nextUserUpvotes)

      const entries = getCachedUpvoteEntries()
      const nextEntries: UserUpvoteCacheEntry[] = [
        ...entries,
        { reportId, usuarioId: loggedUser.id },
      ]
      localStorage.setItem('user-upvotes', JSON.stringify(nextEntries))

      setApiReports((current) => {
        const updated = current.map((report) =>
          report.id === reportId
            ? { ...report, quantidadeUpvotes: report.quantidadeUpvotes + 1 }
            : report,
        )
        localStorage.setItem('reports-list', JSON.stringify(updated))
        return updated
      })

      setReports((current) =>
        current.map((report) =>
          report.id === String(reportId)
            ? { ...report, quantidadeApoios: report.quantidadeApoios + 1 }
            : report,
        ),
      )
    } catch (upvoteError) {
      setError(upvoteError instanceof Error ? upvoteError.message : 'Não foi possível registrar o apoio.')
    } finally {
      setUpvotingReportId(null)
    }
  }

  async function handleGradeApplied() {
    setFeedVersion((version) => version + 1)

    try {
      const refreshedReports = await getReports()
      setApiReports(refreshedReports)
      const users = getCachedUsers()
      const mappedReports = await Promise.all(
        refreshedReports.map((item) => mapResponseToReport(item, users)),
      )
      setReports(mappedReports)
    } catch {
      // The card and caches already reflect the submitted grade.
    }
  }

  return (
    <div className="min-h-screen platform-bg text-zinc-900">
      <PlatformHeader onReportCreated={() => setFeedVersion((version) => version + 1)} />
      <main className="mx-auto max-w-[1240px] px-5 pb-10 sm:px-8">
        <section className="border-b z-1000 border-zinc-200 py-4">
          <GeneralRatingCard />
          <h1 className="text-2xl font-semibold tracking-[-0.8px] text-[#183c36]">Feed de Ocorrências</h1>
          <p className="mt-1 text-xs text-zinc-600">Acompanhe e apoie os problemas do seu bairro. Com 5 apoios, a prefeitura é acionada.</p>


          <label className="mt-4 flex h-10 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 shadow-sm focus-within:border-emerald-500">
            <FaSearch aria-hidden="true" className="text-xs text-zinc-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent text-xs outline-none placeholder:text-zinc-400"
              placeholder="Buscar por rua, bairro ou número de protocolo (#SP-2025)..." aria-label="Buscar ocorrências" />
          </label>
        </section>

        <div className="grid items-start gap-3 pt-3 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]">
          <section key={feedVersion} className="space-y-2" aria-label="Lista de ocorrências">
            {isLoading && reports.length === 0 && <p className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500">Carregando ocorrências...</p>}
            {error && <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">{error}</p>}
            {filteredReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                currentUserId={loggedUser.id ? String(loggedUser.id) : undefined}
                hasUpvoted={userUpvotes.includes(Number(report.id))}
                isUpvoting={upvotingReportId === Number(report.id)}
                onUpvote={handleUpvote}
                onGradeApplied={handleGradeApplied}
              />
            ))}
            {!isLoading && filteredReports.length === 0 && <p className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500">Nenhuma ocorrência encontrada.</p>}
          </section>
          <MapCard reports={apiReports} users={apiUsers} />
        </div>
      </main>
    </div>
  )
}

export default FeedPage
