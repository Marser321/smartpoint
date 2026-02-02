'use client'

import { useState, useRef } from 'react'
import { Camera, X, Upload, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface PhotoUploaderProps {
    maxPhotos?: number
    photos: string[]
    onPhotosChange: (photos: string[]) => void
}

export default function PhotoUploader({ maxPhotos = 4, photos, onPhotosChange }: PhotoUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isCapturing, setIsCapturing] = useState(false)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        const newPhotos: string[] = []

        for (let i = 0; i < files.length && photos.length + newPhotos.length < maxPhotos; i++) {
            const file = files[i]
            if (!file.type.startsWith('image/')) continue

            // Convertir a base64
            const reader = new FileReader()
            await new Promise<void>((resolve) => {
                reader.onload = () => {
                    if (typeof reader.result === 'string') {
                        newPhotos.push(reader.result)
                    }
                    resolve()
                }
                reader.readAsDataURL(file)
            })
        }

        onPhotosChange([...photos, ...newPhotos])

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const removePhoto = (index: number) => {
        const newPhotos = photos.filter((_, i) => i !== index)
        onPhotosChange(newPhotos)
    }

    const canAddMore = photos.length < maxPhotos

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Camera className="w-5 h-5 text-[var(--buddha-gold)]" />
                    <span className="font-medium text-white">Fotos del Equipo</span>
                </div>
                <span className="text-sm text-[var(--text-muted)]">
                    {photos.length}/{maxPhotos}
                </span>
            </div>

            {/* Grid de fotos */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {photos.map((photo, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-[var(--cod-gray)]">
                        <Image
                            src={photo}
                            alt={`Foto ${idx + 1}`}
                            fill
                            className="object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => removePhoto(idx)}
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[var(--error)] text-white flex items-center justify-center hover:scale-110 transition-transform"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}

                {/* Botón agregar */}
                {canAddMore && (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-xl border-2 border-dashed border-white/10 hover:border-[var(--buddha-gold-30)] flex flex-col items-center justify-center gap-2 transition-colors"
                    >
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                            <Upload className="w-5 h-5 text-[var(--text-muted)]" />
                        </div>
                        <span className="text-xs text-[var(--text-muted)]">Agregar</span>
                    </button>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
            />

            <p className="text-xs text-[var(--text-muted)]">
                Foto del equipo al momento de recepción/entrega para registro.
            </p>
        </div>
    )
}
