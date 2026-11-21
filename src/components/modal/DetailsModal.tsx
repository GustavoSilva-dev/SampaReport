import { FaMapMarkerAlt, FaTimes } from 'react-icons/fa'
import type { ReportResponseDTO } from '../../types'

interface DetailsModalProps {
  report: ReportResponseDTO
  address: string
  categoryLabel: string
  authorName: string
  onClose: () => void
}

export function DetailsModal({ report, address, categoryLabel, authorName, onClose }: DetailsModalProps) {
  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="details-title">
      <div className="reveal-up w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
        <img src={report.fotoAntesUrl} alt="" className="h-44 w-full object-cover" />
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-emerald-700">Código {report.id}</p>
              <h2 id="details-title" className="mt-1 text-lg font-bold text-[#183c36]">{report.titulo}</h2>
            </div>
            <button type="button" onClick={onClose} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700" aria-label="Fechar detalhes">
              <FaTimes aria-hidden="true" />
            </button>
          </div>
          <p className="mt-3 text-sm leading-6 text-zinc-600">{report.descricao}</p>
          <div className="mt-4 space-y-2 text-xs text-zinc-600">
            <p><FaMapMarkerAlt className="animate-ping h-2 mr-1 inline text-emerald-600" aria-hidden="true" />{address}</p>
            <p><strong>Categoria:</strong> {categoryLabel}</p>
            <p><strong>Autor:</strong> {authorName}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
