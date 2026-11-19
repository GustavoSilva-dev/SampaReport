import brayanImage from '../../assets/brayan.png'
import brenoImage from '../../assets/breno.jpg'
import edilsonImage from '../../assets/edilson.jpeg'
import gustavoImage from '../../assets/gustavo.jpeg'
import { Link } from 'react-router-dom'
import { Footer } from '../../components/Footer'
import { Header } from '../../components/Header'

export type Member = {
  slug: string
  name: string
  rm: string
  image: string
  linkedIn: string
  github: string
  role: string
}

export const members: Member[] = [
  {
    slug: 'gustavo-soares-silva',
    name: 'Gustavo Soares Silva',
    rm: 'RM573880',
    image: gustavoImage,
    linkedIn: 'https://www.linkedin.com/in/gustavo-silva-23575638b/',
    github: 'https://github.com/GustavoSilva-dev',
    role: 'Desenvolvedor',
  },
  {
    slug: 'edilson-condori',
    name: 'Edilson Condori',
    rm: 'RM571464',
    image: edilsonImage,
    linkedIn: 'https://www.linkedin.com/in/edilson-condori/',
    github: 'https://github.com/Edilson-Cm',
    role: 'Desenvolvedor',
  },
  {
    slug: 'brayan-dos-santos-sousa',
    name: 'Brayan dos Santos Sousa',
    rm: 'RM564317',
    image: brayanImage,
    linkedIn: 'https://www.linkedin.com/in/brayan-dos-santos-sousa/',
    github: 'https://github.com/Brayan511',
    role: 'Desenvolvedor',
  },
  {
    slug: 'breno-henrique-de-castro-rocha',
    name: 'Breno Henrique de Castro Rocha',
    rm: 'RM572922',
    image: brenoImage,
    linkedIn: 'https://www.linkedin.com/in/breno-henrique-de-castro-rocha-79b24b24b/',
    github: 'https://github.com/BrenoRocha1',
    role: 'Desenvolvedor',
  },
]

function SocialIcon({ type }: { type: 'linkedin' | 'github' }) {
  if (type === 'linkedin') {
    return (
      <svg className="relative h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M5.2 3.5A2.2 2.2 0 1 1 5.2 8a2.2 2.2 0 0 1 0-4.5ZM3.3 9.7h3.8v10.8H3.3V9.7Zm6.2 0h3.6v1.5h.1c.5-.9 1.7-1.9 3.6-1.9 3.8 0 4.5 2.5 4.5 5.7v5.5h-3.8v-4.9c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7v5H9.5V9.7Z" />
      </svg>
    )
  }

  return (
    <svg className="relative h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.5a9.5 9.5 0 0 0-3 18.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.6 1 1.6 1 .9 1.6 2.4 1.1 3 .8.1-.7.4-1.1.7-1.3-2.2-.3-4.5-1.1-4.5-4.8 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.5 9.5 0 0 1 5.1 0c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.7.7 1 1.6 1 2.7 0 3.7-2.3 4.5-4.5 4.8.4.3.7.9.7 1.8v2.7c0 .3.2.6.7.5A9.5 9.5 0 0 0 12 2.5Z" />
    </svg>
  )
}

function Integrantes() {
  return (
    <div className="min-h-screen overflow-hidden font-momo text-zinc-900">
      <Header active="integrantes" />
      <main>
        <section className="mx-auto max-w-[1240px] px-6 pb-14 pt-16 sm:px-10 sm:pb-20 sm:pt-24">
          <div className="reveal-up max-w-3xl">
            <p className="mb-6 text-[10px] uppercase tracking-[.16em] text-emerald-600">Quem faz acontecer</p>
            <h1 className="text-[clamp(44px,7vw,82px)] font-medium leading-none tracking-[-.07em] text-[#183c36]">
              Pessoas que <span className="text-emerald-500 animate-pulse">movem</span> a cidade.
            </h1>
            <p className="mt-8 max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">
              Conheça a equipe da FIAP que idealizou e desenvolveu o SampaReport para a Global Solution.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1240px] px-6 pb-20 sm:px-10 sm:pb-28">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {members.map((member, index) => (
              <article
                className={`reveal-up reveal-delay-${Math.min(index + 1, 3)} overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400 hover:shadow-lg`}
                key={member.rm}
              >
                <Link to={`/integrantes/${member.slug}`} aria-label={`Ver perfil de ${member.name}`}>
                  <img className="h-64 w-full object-cover" src={member.image} alt={`Foto de ${member.name}`} />
                </Link>
                <div className="p-6">
                  <p className="text-[10px] uppercase tracking-[.14em] text-emerald-600">{member.rm} · 1TDSR</p>
                  <h2 className="mt-3 text-lg font-bold leading-tight text-zinc-900">
                    <Link className="transition-colors hover:text-emerald-600" to={`/integrantes/${member.slug}`}>
                      {member.name}
                    </Link>
                  </h2>
                  <p className="mt-2 text-xs text-zinc-600">{member.role}</p>
                  <div className="mt-6 flex gap-2">
                    <a
                      className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-2 text-[10px] text-zinc-600 transition-colors hover:border-emerald-500 hover:text-emerald-600"
                      href={member.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`LinkedIn de ${member.name}`}
                    >
                      <SocialIcon type="linkedin" /> LinkedIn
                    </a>
                    <a
                      className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-2 text-[10px] text-zinc-600 transition-colors hover:border-emerald-500 hover:text-emerald-600"
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`GitHub de ${member.name}`}
                    >
                      <SocialIcon type="github" /> GitHub
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Integrantes
