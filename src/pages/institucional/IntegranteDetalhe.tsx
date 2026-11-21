import { Link, useParams } from 'react-router-dom'
import { Footer } from '../../components/Footer'
import { Header } from '../../components/Header'
import { members, type Member } from './Integrantes'

function SocialIcon({ type }: { type: 'linkedin' | 'github' }) {
  if (type === 'linkedin') {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M5.2 3.5A2.2 2.2 0 1 1 5.2 8a2.2 2.2 0 0 1 0-4.5ZM3.3 9.7h3.8v10.8H3.3V9.7Zm6.2 0h3.6v1.5h.1c.5-.9 1.7-1.9 3.6-1.9 3.8 0 4.5 2.5 4.5 5.7v5.5h-3.8v-4.9c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7v5H9.5V9.7Z" />
      </svg>
    )
  }

  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.5a9.5 9.5 0 0 0-3 18.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.6 1 1.6 1 .9 1.6 2.4 1.1 3 .8.1-.7.4-1.1.7-1.3-2.2-.3-4.5-1.1-4.5-4.8 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.5 9.5 0 0 1 5.1 0c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.7.7 1 1.6 1 2.7 0 3.7-2.3 4.5-4.5 4.8.4.3.7.9.7 1.8v2.7c0 .3.2.6.7.5A9.5 9.5 0 0 0 12 2.5Z" />
    </svg>
  )
}

function Profile({ member }: { member: Member }) {
  return (
    <section className="mx-auto max-w-[1240px] px-6 pb-20 pt-10 sm:px-10 sm:pb-28 sm:pt-16">
      <Link className="inline-flex items-center gap-2 text-xs text-zinc-600 transition-colors hover:text-emerald-600" to="/integrantes">
        ← Voltar para integrantes
      </Link>

      <div className="reveal-up mt-10 grid items-center gap-10 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm md:grid-cols-[420px_1fr] md:p-8">
        <img className="h-[420px] w-full rounded-xl object-cover" src={member.image} alt={`Foto de ${member.name}`} />

        <div className="px-2 md:px-8">
          <p className="text-[10px] uppercase tracking-[.16em] text-emerald-600">{member.rm} · 1TDSR</p>
          <h1 className="mt-5 text-[clamp(38px,6vw,68px)] font-medium leading-[1.05] tracking-[-.06em] text-[#183c36]">
            {member.name}
          </h1>

          <dl className="mt-8 grid gap-4 border-y border-zinc-200 py-6 sm:grid-cols-2">
            <div>
              <dt className="text-[10px] uppercase tracking-[.14em] text-zinc-400">Papel na equipe</dt>
              <dd className="mt-2 text-sm text-zinc-800">{member.role}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[.14em] text-zinc-400">Turma</dt>
              <dd className="mt-2 text-sm text-zinc-800">1TDSR</dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              className="inline-flex items-center gap-2 rounded-full bg-[#183c36] px-5 py-3 text-xs text-white transition-colors hover:bg-emerald-600"
              href={member.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
            >
              <SocialIcon type="linkedin" /> LinkedIn
            </a>
            <a
              className="inline-flex items-center gap-2 rounded-full border border-zinc-300 px-5 py-3 text-xs text-zinc-700 transition-colors hover:border-emerald-500 hover:text-emerald-600"
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <SocialIcon type="github" /> GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function IntegranteDetalhe() {
  const { slug } = useParams<{ slug: string }>()
  const member = members.find((item) => item.slug === slug)

  return (
    <div className="min-h-screen overflow-hidden font-momo text-zinc-900">
      <Header active="integrantes" />
      <main>
        {member ? (
          <Profile member={member} />
        ) : (
          <section className="mx-auto max-w-[1240px] px-6 py-24 text-center sm:px-10">
            <p className="text-[10px] uppercase tracking-[.16em] text-emerald-600">404</p>
            <h1 className="mt-4 text-4xl text-[#183c36]">Integrante não encontrado</h1>
            <Link className="mt-8 inline-block rounded-full bg-[#183c36] px-5 py-3 text-xs text-white" to="/integrantes">
              Ver todos os integrantes
            </Link>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default IntegranteDetalhe
