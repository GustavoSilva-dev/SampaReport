import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="mx-auto flex max-w-[1240px] items-center justify-between px-6 py-6 font-medium sm:px-10 sm:py-7">
      <a className="text-[22px] font-extrabold tracking-[-1.5px] text-[#183c36]" href="#" aria-label="SampaReport início">
        Sampa<span className="text-[#12a879]">Report</span>
      </a>
      <nav className="ml-auto mr-14 hidden gap-8 md:flex" aria-label="Navegação principal">
        <Link className="text-xs transition-colors hover:text-[#12a879]" to="/">Home</Link>
        <Link className="text-xs transition-colors hover:text-[#12a879]" to="/sobre">Sobre</Link>
        <Link className="text-xs transition-colors hover:text-[#12a879]" to="/integrantes">Integrantes</Link>
        <Link className="text-xs transition-colors hover:text-[#12a879]" to="/faq">FAQ</Link>
        <Link className="text-xs transition-colors hover:text-[#12a879]" to="/contato">Contato</Link>
      </nav>
      <a className="border-b border-[#12a879] pb-1.5 text-xs text-[#173b36] transition-colors hover:text-[#12a879] max-[440px]:hidden" href="#plataforma">
        Entrar na plataforma <span aria-hidden="true">↗</span>
      </a>
    </header>
  ) 
}
