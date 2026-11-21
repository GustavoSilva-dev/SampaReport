import { Link } from 'react-router-dom'

function ErrorPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center text-[#173b36]">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#12a879]">Erro 404</span>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-1px] sm:text-5xl">
                ESSA PÁGINA NÃO EXISTE
            </h1>
            <p className="mt-3 text-sm text-zinc-600 sm:text-base">Volte para a página inicial</p>
            <Link
                to="/"
                className="mt-7 rounded-xl bg-[#173b36] px-5 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 hover:shadow-lg"
            >
                Retornar
            </Link>
        </main>
    )
}

export default ErrorPage