import { Header } from '../../components/Header'
import { Hero } from '../../components/Hero'
import { Footer } from '../../components/Footer'
import AuthSection from '../../components/AuthSection'

function Home() {
  return (
    <div className="min-h-screen overflow-hidden font-medium text-[#173b36]" id="plataforma">
      <Header active="home"/>
      <main className="reveal-up">
        <AuthSection />
        <Hero />
        <section className="reveal-up reveal-delay-2 mx-auto mb-12 flex max-w-[1240px] flex-col items-start justify-between gap-7 rounded-xl bg-[#cfe7d7] px-6 py-16 sm:px-10 lg:flex-row lg:items-center">
          <div><div className="font-['Momo_Trust_Display', sans-serif] text-[10px] uppercase tracking-[.12em] text-[#12a879]">Faça parte da mudança</div><h2 className="mt-3 text-[clamp(32px,4vw,46px)] font-medium leading-tight tracking-[-.065em]">A cidade também é<br />um projeto coletivo.</h2></div>
          <a className="inline-flex items-center gap-6 bg-[#173b36] px-5 py-4 text-xs font-medium text-white transition-transform hover:-translate-y-0.5 hover:shadow-lg rounded-xl" href="#plataforma">Acessar a plataforma <span aria-hidden="true">↑</span></a>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Home
