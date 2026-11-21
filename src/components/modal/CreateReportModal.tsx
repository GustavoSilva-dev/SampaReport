import { useEffect, useRef, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { ImageUpload } from '../ImageUpload'
import { FaMapMarkerAlt, FaTimes } from 'react-icons/fa'
import type { ReportRequestDTO, ReportType } from '../../types'
import { createReport, updateReport, getCachedReports } from '../../services/reportService'
import {
  getAddressFromCoordinates,
  getCoordinatesFromAddress,
  searchLocations,
  type LocationSuggestion,
} from '../../services/mapsService'

interface CreateReportModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  mode?: 'create' | 'edit'
  reportId?: number
  initialData?: {
    titulo: string
    descricao: string
    categoria: string
    endereco: string
    fotoAntesUrl: string
  }
}

const categories: { value: ReportType; label: string }[] = [
  { value: 'ASFALTO_BURACOS', label: 'Asfalto & Buracos' },
  { value: 'ILUMINACAO_PUBLICA', label: 'Iluminação Pública' },
  { value: 'SINALIZACAO_TRANSITO', label: 'Sinalização de Trânsito' },
  { value: 'LIXO_ENTULHO', label: 'Lixo & Entulho' },
  { value: 'ESGOTO_ALAGAMENTO', label: 'Esgoto & Alagamento' },
  { value: 'MOBILIDADE_CALCADAS', label: 'Mobilidade & Calçadas' },
]

const initialForm = {
  titulo: '',
  descricao: '',
  categoria: '' as ReportType | '',
  endereco: '',
}

export function CreateReportModal({
  isOpen,
  onClose,
  onSuccess,
  mode = 'create',
  reportId,
  initialData,
}: CreateReportModalProps) {
  const [form, setForm] = useState(initialForm)
  const [imageUrl, setImageUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([])
  const [isSearchingLocation, setIsSearchingLocation] = useState(false)
  const locationSearchTimeout = useRef<number | null>(null)

  useEffect(() => {
    if (!isOpen || mode !== 'edit' || !initialData) return

    const categoryByLabel: Record<string, ReportType> = {
      'Asfalto / Buracos': 'ASFALTO_BURACOS',
      'Iluminação Pública': 'ILUMINACAO_PUBLICA',
      'Sinalização de Trânsito': 'SINALIZACAO_TRANSITO',
      'Lixo / Entulho': 'LIXO_ENTULHO',
      'Esgoto / Alagamento': 'ESGOTO_ALAGAMENTO',
      'Mobilidade / Calçadas': 'MOBILIDADE_CALCADAS',
    }
    const reportFromCache = reportId
      ? getCachedReports().find((report) => report.id === reportId)
      : undefined

    setForm({
      titulo: initialData.titulo,
      descricao: initialData.descricao,
      categoria: categoryByLabel[initialData.categoria] ?? (initialData.categoria as ReportType),
      endereco: initialData.endereco,
    })
    setImageUrl(initialData.fotoAntesUrl)
    setLatitude(reportFromCache?.latitude ?? null)
    setLongitude(reportFromCache?.longitude ?? null)
  }, [isOpen, mode, reportId, initialData])

  if (!isOpen) return null

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
    if (field === 'endereco') {
      setLatitude(null)
      setLongitude(null)
      setLocationSuggestions([])

      if (locationSearchTimeout.current !== null) {
        window.clearTimeout(locationSearchTimeout.current)
      }

      if (value.trim().length >= 3) {
        setIsSearchingLocation(true)
        locationSearchTimeout.current = window.setTimeout(() => {
          void searchLocations(value)
            .then((suggestions) => setLocationSuggestions(suggestions))
            .catch(() => setLocationSuggestions([]))
            .finally(() => setIsSearchingLocation(false))
        }, 450)
      } else {
        setIsSearchingLocation(false)
      }
    }
    setError('')
  }

  function handleImageUpload(uploadedImageUrl: string) {
    setImageUrl(uploadedImageUrl)
    setError('')
  }

  function removeImage() {
    setImageUrl('')
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setError('Geolocalização não é suportada neste navegador.')
      return
    }

    setIsLocating(true)
    setError('')
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lon } = position.coords
        setLatitude(lat)
        setLongitude(lon)

        try {
          const address = await getAddressFromCoordinates(lat, lon)
          setForm((current) => ({ ...current, endereco: address }))
          setLocationSuggestions([])
          setError('')
        } catch (locationError) {
          setError(locationError instanceof Error ? locationError.message : '')
        } finally {
          setIsLocating(false)
        }
      },
      (locationError) => {
        setIsLocating(false)
        setError(locationError.code === locationError.PERMISSION_DENIED
          ? 'Permita o uso da localização para preencher o endereço.'
          : 'Não foi possível obter sua localização.')
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  async function confirmAddress() {
    const address = form.endereco.trim()
    if (!address) return

    try {
      setIsLocating(true)
      const coordinates = await getCoordinatesFromAddress(address)
      if (!coordinates) {
        setError('Endereço não encontrado. Revise o texto e tente novamente.')
        return
      }

      setLatitude(coordinates.latitude)
      setLongitude(coordinates.longitude)
      setError('')
    } catch (locationError) {
      setError(locationError instanceof Error ? locationError.message : 'Não foi possível localizar o endereço.')
    } finally {
      setIsLocating(false)
    }
  }

  function selectLocation(suggestion: LocationSuggestion) {
    setForm((current) => ({ ...current, endereco: suggestion.displayName }))
    setLatitude(suggestion.latitude)
    setLongitude(suggestion.longitude)
    setLocationSuggestions([])
    setError('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const loggedUser = JSON.parse(localStorage.getItem('logged-user') || '{}') as { id?: number }
    if (!loggedUser.id) {
      setError('Faça login para registrar uma ocorrência.')
      return
    }

    const missingField = !imageUrl
      ? 'imagem'
      : !form.titulo.trim()
        ? 'título'
        : !form.categoria
          ? 'categoria'
          : !form.endereco.trim()
            ? 'endereço'
            : latitude === null || longitude === null
              ? 'localização válida'
            : !form.descricao.trim()
              ? 'descrição'
              : ''

    if (missingField) {
      setError(`Preencha o campo ${missingField} para continuar.`)
      return
    }

    if (latitude === null || longitude === null) {
      setError('Preencha o campo localização válida para continuar.')
      return
    }

    setIsSubmitting(true)
    const payload: ReportRequestDTO = {
      titulo: form.titulo.trim(),
      descricao: form.descricao.trim(),
      categoria: form.categoria as ReportType,
      latitude,
      longitude,
      fotoAntesUrl: imageUrl,
      usuarioId: loggedUser.id,
    }

    try {
      if (mode === 'edit' && reportId) {
        await updateReport(reportId, payload)
      } else {
        await createReport(payload)
      }
      setForm(initialForm)
      setLatitude(null)
      setLongitude(null)
      removeImage()
      onSuccess?.()
      onClose()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Não foi possível registrar a ocorrência.')
    } finally {
      setIsSubmitting(false)
    }
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
            <h2 id="create-report-modal-title" className="text-xl font-bold text-[#183c36]">
              {mode === 'edit' ? 'Edição de Report' : 'Registrar Nova Ocorrência'}
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              {mode === 'edit'
                ? 'Atualize os dados da ocorrência registrada'
                : 'Relate um problema urbano para validação da comunidade de São Paulo'}
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700" aria-label="Fechar formulário">
            <FaTimes aria-hidden="true" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4 p-5 sm:p-6">
          <ImageUpload onUpload={handleImageUpload} onRemove={removeImage} />

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
            <div className="relative flex flex-col gap-2 sm:flex-row">
              <div className="relative min-w-0 flex-1">
                <input
                  id="report-address"
                  value={form.endereco}
                  onChange={(event) => updateField('endereco', event.target.value)}
                  onBlur={() => void confirmAddress()}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      void confirmAddress()
                    }
                  }}
                  placeholder="Ex: Av. Paulista, 1100 - Bela Vista"
                  autoComplete="off"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 text-sm text-zinc-900 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
                {(isSearchingLocation || locationSuggestions.length > 0) && (
                  <div className="absolute z-[1200] mt-1 max-h-52 w-full overflow-y-auto rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
                    {isSearchingLocation && (
                      <p className="px-3 py-2 text-xs text-zinc-500">Pesquisando ruas...</p>
                    )}
                    {!isSearchingLocation && locationSuggestions.map((suggestion) => (
                      <button
                        key={`${suggestion.latitude}-${suggestion.longitude}-${suggestion.displayName}`}
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => selectLocation(suggestion)}
                        className="w-full px-3 py-2 text-left text-xs text-zinc-700 hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        {suggestion.displayName}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button type="button" onClick={useCurrentLocation} disabled={isLocating} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200 px-3 py-2 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-70">
                <FaMapMarkerAlt aria-hidden="true" /> {isLocating ? 'Localizando...' : 'Usar minha localização'}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="report-description" className="mb-1.5 block text-xs font-medium text-zinc-700">Descrição detalhada</label>
            <textarea id="report-description" value={form.descricao} onChange={(event) => updateField('descricao', event.target.value)} rows={4} placeholder="Descreva os detalhes do problema, riscos aos pedestres/veículos ou pontos de referência..." className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 text-sm text-zinc-900 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500" />
          </div>

          {error && <p className="text-xs font-medium text-red-600" role="alert">{error}</p>}
          <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70">
            {isSubmitting
              ? (mode === 'edit' ? 'Salvando alterações...' : 'Enviando report...')
              : (mode === 'edit' ? 'Salvar alterações' : 'Registrar ocorrência')}
          </button>
        </form>
      </div>
    </div>,
    document.body,
  )
}
