import { useMemo, useState } from 'react'
import { PlatformHeader } from '../../components/PlatformHeader'
import { ReportCard } from '../../components/ReportCard'
import type { Report } from '../../types'

const reports: Report[] = [
  {
    id: 'report-1',
    titulo: 'Buraco profundo na faixa de ônibus atrapalhando o tráfego',
    descricao: 'Cratera com cerca de 50cm de diâmetro na faixa exclusiva de ônibus em frente do Metrô Faria Lima. Alto risco de acidentes para motociclistas e retenção das linhas intermunicipais.',
    categoria: 'Asfalto / Buracos',
    endereco: 'Av. Brigadeiro Faria Lima, Pinheiros',
    dataCriacao: 'há 2 horas',
    status: 'Aguardando Aprovação',
    quantidadeApoios: 4,
    imagemUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=80',
    autor: { id: 'user-1', nome: 'Mariana Costa', email: 'mariana@example.com', role: 'ROLE_USER' },
  },
  {
    id: 'report-2',
    titulo: 'Ponto viciado de descarte de entulho e móveis velhos na calçada',
    descricao: 'Descarte irregular ocupando a passagem de pedestres e dificultando o acesso de moradores à calçada.',
    categoria: 'Lixo / Entulho',
    endereco: 'Rua dos Pinheiros, Bela Vista',
    dataCriacao: 'Ontem',
    status: 'Aguardando Atendimento',
    quantidadeApoios: 8,
    imagemUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=900&q=80',
    autor: { id: 'user-2', nome: 'Carlos Mendes', email: 'carlos@example.com', role: 'ROLE_USER' },
  },
  {
    id: 'report-3',
    titulo: 'Iluminação pública apagada há três dias',
    descricao: 'Dois postes sem iluminação deixam o trecho escuro durante a noite e aumentam a sensação de insegurança.',
    categoria: 'Iluminação',
    endereco: 'Rua Haddock Lobo, Jardins',
    dataCriacao: 'há 1 dia',
    status: 'Em Andamento',
    quantidadeApoios: 5,
    imagemUrl: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=80',
    autor: { id: 'user-3', nome: 'Ana Souza', email: 'ana@example.com', role: 'ROLE_USER' },
  },
]

function SearchIcon() {
  return <span aria-hidden="true" className="text-sm text-zinc-400">⌕</span>
}

function FeedPage() {
  const [query, setQuery] = useState('')
  const filteredReports = useMemo(
    () => reports.filter((report) => `${report.titulo} ${report.categoria} ${report.endereco}`.toLowerCase().includes(query.toLowerCase())),
    [query],
  )

  return (
    <div className="min-h-screen platform-bg text-zinc-900">
      <PlatformHeader />
      <main className="mx-auto max-w-[1240px] px-5 pb-10 sm:px-8">
        <section className="border-b z-1000 border-zinc-200 py-4">
          <h1 className="text-xl font-medium tracking-[-0.5px]">Feed de Ocorrências</h1>
          <p className="mt-0.5 text-[11px] text-zinc-600">Acompanhe e apoie os problemas do seu bairro. Com 5 apoios, a prefeitura é acionada.</p>
          <label className="mt-2 flex h-7 max-w-[358px] items-center gap-2 rounded-md border border-zinc-300 bg-white px-2.5">
            <SearchIcon />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent text-[11px] outline-none placeholder:text-zinc-500" placeholder="Busca" aria-label="Buscar ocorrências" />
          </label>
        </section>

        <div className="grid items-start gap-3 pt-3 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]">
          <section className="space-y-2" aria-label="Lista de ocorrências">
            {filteredReports.map((report) => <ReportCard key={report.id} report={report} />)}
            {filteredReports.length === 0 && <p className="rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500">Nenhuma ocorrência encontrada.</p>}
          </section>
          <aside className="moveRight moveRight-delay-1 sticky top-20 rounded-xl border border-zinc-200 bg-white p-2.5 shadow-sm">
            <h2 className="px-0.5 py-1 text-sm font-medium">Mapa de Ocorrências</h2>
            <div className="mt-1 h-[294px] rounded-lg border border-dashed border-zinc-200 bg-white" aria-label="Área reservada para o mapa de ocorrências" />
            <div className="mt-2 rounded-lg border border-zinc-200 bg-gradient-to-r from-emerald-500 to-emerald-700 px-3 py-2.5 text-[11px] leading-4 text-white">
              <span className="underline">Apoio comunitário:</span><br/> Apenas ocorrências com 5 apoios entram para o painel de chamados da Prefeitura
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

export default FeedPage
