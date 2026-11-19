import { createPortal } from 'react-dom'
import { FaTimes } from 'react-icons/fa'

interface GradeModalProps {
  isOpen: boolean
  reportTitle: string
  isSubmitting: boolean
  onClose: () => void
  onGrade: (nota: number) => void
}

export function GradeModal({ isOpen, reportTitle, isSubmitting, onClose, onGrade }: GradeModalProps) {
  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="grade-modal-title"
    >
      <div className="reveal-up w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl sm:p-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h2 id="grade-modal-title" className="text-lg font-bold text-[#183c36]">Avaliar Reparo</h2>
            <p className="mt-1 text-xs text-zinc-500">{reportTitle}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700" aria-label="Fechar avaliação">
            <FaTimes aria-hidden="true" />
          </button>
        </header>
        <p className="mt-5 text-center text-sm font-medium text-zinc-700">Como você avalia o serviço realizado?</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {[0, 1, 2, 3, 4, 5].map((nota) => (
            <button
              key={nota}
              type="button"
              disabled={isSubmitting}
              onClick={() => onGrade(nota)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[#183c36] text-base font-bold text-white transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label={`Avaliar com nota ${nota}`}
            >
              {nota}
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  )
}
