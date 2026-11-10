import { Footer } from '../../components/Footer'
import { Header } from '../../components/Header'

const pillars = [
  {
    number: '01',
    title: 'Geolocalização exata',
    description: 'Mapas integrados registram o ponto preciso de cada buraco, semáforo quebrado ou descarte irregular.',
  },
  {
    number: '02',
    title: 'Filtro comunitário',
    description: 'A vizinhança valida o que realmente importa. Com 5 upvotes, o chamado chega à Prefeitura.',
  },
  {
    number: '03',
    title: 'Auditoria cidadã',
    description: 'O morador acompanha o antes e depois, confirma a solução e avalia o serviço realizado.',
  },
]

const steps = [
  ['Aguardando aprovação', 'O cidadão publica o problema e aguarda 5 upvotes da vizinhança.'],
  ['Aguardando homologação', 'Ao atingir a meta, o chamado sobe para o painel da Prefeitura.'],
  ['Em andamento', 'A equipe técnica assume a ocorrência e executa o reparo na rua.'],
  ['Em homologação', 'A Prefeitura envia a foto do conserto concluído para validação.'],
  ['Concluído', 'O cidadão confirma a resolução e dá uma nota de 0 a 5.'],
]

const technologies = [
  ['Frontend', 'React · Vite · TypeScript · Tailwind CSS'],
  ['Backend', 'Java 25 · Spring Boot · MVC · BO · DAO'],
  ['Banco de dados', 'Oracle SQL · Integridade referencial'],
  ['APIs & nuvem', 'OpenStreetMap · Cloudinary'],
]

function Sobre() {
  return (
    <div className="min-h-screen overflow-hidden font-momo text-zinc-900">
      <Header />
      <main>
        <section className="mx-auto max-w-[1240px] px-6 pt-16 sm:px-10 sm:pb-28 sm:pt-24 md:pb-10">
          <div className="max-w-4xl">
            <p className="mb-6 text-[10px] uppercase tracking-[.16em] text-emerald-600">Sobre o SampaReport</p>
            <h1 className="max-w-4xl text-[clamp(44px,7vw,86px)] text-[#183c36] font-medium leading-[1] tracking-[-.07em]">
              Zeladoria inteligente <span className="text-emerald-500 animate-pulse">e transparente.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">
              O SampaReport nasceu para diminuir a lentidão e a falta de transparência nos chamados de infraestrutura urbana de São Paulo.
              Conectamos quem vive a cidade a quem pode transformá-la, com evidências, participação e acompanhamento em cada etapa.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1240px] px-6 py-20 sm:px-10 sm:py-24 md:py-20" id="pilares">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[.16em] text-emerald-600">Nossos pilares</p>
              <h2 className="mt-3 text-3xl font-medium tracking-[-.05em] sm:text-5xl">Tecnologia com propósito coletivo.</h2>
            </div>
            <p className="max-w-xs text-xs leading-6 text-zinc-600">Uma plataforma feita para transformar relatos cotidianos em ações públicas verificáveis.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {pillars.map((pillar) => (
              <article key={pillar.number} className="rounded-xl border-t-2 border-zinc-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:shadow-lg">
                <span className="text-xs text-emerald-600">{pillar.number}</span>
                <h3 className="mt-14 text-xl font-medium tracking-[-.03em]">{pillar.title}</h3>
                <p className="mt-3 text-xs leading-6 text-zinc-600">{pillar.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[#173b36] px-6 py-16 text-white sm:px-10 sm:py-24" id="ciclo">
          <div className="mx-auto max-w-[1240px]">
            <p className="text-[10px] uppercase tracking-[.16em] text-emerald-300">Como funciona</p>
            <h2 className="mt-3 max-w-xl text-3xl font-medium tracking-[-.05em] sm:text-5xl">Do primeiro relato à solução.</h2>
            <div className="mt-12 grid gap-0 border-l border-white/20 md:grid-cols-5 md:border-l-0 md:border-t">
              {steps.map(([title, description], index) => (
                <article key={title} className="relative border-b border-white/20 px-6 py-6 first:pt-0 md:border-b-0 md:border-r md:px-5 md:pt-7 md:first:pt-7">
                  <span className="absolute -left-[5px] top-0 h-2.5 w-2.5 rounded-full bg-emerald-400 md:-top-[5px] md:left-0" />
                  <span className="font-mono text-[10px] text-emerald-300">0{index + 1}</span>
                  <h3 className="mt-5 text-sm font-medium">{title}</h3>
                  <p className="mt-3 text-xs leading-6 text-white/60">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1240px] px-6 py-16 sm:px-10 sm:py-24" id="tecnologia">
          <p className="text-[10px] uppercase tracking-[.16em] text-emerald-600">Por baixo do capô</p>
          <div className="mt-3 grid gap-10 md:grid-cols-[.8fr_1.2fr]">
            <h2 className="text-3xl font-medium tracking-[-.05em] sm:text-5xl">Construído para evoluir com a cidade.</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {technologies.map(([name, tools]) => (
                <article key={name} className="rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-emerald-400">
                  <h3 className="text-sm font-medium text-emerald-600">{name}</h3>
                  <p className="mt-3 text-xs leading-6 text-zinc-600">{tools}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Sobre
