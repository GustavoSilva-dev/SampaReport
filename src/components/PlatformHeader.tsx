import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CreateReportModal } from './modal/CreateReportModal'

interface PlatformHeaderProps {
    active?: 'feed' | 'reports' | 'admin'
}

export function PlatformHeader({ active = 'feed' }: PlatformHeaderProps) {
    const [isCreateReportOpen, setIsCreateReportOpen] = useState(false)

    return (
        <>
        <header className="border-b sticky top-0 z-1000 border-[#183c36] bg-white">
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
                    <Link
                        to="/plataforma/meus-reports"
                        className={`flex h-full items-center px-3 text-[11px] transition-colors hover:text-[#12a879] ${active === 'reports' ? 'text-[#12a879]' : ' text-zinc-900'}`}
                    >
                        Meus Reports
                    </Link>
                    <Link
                        to="/admin"
                        className={`flex h-full items-center rounded-md px-3 text-[11px] transition-colors hover:text-[#12a879] ${active === 'admin' ? 'text-[#12a879]' : 'text-zinc-900'}`}
                    >
                        Painel Prefeitura
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => setIsCreateReportOpen(true)}
                        className="rounded-md bg-[#12a879] px-3.5 py-2 text-[11px] text-white shadow-sm transition-colors hover:bg-emerald-700"
                    >
                        <span aria-hidden="true" className="mr-1.5 text-sm">+</span>
                        Novo Report
                    </button>
                    <div className="hidden items-center gap-2 sm:flex">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-medium text-emerald-800">
                            R
                        </div>
                        <div className="leading-tight">
                            <p className="text-[10px] text-zinc-900">Rodrigo Silva</p>
                            <p className="text-[9px] text-zinc-500">Cidadão</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        <CreateReportModal isOpen={isCreateReportOpen} onClose={() => setIsCreateReportOpen(false)} />
        </>
    )
}