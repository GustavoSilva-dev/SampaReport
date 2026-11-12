import { Link } from 'react-router'
import spGif from '../assets/sp.gif'

export function Hero() {
  return (
    <section className="mx-auto grid min-h-[610px] max-w-[1240px] grid-cols-1 gap-11 px-6 pb-16 pt-12 sm:px-10 sm:pb-24 sm:pt-[72px] lg:grid-cols-[minmax(0,.92fr)_minmax(420px,1.08fr)] lg:gap-[8%] font-medium">
      <div className="reveal-up self-center lg:pb-5">
        <h1 className="text-[clamp(53px,6vw,88px)] font-medium leading-[.96] tracking-[-.075em] text-[#173b36]">
          A cidade que<br /><em className="not-italic text-[#12a879] animate-pulse">escuta</em> transforma.
        </h1>
        <p className="mb-8 mt-7 max-w-[430px] font-medium text-[#61716b]">
          O SampaReport conecta quem vive São Paulo a quem pode transformá-la.
          Registre, valide e acompanhe os problemas urbanos do seu bairro.
        </p>
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-7">
          <a className="inline-flex items-center gap-6 bg-[#12a879] px-5 py-4 text-xs font-medium text-white transition-transform hover:-translate-y-0.5 hover:shadow-lg rounded-xl" href="#plataforma">
            Acessar Plataforma <span aria-hidden="true">↗</span>
          </a>
            
          <Link to="/sobre" className="border-b border-[#bdc9c4] pb-1.5 text-xs text-[#52635d]">
            Conheça o projeto <span className="ml-3 text-[#12a879]" aria-hidden="true">↓</span>
          </Link>
        </div>
      </div>

      <div className="reveal-image reveal-delay-2 relative  transition-transform">
        <div className="relative overflow-hidden h-[600px] rounded-lg border-5 border-emerald-600">
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent to-[#173b36]" />
          <img className="h-full w-full object-cover [filter:sepia(.25)_contrast(1.05)] movement-img absolute scale-120" src={spGif} alt="Vista histórica do centro de São Paulo"/>
          <span className="absolute bottom-6 left-6 font-mono text-[10px] uppercase leading-[1.7] tracking-[.1em] text-[#f8f2e7] z-100">
            - São Paulo, 2025<br /><b className="font-sans text-[13px] font-medium normal-case tracking-normal text-white animate-pulse">Uma cidade em movimento</b>
          </span>
        </div>

        <div className="mt-5 flex items-center gap-3 font-mono text-[9px] uppercase leading-[1.5] tracking-[.08em] text-[#87958f]">
          <span className="h-px w-9 bg-[#f5a943]" /> <span>Memória para<br />construir o futuro</span>
        </div>
      </div>
    </section>
  )
}
