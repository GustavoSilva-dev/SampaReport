import { useEffect, useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { FaCamera, FaMapMarkerAlt, FaTimes } from 'react-icons/fa'
import type { CategoriaReport, CreateReportDTO } from '../../types'

interface CreateReportModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const categories: { value: CategoriaReport; label: string }[] = [
  { value: 'ASFALTO', label: 'Rua / Asfalto / Buracos' },
  { value: 'ILUMINACAO', label: 'Iluminação Pública' },
  { value: 'LIXO_ENTULHO', label: 'Lixo / Descarte Irregular' },
  { value: 'DRENAGEM_ALAGAMENTO', label: 'Boca de Lobo / Alagamento' },
  { value: 'SINALIZACAO', label: 'Placa / Semáforo' },
  { value: 'OUTROS', label: 'Outros Problemas Urbanos' },
]

const initialForm = {
  titulo: '',
  descricao: '',
  categoria: '' as CategoriaReport | '',
  endereco: '',
}

export function CreateReportModal({ isOpen, onClose, onSuccess }: CreateReportModalProps) {
  const [form, setForm] = useState(initialForm)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  if (!isOpen) return null

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
    setError('')
  }

  function selectFile(file: File | undefined) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Selecione um arquivo de imagem válido.')
      return
    }

    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current)
      return URL.createObjectURL(file)
    })
    setSelectedFile(file)
    setError('')
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    selectFile(event.target.files?.[0])
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragging(false)
    selectFile(event.dataTransfer.files[0])
  }

  function removeFile() {
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current)
      return ''
    })
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function useCurrentLocation() {
    updateField('endereco', 'Av. Paulista, 1100 - Bela Vista, São Paulo')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const missingField = !selectedFile
      ? 'imagem'
      : !form.titulo.trim()
        ? 'título'
        : !form.categoria
          ? 'categoria'
          : !form.endereco.trim()
            ? 'endereço'
            : !form.descricao.trim()
              ? 'descrição'
              : ''

    if (missingField) {
      setError(`Preencha o campo ${missingField} para continuar.`)
      return
    }

    setIsSubmitting(true)
    const payload: CreateReportDTO = {
      titulo: form.titulo.trim(),
      descricao: form.descricao.trim(),
      categoria: form.categoria as CategoriaReport,
      endereco: form.endereco.trim(),
      imagemUrl: `https://res.cloudinary.com/sampareport/mock/${encodeURIComponent(selectedFile.name)}`,
    }

    // Futuro POST: fetch('/api/reports', { method: 'POST', body: JSON.stringify(payload) })
    void payload
    await new Promise((resolve) => setTimeout(resolve, 600))
    setIsSubmitting(false)
    setForm(initialForm)
    removeFile()
    onSuccess?.()
    onClose()
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[1100] flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-report-modal-title"
    >
      <div className="reveal-up my-auto w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <header className="flex items-start justify-between border-b border-zinc-100 px-5 py-5 sm:px-6">
          <div>
            <h2 id="create-report-modal-title" className="text-xl font-bold text-[#183c36]">Registrar Nova Ocorrência</h2>
            <p className="mt-1 text-xs text-zinc-500">Relate um problema urbano para validação da comunidade de São Paulo</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700" aria-label="Fechar formulário">
            <FaTimes aria-hidden="true" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4 p-5 sm:p-6">
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(event) => { event.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`relative cursor-pointer overflow-hidden rounded-xl border-2 border-dashed p-5 text-center transition-colors ${isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-emerald-300 bg-emerald-50/30 hover:border-emerald-500'}`}
          >
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
            {previewUrl ? (
              <>
                <img src={previewUrl} alt="Pré-visualização da ocorrência" className="h-40 w-full rounded-lg object-cover" />
                <button type="button" onClick={(event) => { event.stopPropagation(); removeFile() }} className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-zinc-600 shadow hover:text-red-600" aria-label="Remover imagem">
                  <FaTimes aria-hidden="true" />
                </button>
                <p className="mt-2 text-xs text-emerald-700">Clique ou arraste para trocar a foto</p>
              </>
            ) : (
              <>
                <FaCamera className="mx-auto text-2xl text-emerald-600" aria-hidden="true" />
                <p className="mt-2 text-sm font-medium text-zinc-700">Adicione uma foto do problema</p>
                <p className="mt-1 text-xs text-zinc-500">Arraste uma imagem ou clique para selecionar</p>
              </>
            )}
          </div>

          <div>
            <label htmlFor="report-title" className="mb-1.5 block text-xs font-medium text-zinc-700">Título da ocorrência</label>
            <input id="report-title" value={form.titulo} onChange={(event) => updateField('titulo', event.target.value)} placeholder="Ex: Buraco profundo na faixa de pedestres" className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 text-sm text-zinc-900 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500" />
          </div>

          <div>
            <label htmlFor="report-category" className="mb-1.5 block text-xs font-medium text-zinc-700">Categoria da ocorrência</label>
            <select id="report-category" value={form.categoria} onChange={(event) => updateField('categoria', event.target.value)} className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 text-sm text-zinc-900 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500">
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="report-address" className="mb-1.5 block text-xs font-medium text-zinc-700">Endereço e localização</label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input id="report-address" value={form.endereco} onChange={(event) => updateField('endereco', event.target.value)} placeholder="Ex: Av. Paulista, 1100 - Bela Vista" className="min-w-0 flex-1 rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 text-sm text-zinc-900 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500" />
              <button type="button" onClick={useCurrentLocation} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200 px-3 py-2 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-50">
                <FaMapMarkerAlt aria-hidden="true" /> Usar minha localização
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="report-description" className="mb-1.5 block text-xs font-medium text-zinc-700">Descrição detalhada</label>
            <textarea id="report-description" value={form.descricao} onChange={(event) => updateField('descricao', event.target.value)} rows={4} placeholder="Descreva os detalhes do problema, riscos aos pedestres/veículos ou pontos de referência..." className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 text-sm text-zinc-900 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500" />
          </div>

          {error && <p className="text-xs font-medium text-red-600" role="alert">{error}</p>}
          <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70">
            {isSubmitting ? 'Enviando report...' : 'Registrar ocorrência'}
          </button>
        </form>
      </div>
    </div>,
    document.body,
  )
}
