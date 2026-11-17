import { useRef, useState, type ChangeEvent, type DragEvent, type MouseEvent } from 'react'
import { FaCamera, FaTimes } from 'react-icons/fa'
import { uploadImageToCloudinary } from '../services/cloudinaryUploadService'

interface ImageUploadProps {
    onUpload?: (imageUrl: string) => void
    onRemove?: () => void
}

export function ImageUpload({ onUpload, onRemove }: ImageUploadProps) {
    const [imageUrl, setImageUrl] = useState('')
    const [isDragging, setIsDragging] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)

    async function uploadFile(file: File | undefined) {
        if (!file) return

        if (!file.type.startsWith('image/')) {
            setError('Selecione um arquivo de imagem válido.')
            return
        }

        setError('')
        setIsLoading(true)

        try {
            const uploadedImageUrl = await uploadImageToCloudinary(file)
            setImageUrl(uploadedImageUrl)
            onUpload?.(uploadedImageUrl)
        } catch (uploadError) {
            setError(uploadError instanceof Error ? uploadError.message : 'Erro ao enviar imagem.')
        } finally {
            setIsLoading(false)
        }
    }

    function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        uploadFile(event.target.files?.[0]);
    }

    function handleDrop(event: DragEvent<HTMLDivElement>) {
        event.preventDefault()
        setIsDragging(false)
        uploadFile(event.dataTransfer.files[0]);
    }

    function removeImage(event: MouseEvent<HTMLButtonElement>) {
        event.stopPropagation()
        setImageUrl('')
        setError('')
        onRemove?.()

        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(event) => {
                event.preventDefault()
                setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`relative cursor-pointer overflow-hidden rounded-xl border-2 border-dashed p-5 text-center transition-colors ${isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-emerald-300 bg-emerald-50/30 hover:border-emerald-500'}`}
        >
            <input ref={fileInputRef} className="sr-only" type="file" accept="image/*" onChange={handleFileChange} />
            {isLoading && <p className="text-sm text-emerald-700">Enviando imagem...</p>}
            {!isLoading && imageUrl && (
                <>
                    <img src={imageUrl} alt="Pré-visualização da ocorrência" className="h-40 w-full rounded-lg object-cover" />
                    <button type="button" onClick={removeImage} className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-zinc-600 shadow hover:text-red-600" aria-label="Remover imagem">
                        <FaTimes aria-hidden="true" />
                    </button>
                    <p className="mt-2 text-xs text-emerald-700">Clique ou arraste para trocar a foto</p>
                </>
            )}
            {!isLoading && !imageUrl && (
                <>
                    <FaCamera className="mx-auto text-2xl text-emerald-600" aria-hidden="true" />
                    <p className="mt-2 text-sm font-medium text-zinc-700">Adicione uma foto do problema</p>
                    <p className="mt-1 text-xs text-zinc-500">Arraste uma imagem ou clique para selecionar</p>
                </>
            )}
            {error && <p className="mt-2 text-xs text-red-600" role="alert">{error}</p>}
        </div>
    )
}
