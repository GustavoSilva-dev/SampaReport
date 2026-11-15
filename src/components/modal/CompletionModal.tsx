import { useState, type ChangeEvent, type FormEvent } from 'react'
import { FaCamera, FaTimes } from 'react-icons/fa'
import type { AdminReport } from '../../types'

interface CompletionModalProps {
  report: AdminReport
  onClose: () => void
  onComplete: (reportId: number) => void
}

export function CompletionModal({ report, onClose, onComplete }: CompletionModalProps) {
  const [photoName, setPhotoName] = useState('')
  const [justification, setJustification] = useState('')

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    setPhotoName(event.target.files?.[0]?.name ?? '')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!photoName || !justification.trim()) return
    onComplete(report.id)
  }

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="completion-title">
      <div className="reveal-up w-full max-w-md rounded-2xl bg-white p-5 shadow-xl sm:p-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h2 id="completion-title" className="text-lg font-bold text-[#183c36]">Concluir Serviço</h2>
            <p className="mt-1 text-xs text-zinc-500">Envie a comprovação do atendimento realizado.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700" aria-label="Fechar">
            <FaTimes aria-hidden="true" />
          </button>
        </header>
        <p className="mt-4 text-sm font-medium text-zinc-800">{report.titulo}</p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 p-4 text-sm text-emerald-800 hover:border-emerald-500">
            <FaCamera aria-hidden="true" />
            <span>{photoName || 'Selecionar foto do serviço concluído'}</span>
            <input type="file" accept="image/*" onChange={handlePhotoChange} className="sr-only" />
          </label>
          <textarea
            value={justification}
            onChange={(event) => setJustification(event.target.value)}
            rows={4}
            placeholder="Descreva o serviço realizado..."
            className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 text-sm outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500"
          />
          <button type="submit" className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-600">
            Enviar comprovação
          </button>
        </form>
      </div>
    </div>
  )
}
