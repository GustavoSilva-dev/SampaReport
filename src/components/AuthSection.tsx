import { useState, type FormEvent } from 'react'
import prefeituraLogo from '../assets/prefeitura-logo.png'

type AuthMode = 'login' | 'register'
type UserRole = 'ROLE_USER' | 'ROLE_ADMIN'

type AuthValues = {
  name: string
  email: string
  password: string
  role: UserRole
}

type AuthErrors = {
  name?: string
  email?: string
  password?: string
  role?: string
}

const initialValues: AuthValues = {
  name: '',
  email: '',
  password: '',
  role: 'ROLE_USER',
}

function AuthSection() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [values, setValues] = useState<AuthValues>(initialValues)
  const [errors, setErrors] = useState<AuthErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode)
    setErrors({})
    setSuccessMessage('')
  }

  function handleChange(field: 'name' | 'email' | 'password' | 'role', value: string) {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }))
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }))
    setSuccessMessage('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: AuthErrors = {}
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (mode === 'register' && !values.name.trim()) {
      nextErrors.name = 'Informe seu nome.'
    }

    if (!values.email.trim()) {
      nextErrors.email = 'Informe seu e-mail.'
    } else if (!emailPattern.test(values.email)) {
      nextErrors.email = 'Digite um e-mail válido.'
    }

    if (!values.password.trim()) {
      nextErrors.password = 'Informe sua senha.'
    } else if (values.password.length < 6) {
      nextErrors.password = 'A senha deve ter pelo menos 6 caracteres.'
    }

    if (mode === 'register' && !values.role) {
      nextErrors.role = 'Selecione um perfil.'
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    await new Promise((resolve) => {
      window.setTimeout(resolve, 600)
    })

    localStorage.setItem('sampareport-profile', mode === 'register' ? values.role : 'ROLE_USER')
    setSuccessMessage(mode === 'login' ? 'Login realizado com sucesso.' : 'Conta criada com sucesso.')
    setIsSubmitting(false)
  }

  return (
    <section className="mx-auto max-w-[1240px] px-6 pt-8 sm:px-10 sm:pt-12" aria-labelledby="auth-title">
      <div className="grid items-start gap-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
        <div className="max-w-md lg:pt-32">
          <div className="mb-7 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[.12em] text-[#12a879] moveRight moveRight-delay-1">
          <span className="h-[6px] w-[6px] rounded-full bg-green-300 animate-ping" />Global Solution FIAP · 2026 · Citizen Tech
          <img className="h-7 w-auto z-100 ml-2" src={prefeituraLogo} alt="Prefeitura de São Paulo" />
          </div>

          <h1 className="text-[clamp(34px,5vw,54px)] md:text-[70px] font-extrabold tracking-[-.08em] text-[#183c36] justify-center moveRight moveRight-delay-3">
            Sampa<span className="text-[#12a879] animate-pulse">Report</span>
          </h1>
          <div className="mt-8 flex items-center gap-3 text-[10px] uppercase tracking-[.14em] text-emerald-600 moveRight moveRight-delay-2">
            <span className="h-px w-9 bg-emerald-500" />
            Tecnologia para uma cidade mais participativa
            <span className="h-px w-9 bg-emerald-500" />
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white/70 p-6 shadow-sm backdrop-blur-sm sm:p-8 reveal-delay-3">
          <div className="mb-7 text-center">
            <p className="text-[10px] uppercase tracking-[.16em] text-emerald-600">Acesso à plataforma</p>
            <h2 className="mt-3 text-2xl font-medium tracking-[-.05em] text-[#183c36]" id="auth-title">
              {mode === 'login' ? 'Entre na sua conta' : 'Crie sua conta'}
            </h2>
          </div>

          <div className="mb-7 grid grid-cols-2 rounded-lg bg-emerald-50 p-1" role="tablist" aria-label="Tipo de acesso">
            <button
              className={`rounded-md px-3 py-2 text-sm transition ${mode === 'login' ? 'bg-white text-emerald-600 shadow-sm' : 'text-zinc-600 hover:text-emerald-600'}`}
              onClick={() => changeMode('login')}
              role="tab"
              aria-selected={mode === 'login'}
              type="button"
            >
              Entrar
            </button>
            <button
              className={`rounded-md px-3 py-2 text-sm transition ${mode === 'register' ? 'bg-white text-emerald-600 shadow-sm' : 'text-zinc-600 hover:text-emerald-600'}`}
              onClick={() => changeMode('register')}
              role="tab"
              aria-selected={mode === 'register'}
              type="button"
            >
              Criar Conta
            </button>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          {mode === 'register' && (
            <div>
              <label className="text-sm text-zinc-600" htmlFor="auth-name">Nome</label>
              <input
                className="mt-2 block w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                id="auth-name"
                onChange={(event) => handleChange('name', event.target.value)}
                value={values.name}
                placeholder="Digite seu nome completo"
                type="text"
              />
              {errors.name && <p className="mt-2 text-sm text-red-500">{errors.name}</p>}
            </div>
          )}

          <div>
            <label className="text-sm text-zinc-600" htmlFor="auth-email">E-mail</label>
            <input
              className="mt-2 block w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              id="auth-email"
              placeholder="seu.email@exemplo.com"
              onChange={(event) => handleChange('email', event.target.value)}
              value={values.email}
              type="email"
            />
            {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label className="text-sm text-zinc-600" htmlFor="auth-password">Senha</label>
            <input
              className="mt-2 block w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              id="auth-password"
              placeholder="Digite sua senha"
              onChange={(event) => handleChange('password', event.target.value)}
              value={values.password}
              type="password"
            />
            {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password}</p>}
          </div>

          {mode === 'register' && (
            <div>
              <label className="text-sm text-zinc-600" htmlFor="auth-role">Perfil de acesso</label>
              <select
                className="mt-2 block w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                id="auth-role"
                onChange={(event) => handleChange('role', event.target.value)}
                value={values.role}
              >
                <option value="ROLE_USER">Usuário Comum</option>
                <option value="ROLE_ADMIN">Usuário Administrativo</option>
              </select>
              {errors.role && <p className="mt-2 text-sm text-red-500">{errors.role}</p>}
            </div>
          )}

          <button
            className="w-full rounded-lg bg-emerald-500 px-5 py-3.5 text-sm font-medium text-white transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? (mode === 'login' ? 'Entrando...' : 'Criando conta...') : (mode === 'login' ? 'Entrar' : 'Criar Conta')}
          </button>

          {successMessage && <p className="text-center text-sm text-emerald-600" role="status">{successMessage}</p>}
          </form>
        </div>
      </div>
    </section>
  )
}

export default AuthSection
