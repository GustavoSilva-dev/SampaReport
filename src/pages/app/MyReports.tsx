import { useMemo, useState } from 'react'
import { FaCheckCircle, FaClipboardList, FaSearch, FaTools } from 'react-icons/fa'
import { GeneralRatingCard } from '../../components/GeneralRatingCard'
import { PlatformHeader } from '../../components/PlatformHeader'
import { ReportCard } from '../../components/ReportCard'
import type { Report } from '../../types'

const myReports: Report[] = [
  {
    id: 'my-report-1',
    titulo: 'Buraco profundo na faixa de ônibus atrapalhando o tráfego',
    descricao: 'Cratera identificada na faixa exclusiva de ônibus, oferecendo risco de acidentes para motociclistas e pedestres.',
    categoria: 'Asfalto / Buracos',
    endereco: 'Pinheiros, Rua dos Pinheiros, 450',
    dataCriacao: '23/07/2024',
    status: 'Aguardando Aprovação',
    quantidadeApoios: 3,
    imagemUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=80',
    autor: { id: 'rodrigo-silva', nome: 'Rodrigo Silva', email: 'rodrigo@example.com', role: 'ROLE_USER' },
  },
  {
    id: 'my-report-2',
    titulo: 'Iluminação pública inoperante em travessa residencial',
    descricao: 'Postes sem iluminação deixam a travessa escura durante a noite e aumentam a sensação de insegurança na região.',
    categoria: 'Iluminação',
    endereco: 'Bela Vista, Rua Haddock Lobo, 210',
    dataCriacao: '21/07/2024',
    status: 'Em Andamento',
    quantidadeApoios: 5,
    imagemUrl: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=80',
    autor: { id: 'rodrigo-silva', nome: 'Rodrigo Silva', email: 'rodrigo@example.com', role: 'ROLE_USER' },
  },
  {
    id: 'my-report-3',
    titulo: 'Calçada danificada dificulta a passagem de pedestres',
    descricao: 'Trecho da calçada apresenta desníveis e pedras soltas, prejudicando a acessibilidade de moradores.',
    categoria: 'Calçadas',
    endereco: 'Vila Madalena, Rua Harmonia, 88',
    dataCriacao: '18/07/2024',
    status: 'Em Homologação',
    quantidadeApoios: 5,
    imagemUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=80',
    justificativa: {
      idJustify: 1,
      idReport: 3,
      dsJustificativa: 'Equipe realizou o reparo da calçada e a regularização do trecho em 15/02.',
      dtJustificativa: '15/02/2025',
      dsImagemDepoisUrl: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?auto=format&fit=crop&w=900&q=80',
    },
    autor: { id: 'rodrigo-silva', nome: 'Rodrigo Silva', email: 'rodrigo@example.com', role: 'ROLE_USER' },
  },
  {
    id: 'my-report-4',
    titulo: 'Faixa de pedestres apagada em cruzamento movimentado',
    descricao: 'A sinalização horizontal está desgastada e dificulta a travessia segura no cruzamento.',
    categoria: 'Sinalização',
    endereco: 'Moema, Avenida Ibirapuera, 1200',
    dataCriacao: '10/07/2024',
    status: 'Concluído',
    quantidadeApoios: 5,
    avaliacao: 5,
    justificativa: {
      idJustify: 1,
      idReport: 4,
      dsJustificativa: 'Equipe realizou o reparo da calçada e a regularização do trecho em 15/02.',
      dtJustificativa: '15/02/2025',
      dsImagemDepoisUrl: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?auto=format&fit=crop&w=900&q=80',
    },
    imagemUrl: 'https://images.unsplash.com/photo-1494522358652-f30e61a60313?auto=format&fit=crop&w=900&q=80',
    autor: { id: 'rodrigo-silva', nome: 'Rodrigo Silva', email: 'rodrigo@example.com', role: 'ROLE_USER' },
  },
]

const metrics = [
  { label: 'Total Reportados', icon: FaClipboardList, value: (reports: Report[]) => reports.length },
  { label: 'Concluídos', icon: FaCheckCircle, value: (reports: Report[]) => reports.filter((report) => report.status === 'Em Homologação' || report.status === 'Concluído').length },
  { label: 'Em Andamento', icon: FaTools, value: (reports: Report[]) => reports.filter((report) => report.status === 'Em Andamento').length },
]

function MyReports() {
  const [query, setQuery] = useState('')
  const filteredReports = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) return myReports

    return myReports.filter((report) =>
      `${report.titulo} ${report.categoria} ${report.endereco} ${report.id}`.toLowerCase().includes(normalizedQuery),
    )
  }, [query])

  return (
    <div className="min-h-screen platform-bg text-zinc-900">
      <PlatformHeader active="reports" />
      <main className="mx-auto max-w-[1240px] px-5 pb-12 sm:px-8">
        <section className="border-b border-zinc-200 py-4">
          <GeneralRatingCard />
          <h1 className="text-2xl font-semibold tracking-[-0.8px] text-[#183c36]">Meus Chamados &amp; Reports</h1>
          <p className="mt-1 text-xs text-zinc-600">Acompanhe e valide o andamento das solicitações de zeladoria urbana abertas por você em São Paulo.</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {metrics.map(({ label, icon: Icon, value }) => (
              <article key={label} className="flex items-center gap-3 rounded-xl border border-emerald-700 moveRight moveRight-delay-1 bg-white px-4 py-3 shadow-sm">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <Icon aria-hidden="true" className="text-sm" />
                </span>
                <div>
                  <p className="text-[10px] text-zinc-500">{label}</p>
                  <p className="text-lg font-semibold leading-5 text-zinc-900">{value(myReports)}</p>
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
          {filteredReports.map((report) => <ReportCard key={report.id} report={report} />)}
          {filteredReports.length === 0 && (
            <p className="rounded-2xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-500">
              Nenhum report encontrado para essa busca.
            </p>
          )}
        </section>
      </main>
    </div>
  )
}

export default MyReports
