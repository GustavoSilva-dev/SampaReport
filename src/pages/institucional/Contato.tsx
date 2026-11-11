import { useState, type FormEvent } from 'react'
import { Footer } from '../../components/Footer'
import { Header } from '../../components/Header'

type FormValues = {
  name: string
  email: string
  subject: string
  message: string
}

type FormField = 'name' | 'email' | 'subject' | 'message'

type FormErrors = {
  name?: string
  email?: string
  subject?: string
  message?: string
}

const initialValues: FormValues = {
  name: '',
  email: '',
  subject: '',
  message: '',
}

function Contato() {
  const [values, setValues] = useState<FormValues>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  function handleChange(field: FormField, value: string) {
    setValues((currentValues) => ({ ...currentValues, [field]: value }))
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: FormErrors = {}
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!values.name.trim()) {
      nextErrors.name = 'Informe seu nome completo.'
    }

    if (!values.email.trim()) {
      nextErrors.email = 'Informe seu e-mail.'
    } else if (!emailPattern.test(values.email)) {
      nextErrors.email = 'Digite um e-mail válido.'
    }

    if (!values.subject) {
      nextErrors.subject = 'Selecione um assunto.'
    }

    if (!values.message.trim()) {
      nextErrors.message = 'Escreva uma mensagem.'
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length === 0) {
      setIsSubmitted(true)
    }
  }

  return (
    <div className="min-h-screen overflow-hidden font-momo text-zinc-900">
      <Header active="contato" />
      <main>
        <section className="mx-auto max-w-[1240px] px-6 pb-16 pt-16 sm:px-10 sm:pb-24 sm:pt-24">
          <div className="reveal-up max-w-3xl">
            <p className="mb-6 text-[10px] uppercase tracking-[.16em] text-emerald-600">Entre em contato</p>
            <h1 className="text-[clamp(44px,7vw,82px)] font-medium leading-none tracking-[-.07em] text-[#183c36]">
              Fale com a equipe Sampa<span className="text-emerald-500 animate-pulse">Report</span>
            </h1>
            <p className="mt-8 max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">
              Tem uma dúvida, sugestão ou precisa de ajuda? Envie uma mensagem e nossa equipe ficará feliz em ajudar.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-2xl px-6 pb-20 sm:px-10 sm:pb-28" aria-label="Formulário de contato">
          {isSubmitted ? (
            <div className="reveal-up flex flex-col items-center border-t-2 border-[#183c36] px-6 py-16 text-center bg-white p-4 rounded-2xl" role="status">
              <span className="text-4xl" aria-hidden="true">✓</span>
              <h2 className="mt-6 text-2xl font-medium tracking-[-.04em] text-zinc-900">Mensagem enviada com sucesso!</h2>
              <p className="mt-3 max-w-md text-sm leading-7 text-zinc-600">
                Nossa equipe retornará o contato em breve.
              </p>
            </div>
          ) : (
            <form className="reveal-up space-y-6 border-t-2 border-[#183c36] pt-8 bg-white p-5 rounded-2xl" onSubmit={handleSubmit} noValidate>
              <div>
                <label className="text-sm text-zinc-600" htmlFor="name">Nome Completo</label>
                <input
                  className="mt-2 block w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  id="name"
                  name="name"
                  onChange={(event) => handleChange('name', event.target.value)}
                  value={values.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  aria-invalid={Boolean(errors.name)}
                  type="text"
                />
                {errors.name && <p className="mt-2 text-sm text-red-500" id="name-error">{errors.name}</p>}
              </div>

              <div>
                <label className="text-sm text-zinc-600" htmlFor="email">E-mail</label>
                <input
                  className="mt-2 block w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  id="email"
                  name="email"
                  onChange={(event) => handleChange('email', event.target.value)}
                  value={values.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  aria-invalid={Boolean(errors.email)}
                  type="email"
                />
                {errors.email && <p className="mt-2 text-sm text-red-500" id="email-error">{errors.email}</p>}
              </div>

              <div>
                <label className="text-sm text-zinc-600" htmlFor="subject">Assunto</label>
                <select
                  className="mt-2 block w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  id="subject"
                  name="subject"
                  onChange={(event) => handleChange('subject', event.target.value)}
                  value={values.subject}
                  aria-describedby={errors.subject ? 'subject-error' : undefined}
                  aria-invalid={Boolean(errors.subject)}
                >
                  <option value="">Selecione uma opção</option>
                  <option value="duvida">Dúvida</option>
                  <option value="sugestao">Sugestão</option>
                  <option value="suporte">Suporte técnico</option>
                </select>
                {errors.subject && <p className="mt-2 text-sm text-red-500" id="subject-error">{errors.subject}</p>}
              </div>

              <div>
                <label className="text-sm text-zinc-600" htmlFor="message">Mensagem</label>
                <textarea
                  className="mt-2 block min-h-32 w-full resize-y rounded-lg border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  id="message"
                  name="message"
                  onChange={(event) => handleChange('message', event.target.value)}
                  value={values.message}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  aria-invalid={Boolean(errors.message)}
                  rows={4}
                />
                {errors.message && <p className="mt-2 text-sm text-red-500" id="message-error">{errors.message}</p>}
              </div>

              <button className="w-full rounded-lg bg-emerald-500 px-5 py-4 text-sm font-medium text-white transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 sm:w-auto" type="submit">
                Enviar Mensagem
              </button>
            </form>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Contato;