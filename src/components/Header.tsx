import { Link } from "react-router-dom";

interface HeaderProps {
  active?: "home" | "sobre" | "integrantes" | "faq" | "contato";
}

export function Header({ active }: HeaderProps) {
  return (
    <header className="mx-auto flex max-w-[1240px] items-center justify-between px-6 py-6 font-medium sm:px-10 sm:py-7">
      <a className="text-[22px] font-extrabold tracking-[-1.5px] text-[#183c36]" href="#" aria-label="SampaReport início">
        Sampa<span className="text-[#12a879]">Report</span>
      </a>
      <nav className="ml-auto mr-14 hidden gap-8 md:flex" aria-label="Navegação principal">
        <Link className={`text-xs transition-colors hover:text-[#12a879] ${active === "home" ? "text-[#12a879]" : ""}`} to="/">Início</Link>
        <Link className={`text-xs transition-colors hover:text-[#12a879] ${active === "sobre" ? "text-[#12a879]" : ""}`} to="/sobre">Sobre</Link>
        <Link className={`text-xs transition-colors hover:text-[#12a879] ${active === "integrantes" ? "text-[#12a879]" : ""}`} to="/integrantes">Integrantes</Link>
        <Link className={`text-xs transition-colors hover:text-[#12a879] ${active === "faq" ? "text-[#12a879]" : ""}`} to="/faq">FAQ</Link>
        <Link className={`text-xs transition-colors hover:text-[#12a879] ${active === "contato" ? "text-[#12a879]" : ""}`} to="/contato">Contato</Link>
      </nav>
    </header>
  ) 
}
