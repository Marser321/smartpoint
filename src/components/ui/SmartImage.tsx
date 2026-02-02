'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ImageOff } from 'lucide-react'

interface SmartImageProps {
    src: string | undefined | null
    alt: string
    width?: number
    height?: number
    fill?: boolean
    className?: string
    priority?: boolean
}

/**
 * Componente de imagen con fallback elegante estilo SmartPoint.
 * Si la imagen falla en cargar, muestra un placeholder con logo sutil.
 */
export default function SmartImage({
    src,
    alt,
    width,
    height,
    fill,
    className = '',
    priority = false
}: SmartImageProps) {
    const [hasError, setHasError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Si no hay src o hay error, mostrar fallback
    if (!src || hasError) {
        return (
            <div
                className={`flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 ${className}`}
                style={fill ? { position: 'absolute', inset: 0 } : { width, height }}
            >
                <div className="flex flex-col items-center gap-2 text-white/20">
                    <ImageOff className="w-8 h-8" />
                    <span className="text-[10px] font-medium">SmartPoint</span>
                </div>
            </div>
        )
    }

    return (
        <div className={`relative ${fill ? 'absolute inset-0' : ''}`} style={!fill ? { width, height } : undefined}>
            {isLoading && (
                <div
                    className={`absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 animate-pulse ${className}`}
                />
            )}
            <Image
                src={src}
                alt={alt}
                width={fill ? undefined : width}
                height={fill ? undefined : height}
                fill={fill}
                className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                priority={priority}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setHasError(true)
                    setIsLoading(false)
                }}
                unoptimized={src?.startsWith('http')}
            />
        </div>
    )
}
