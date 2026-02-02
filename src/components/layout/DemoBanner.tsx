'use client'

import Link from 'next/link'
import { Eye } from 'lucide-react'

export default function DemoBanner() {
    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

    if (!isDemoMode) return null

    return (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-yellow-600 via-yellow-500 to-amber-500 text-black py-2 px-4">
            <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-sm font-medium">
                <Eye className="w-4 h-4" />
                <span>Modo Demostración Activo - Vista de Propietario</span>
                <Link
                    href="/admin/dashboard"
                    className="ml-4 px-3 py-1 rounded-full bg-black/20 hover:bg-black/30 transition-colors text-xs font-bold"
                >
                    Ir al Panel Admin →
                </Link>
            </div>
        </div>
    )
}
