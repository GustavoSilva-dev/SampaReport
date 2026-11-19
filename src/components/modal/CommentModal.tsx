import { useEffect, useRef, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { FaMapMarkerAlt, FaComments } from 'react-icons/fa'
import { addComment, getComments } from '../../services/commentService'
import type { ComentarioResponseDTO, Report } from '../../types'

interface CommentModalProps {
  isOpen: boolean
  onClose: () => void
  reportId: number
  reportTitulo: string
  report: Report
}

function formatCommentDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const datePart = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' })
    .format(date)
    .replace('.', '')
  const timePart = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(date)

  return `${datePart.charAt(0).toUpperCase()}${datePart.slice(1)}, ${timePart}h`
}

export function CommentModal({ isOpen, onClose, reportId, reportTitulo, report }: CommentModalProps) {
  const [comments, setComments] = useState<ComentarioResponseDTO[]>([])
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')
  const commentsEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    let isActive = true

    async function loadComments() {
      setIsLoading(true)
      setError('')
      setComments([])
      setContent('')

      try {
        const result = await getComments(reportId)
        if (isActive) setComments(result)
      } catch (loadError) {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : 'Não foi possível carregar os comentários.')
        }
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    void loadComments()
    return () => {
      isActive = false
    }
  }, [isOpen, reportId])

  useEffect(() => {
    if (!isLoading && comments.length > 0) {
      commentsEndRef.current?.scrollIntoView({ block: 'nearest' })
    }
  }, [comments, isLoading])

  if (!isOpen) return null

  async function handleSendComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const loggedUser = JSON.parse(localStorage.getItem('logged-user') || '{}') as {
      id?: number
    }
    const trimmedContent = content.trim()

    if (!loggedUser.id) {
      setError('Faça login para enviar um comentário.')
      return
    }
    if (!trimmedContent || isSending) return

    setIsSending(true)
    setError('')

    try {
      const createdComment = await addComment(reportId, {
        texto: trimmedContent,
        usuarioId: loggedUser.id,
      })
      setComments((currentComments) => [
        ...currentComments,
        {
          ...createdComment,
          reportId: createdComment.reportId ?? reportId,
        },
      ])
      setContent('')
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : 'Não foi possível enviar o comentário.')
    } finally {
      setIsSending(false)
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[1100] flex items-start justify-center overflow-y-auto overscroll-contain bg-black/50 p-3 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="comment-modal-title"
    >
      <div className="reveal-up my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-4xl overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-xl sm:max-h-[90vh]">
        <header className="flex items-start justify-between border-b border-zinc-100 px-5 py-4 sm:px-6">
          <div className="min-w-0 pr-4">
            <h2 id="comment-modal-title" className="text-lg font-medium text-zinc-900">
              <FaComments className="inline-block mr-2" />
              Comentários</h2>
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

        <div className="grid min-h-0 md:h-[470px] md:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.2fr)]">
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
            <form onSubmit={handleSendComment} className="shrink-0 space-y-2">
              <label htmlFor={`comment-input-${reportId}`} className="sr-only">Novo comentário</label>
              <textarea
                id={`comment-input-${reportId}`}
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Escreva um comentário ou informação sobre este local..."
                rows={3}
                className="w-full resize-none rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {error && <p className="text-xs text-red-600" role="alert">{error}</p>}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!content.trim() || isSending}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#12a879] px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSending ? 'Enviando...' : 'Comentar'}
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m22 2-7 20-4-9-9-4Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M22 2 11 13" />
                  </svg>
                </button>
              </div>
            </form>

            <div className="mt-5 h-64 space-y-4 overflow-y-auto pr-2 md:h-auto md:min-h-0 md:flex-1">
              {isLoading ? (
                <p className="py-6 text-center text-sm text-zinc-500" role="status">Carregando comentários...</p>
              ) : comments.length === 0 ? (
                <p className="py-6 text-center text-sm text-zinc-500">Nenhum comentário ainda. Seja o primeiro a colaborar!</p>
              ) : (
                comments.map((comment) => {
                  const authorName = comment.usuarioNome?.trim() || 'Cidadão'
                  const initial = authorName.substring(0, 1).toUpperCase()

                  return (
                    <article key={comment.id} className="flex gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#12a879] text-xs font-medium text-white">
                        {initial}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                          <p className="text-sm font-medium text-zinc-900">{authorName}</p>
                          <time className="text-[11px] text-zinc-400">{formatCommentDate(comment.dataCriacao)}</time>
                        </div>
                        <p className="mt-1 text-sm leading-5 text-zinc-600 font-extralight">{comment.texto}</p>
                      </div>
                    </article>
                  )
                })
              )}
              <div ref={commentsEndRef} />
            </div>
          </section>
        </div>
      </div>
    </div>,
    document.body,
  )
}
