import { FeatureCard, type FeatureCardProps } from '../../components/FeatureCard'
import { Header } from '../../components/Header'
import { Hero } from '../../components/Hero'

const features: FeatureCardProps[] = [
  { icon: 'pin', eyebrow: '01 / Localização', title: 'Cada ocorrência no mapa', description: 'Registre o problema com foto e localização exata para que a equipe certa encontre o ponto sem ruído.' },
  { icon: 'users', eyebrow: '02 / Comunidade', title: 'Validação da vizinhança', description: 'A comunidade confirma o que é prioridade. Juntos, transformamos relatos isolados em evidências.' },
  { icon: 'check', eyebrow: '03 / Transparência', title: 'Do chamado à solução', description: 'Acompanhe cada etapa, receba a foto do depois e avalie o serviço realizado no seu bairro.' },
]

function Home() {
  return (
    <div className="min-h-screen overflow-hidden font-medium text-[#173b36]">
      <Header />
      <main>
        <Hero />
        <section className="bg-[#e8eee8] px-6 py-12 sm:px-10 sm:py-14 lg:px-[max(40px,calc((100%-1160px)/2))]" id="dados" aria-label="Impacto do SampaReport">
          <div className="font-['Momo_Trust_Display'] text-[10px] uppercase tracking-[.12em] text-[#12a879]">Uma cidade melhor começa no detalhe</div>
          <div className="mt-7 grid grid-cols-1 items-end gap-6 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr] lg:gap-10">
            <div><p className="text-[72px] font-medium leading-[.9] tracking-[-.08em]">24h</p><p className="mt-2 max-w-[180px] text-[13px] text-[#687872]">para a comunidade validar um chamado</p></div>
            <div className="border-t border-[#b9c9bf] pt-4 sm:border-l sm:border-t-0 sm:pl-7 sm:pt-0"><strong className="block text-[32px] font-medium tracking-[-.06em] text-[#12a879]">03</strong><span className="mt-1 block max-w-[135px] text-xs leading-5 text-[#687872]">passos para resolver um problema urbano</span></div>
            <div className="border-t border-[#b9c9bf] pt-4 sm:border-l sm:border-t-0 sm:pl-7 sm:pt-0"><strong className="block text-[32px] font-medium tracking-[-.06em] text-[#12a879]">100%</strong><span className="mt-1 block max-w-[135px] text-xs leading-5 text-[#687872]">transparência em cada etapa do processo</span></div>
          </div>
        </section>
        <section className="mx-auto max-w-[1240px] px-6 py-20 sm:px-10 sm:py-28" id="sobre">
          <div className="mb-12 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
            <div><div className="font-['Momo_Trust_Display', sans-serif] text-[10px] uppercase tracking-[.12em] text-[#12a879]">Como funciona</div><h2 className="mt-4 text-[clamp(32px,4vw,49px)] font-medium leading-tight tracking-[-.065em]">Do olhar de quem vive<br />à ação de quem cuida.</h2></div>
            <p className="max-w-[275px] text-[13px] leading-6 text-[#71807a]">Uma ponte simples entre a experiência de quem está na rua e as decisões que transformam a cidade.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">{features.map((feature) => <FeatureCard key={feature.title} {...feature} />)}</div>
        </section>
        <section className="mx-auto mb-12 flex max-w-[1240px] flex-col items-start justify-between gap-7 bg-[#cfe7d7] px-6 py-16 sm:px-10 lg:flex-row lg:items-center rounded-xl">
          <div><div className="font-['Momo_Trust_Display', sans-serif] text-[10px] uppercase tracking-[.12em] text-[#12a879]">Faça parte da mudança</div><h2 className="mt-3 text-[clamp(32px,4vw,46px)] font-medium leading-tight tracking-[-.065em]">A cidade também é<br />um projeto coletivo.</h2></div>

          <a className="inline-flex items-center gap-6 bg-[#173b36] px-5 py-4 text-xs font-medium text-white transition-transform hover:-translate-y-0.5 hover:shadow-lg rounded-xl" href="#plataforma">Acessar a plataforma <span aria-hidden="true">↗</span></a>
        </section>
      </main>
      <footer className="mx-6 flex max-w-[1160px] flex-col gap-3 border-t border-[#dde4de] py-6 text-[9px] uppercase tracking-[.08em] text-[#94a19b] sm:mx-auto sm:flex-row sm:items-center sm:justify-between sm:px-0 ">
        <span className="font-sans text-base font-extrabold normal-case tracking-[-1px] text-[#173b36]">Sampa<span className="text-[#12a879]">Report</span></span><span>Global Solution FIAP · 2026</span>
      </footer>
    </div>
  )
}

export default Home
