import { Link } from 'react-router-dom'

export function PlatformHeader() {
    return (
        <header className="border-b sticky top-0 z-1000 border-[#183c36] bg-white">
            <div className="mx-auto flex h-[62px] max-w-[1240px] items-center justify-between px-5 sm:px-8">
                <Link to="/plataforma/feed" className="leading-none" aria-label="SampaReport Feed">
                    <a className="text-[22px] font-extrabold tracking-[-1.5px] text-[#183c36]" href="#" aria-label="SampaReport início">
                        Sampa<span className="text-[#12a879]">Report</span>
                    </a>
                </Link>

                <nav className="hidden h-full items-center gap-8 sm:flex" aria-label="Navegação da plataforma">
                    <Link
                        to="/plataforma/feed"
                        className="flex h-full items-center px-3 text-[11px] text-[#12a879]"
                    >
                        Feed Comunitário
                    </Link>
                    <button type="button" className="text-[11px] text-zinc-900 transition-colors hover:text-[#12a879]">
                        Meus Reports
                    </button>
                </nav>

                <div className="flex items-center gap-4">
                    <button
                        type="button"
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
    )
}