import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CreateReportModal } from './modal/CreateReportModal'
import { FaBars, FaTimes } from 'react-icons/fa'
import type { UsuarioResponseDTO } from '../services/registerService'

interface PlatformHeaderProps {
    active?: 'feed' | 'reports' | 'admin'
    onReportCreated?: () => void
}

export function PlatformHeader({ active = 'feed', onReportCreated }: PlatformHeaderProps) {
    const navigate = useNavigate()
    const [isCreateReportOpen, setIsCreateReportOpen] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const loggedUser: UsuarioResponseDTO | null = JSON.parse(localStorage.getItem('logged-user') || 'null')
    const userName = loggedUser?.nome || 'Visitante'
    const userInitial = userName.charAt(0).toUpperCase()
    const isAdmin = loggedUser?.perfil === 'ROLE_ADMIN'

    function handleLogout() {
        localStorage.clear()
        setIsMenuOpen(false)
        navigate('/')
    }

    return (
        <>
        <header className="sticky top-0 z-1000 border-b border-[#183c36] bg-white">
            <div className="mx-auto flex h-[62px] max-w-[1240px] items-center justify-between px-5 sm:px-8">
                <Link to="/plataforma/feed" className="text-[22px] font-extrabold leading-none tracking-[-1.5px] text-[#183c36]" aria-label="SampaReport Feed">
                    Sampa<span className="text-[#12a879]">Report</span>
                </Link>

                <nav className="hidden h-full items-center gap-8 sm:flex" aria-label="Navegação da plataforma">
                    <Link
                        to="/plataforma/feed"
                        className={`flex h-full items-center px-3 text-[11px] transition-colors hover:text-[#12a879] ${active === 'feed' ? 'text-[#12a879]' : 'text-zinc-900'}`}
                    >
                        Feed Comunitário
                    </Link>
                    {!isAdmin && (
                        <Link
                            to="/plataforma/meus-reports"
                            className={`flex h-full items-center px-3 text-[11px] transition-colors hover:text-[#12a879] ${active === 'reports' ? 'text-[#12a879]' : ' text-zinc-900'}`}
                        >
                            Meus Reports
                        </Link>
                    )}
                    {isAdmin && (
                        <Link
                            to="/admin"
                            className={`flex h-full items-center rounded-md px-3 text-[11px] transition-colors hover:text-[#12a879] ${active === 'admin' ? 'text-[#12a879]' : 'text-zinc-900'}`}
                        >
                            Painel Prefeitura
                        </Link>
                    )}
                </nav>

                <div className="flex items-center gap-4">
                    {!isAdmin && (
                        <button
                            type="button"
                            onClick={() => setIsCreateReportOpen(true)}
                            className="rounded-md bg-[#12a879] px-3.5 py-2 text-[11px] text-white shadow-sm transition-colors hover:bg-emerald-700"
                        >
                            <span aria-hidden="true" className="sm:mr-1.5 text-sm">+</span>
                            <span className="hidden sm:inline">Novo Report</span>
                        </button>
                    )}
                    <div className="hidden items-center gap-2 sm:flex">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-medium text-emerald-800">
                            {userInitial}
                        </div>
                        <div className="leading-tight">
                            <p className="text-[10px] text-zinc-900">{userName}</p>
                            <p className="text-[9px] text-zinc-500">{loggedUser?.perfil == "ROLE_USER" ? "Perfil Cidadão" : "Perfil Admin"}</p>
                        </div>
                    </div>
                    {loggedUser && (
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="hidden rounded-md border border-red-200 px-3 py-2 text-[11px] font-medium text-red-700 transition-colors hover:bg-red-50 sm:block"
                        >
                            Sair da Conta
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
                        className="rounded-md p-2 text-[#183c36] transition-colors hover:bg-emerald-50 sm:hidden"
                        aria-expanded={isMenuOpen}
                        aria-controls="platform-mobile-menu"
                        aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
                    >
                        {isMenuOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
                    </button>
                </div>
            </div>
            {isMenuOpen && (
                <nav id="platform-mobile-menu" className="fixed w-full border-t border-zinc-200 bg-white px-5 py-3 shadow-md sm:hidden" aria-label="Navegação da plataforma mobile">
                    <Link onClick={() => setIsMenuOpen(false)} to="/plataforma/feed" className={`block rounded-md px-3 py-2 text-xs ${active === 'feed' ? 'text-[#12a879]' : 'text-zinc-900'}`}>
                        Feed Comunitário
                    </Link>
                    {!isAdmin && (
                        <Link onClick={() => setIsMenuOpen(false)} to="/plataforma/meus-reports" className={`block rounded-md px-3 py-2 text-xs ${active === 'reports' ? 'text-[#12a879]' : 'text-zinc-900'}`}>
                            Meus Reports
                        </Link>
                    )}
                    {isAdmin && (
                        <Link onClick={() => setIsMenuOpen(false)} to="/admin" className={`block rounded-md px-3 py-2 text-xs ${active === 'admin' ? 'text-[#12a879]' : 'text-zinc-900'}`}>
                            Painel Prefeitura
                        </Link>
                    )}
                    {loggedUser && (
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="mt-2 w-full rounded-md border border-red-200 px-3 py-2 text-left text-xs font-medium text-red-700 hover:bg-red-50"
                        >
                            Sair da Conta
                        </button>
                    )}
                </nav>
            )}
        </header>
        <CreateReportModal isOpen={isCreateReportOpen} onClose={() => setIsCreateReportOpen(false)} onSuccess={onReportCreated} />
        </>
    )
}