import { useEffect, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import type { Comentario, Report } from '../../types'
import { FaMapMarkerAlt } from 'react-icons/fa'

interface CommentModalProps {
  isOpen: boolean
  onClose: () => void
  reportId: number
  reportTitulo: string
  report: Report
}

const mockComments: Comentario[] = [
  {
    id: 1,
    idReport: 1,
    conteudo: 'Também percebi esse problema hoje. A passagem está bem perigosa.',
    dataCriacao: '13/11/2026, 09:30',
    autor: { id: 2, nome: 'Carlos Mendes', role: 'ROLE_USER' },
  },
  {
    id: 2,
    idReport: 2,
    conteudo: 'Já informei os comerciantes da região para não deixarem mais materiais aqui.',
    dataCriacao: '12/11/2026, 16:45',
    autor: { id: 3, nome: 'Ana Souza', role: 'ROLE_USER' },
  },
]

function formatCurrentDate() {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date())
}

export function CommentModal({ isOpen, onClose, reportId, reportTitulo, report }: CommentModalProps) {
  const [comments, setComments] = useState<Comentario[]>([])
  const [content, setContent] = useState('')

  useEffect(() => {
    if (!isOpen) return

    // Mock do GET /api/reports/${reportId}/comments
    setComments(mockComments.filter((comment) => comment.idReport === reportId))
    setContent('')
  }, [isOpen, reportId])

  if (!isOpen) return null

  async function handleSendComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedContent = content.trim()
    if (!trimmedContent) return

    const newComment: Comentario = {
      id: Date.now(),
      idReport: reportId,
      conteudo: trimmedContent,
      dataCriacao: formatCurrentDate(),
      autor: { id: 0, nome: 'Você', role: 'ROLE_USER' },
    }

    setComments((currentComments) => [...currentComments, newComment])
    setContent('')

    // Futuro POST: fetch(`/api/reports/${reportId}/comments`, { method: 'POST', ... })
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[1100] flex items-start justify-center overflow-y-auto overscroll-contain bg-black/50 p-3 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="comment-modal-title"
    >
      <div className="reveal-up my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-4xl overflow-y-auto rounded-2xl border border-zinc-100 bg-white shadow-xl sm:max-h-[90vh]">
        <header className="flex items-start justify-between border-b border-zinc-100 px-5 py-4 sm:px-6">
          <div className="min-w-0 pr-4">
            <h2 id="comment-modal-title" className="text-lg font-medium text-zinc-900">Comentários</h2>
            <p className="mt-1 truncate text-xs text-zinc-500">{reportTitulo}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-lg leading-none text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
            aria-label="Fechar comentários"
          >
            ×
          </button>
        </header>

        <div className="grid min-h-0 md:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.2fr)]">
          <section className="border-b border-zinc-100 bg-emerald-50/50 p-5 sm:p-6 md:border-b-0 md:border-r" aria-label="Informações do report">
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
              <img src={report.imagemUrl} alt="" className="h-40 w-full object-cover" />
              <div className="p-3.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="rounded-full bg-zinc-100 px-2 py-1 text-[10px] text-zinc-700">{report.categoria}</span>
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] text-blue-800 animate-pulse">{report.status}</span>
                </div>
                <h3 className="mt-2 text-sm font-medium leading-5 text-zinc-900">{report.titulo}</h3>
                <p className="mt-2 text-xs leading-5 text-zinc-600">{report.descricao}</p>

                <div className="mt-3 flex items-center gap-2">
                  <FaMapMarkerAlt className="mt-[-3px] h-2 w-2.5 shrink-0 text-emerald-500 animate-ping" title="Localização" />
                  <p className="text-[11px] text-zinc-500">{report.endereco}</p>
                </div>   
              </div>
            </div>
          </section>

          <section className="flex min-h-0 flex-col p-5 sm:p-6" aria-label="Comentários do report">
            <form onSubmit={handleSendComment} className="space-y-2">
              <label htmlFor={`comment-input-${reportId}`} className="sr-only">Novo comentário</label>
              <textarea
                id={`comment-input-${reportId}`}
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Escreva um comentário ou informação sobre este local..."
                rows={3}
                className="w-full resize-none rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-emerald-600"
                >
                  Comentar
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m22 2-7 20-4-9-9-4Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M22 2 11 13" />
                  </svg>
                </button>
              </div>
            </form>

            <div className="mt-5 min-h-0 max-h-80 space-y-4 overflow-y-auto pr-2">
              {comments.length === 0 ? (
                <p className="py-6 text-center text-sm text-zinc-500">Nenhum comentário ainda. Seja o primeiro a colaborar!</p>
              ) : (
                comments.map((comment) => (
                  <article key={comment.id} className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-medium text-emerald-800">
                      {comment.autor.nome.substring(0, 1).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <p className="text-sm font-medium text-zinc-900">{comment.autor.nome}</p>
                        <time className="text-[11px] text-zinc-400">{comment.dataCriacao}</time>
                      </div>
                      <p className="mt-1 text-sm leading-5 text-zinc-600 font-extralight">{comment.conteudo}</p>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>,
    document.body,
  )
}
