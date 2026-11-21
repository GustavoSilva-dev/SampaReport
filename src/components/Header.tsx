import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

interface HeaderProps {
  active?: "home" | "sobre" | "integrantes" | "faq" | "contato";
}

export function Header({ active }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative mx-auto flex max-w-[1240px] items-center justify-between px-6 py-6 font-medium sm:px-10 sm:py-7">
      {active !== "home" && (
        <a className="text-[22px] font-extrabold tracking-[-1.5px] text-[#183c36]" href="#" aria-label="SampaReport início">
        Sampa<span className="text-[#12a879]">Report</span>
      </a>
      )}
      <nav className="ml-auto mr-14 hidden gap-8 md:flex" aria-label="Navegação principal">
        <Link className={`text-xs transition-colors hover:text-[#12a879] ${active === "home" ? "text-[#12a879]" : ""}`} to="/">Início</Link>
        <Link className={`text-xs transition-colors hover:text-[#12a879] ${active === "sobre" ? "text-[#12a879]" : ""}`} to="/sobre">Sobre</Link>
        <Link className={`text-xs transition-colors hover:text-[#12a879] ${active === "integrantes" ? "text-[#12a879]" : ""}`} to="/integrantes">Integrantes</Link>
        <Link className={`text-xs transition-colors hover:text-[#12a879] ${active === "faq" ? "text-[#12a879]" : ""}`} to="/faq">FAQ</Link>
        <Link className={`text-xs transition-colors hover:text-[#12a879] ${active === "contato" ? "text-[#12a879]" : ""}`} to="/contato">Contato</Link>
      </nav>
      <button
        type="button"
        onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        className="ml-auto rounded-md p-2 text-[#183c36] transition-colors hover:bg-emerald-50 md:hidden"
        aria-expanded={isMenuOpen}
        aria-controls="institutional-mobile-menu"
        aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
      >
        {isMenuOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
      </button>
      {isMenuOpen && (
        <nav id="institutional-mobile-menu" className="absolute left-6 right-6 top-full z-10 rounded-lg border border-zinc-200 bg-white p-3 shadow-md md:hidden" aria-label="Navegação principal mobile">
          <Link onClick={() => setIsMenuOpen(false)} className={`block rounded-md px-3 py-2 text-xs ${active === "home" ? "bg-emerald-50 text-[#12a879]" : ""}`} to="/">Início</Link>
          <Link onClick={() => setIsMenuOpen(false)} className={`block rounded-md px-3 py-2 text-xs ${active === "sobre" ? "bg-emerald-50 text-[#12a879]" : ""}`} to="/sobre">Sobre</Link>
          <Link onClick={() => setIsMenuOpen(false)} className={`block rounded-md px-3 py-2 text-xs ${active === "integrantes" ? "bg-emerald-50 text-[#12a879]" : ""}`} to="/integrantes">Integrantes</Link>
          <Link onClick={() => setIsMenuOpen(false)} className={`block rounded-md px-3 py-2 text-xs ${active === "faq" ? "bg-emerald-50 text-[#12a879]" : ""}`} to="/faq">FAQ</Link>
          <Link onClick={() => setIsMenuOpen(false)} className={`block rounded-md px-3 py-2 text-xs ${active === "contato" ? "bg-emerald-50 text-[#12a879]" : ""}`} to="/contato">Contato</Link>
        </nav>
      )}
    </header>
  ) 
}
