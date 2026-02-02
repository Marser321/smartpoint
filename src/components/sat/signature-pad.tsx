'use client'

import { useRef, useState } from 'react'
import { Pen, Trash2, Check } from 'lucide-react'

interface SignaturePadProps {
    onSave: (dataUrl: string) => void
    onClear?: () => void
}

export default function SignaturePad({ onSave, onClear }: SignaturePadProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [hasSignature, setHasSignature] = useState(false)

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } => {
        const canvas = canvasRef.current
        if (!canvas) return { x: 0, y: 0 }

        const rect = canvas.getBoundingClientRect()

        if ('touches' in e) {
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top,
            }
        }
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        }
    }

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (!ctx || !canvas) return

        setIsDrawing(true)
        setHasSignature(true)

        const { x, y } = getCoordinates(e)
        ctx.beginPath()
        ctx.moveTo(x, y)
    }

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return

        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (!ctx) return

        const { x, y } = getCoordinates(e)
        ctx.lineTo(x, y)
        ctx.strokeStyle = '#C4B001'
        ctx.lineWidth = 3
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.stroke()
    }

    const stopDrawing = () => {
        setIsDrawing(false)
    }

    const clearCanvas = () => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (!ctx || !canvas) return

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        setHasSignature(false)
        onClear?.()
    }

    const saveSignature = () => {
        const canvas = canvasRef.current
        if (!canvas || !hasSignature) return

        const dataUrl = canvas.toDataURL('image/png')
        onSave(dataUrl)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Pen className="w-5 h-5 text-[var(--buddha-gold)]" />
                    <span className="font-medium text-white">Firma del Cliente</span>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={clearCanvas}
                        className="p-2 rounded-lg hover:bg-white/5 text-[var(--text-muted)] hover:text-[var(--error)]"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                    <button
                        type="button"
                        onClick={saveSignature}
                        disabled={!hasSignature}
                        className="p-2 rounded-lg bg-[var(--buddha-gold-10)] text-[var(--buddha-gold)] disabled:opacity-50"
                    >
                        <Check className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[var(--cod-gray)]">
                <canvas
                    ref={canvasRef}
                    width={400}
                    height={200}
                    className="w-full touch-none cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                />
                {!hasSignature && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <p className="text-[var(--text-muted)] text-sm">Firmá aquí</p>
                    </div>
                )}
            </div>
            <p className="text-xs text-[var(--text-muted)]">
                Al firmar, el cliente acepta los términos de servicio y entrega del equipo.
            </p>
        </div>
    )
}
