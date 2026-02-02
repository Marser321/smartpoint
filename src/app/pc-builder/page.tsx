'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/layout/header'
import { BuildProvider, useBuild } from './context/BuildContext'
import HotspotBuilder from './components/HotspotBuilder'
import PowerMeter from './components/PowerMeter'
import BudgetBar from './components/BudgetBar'
import CompatibilityAlert from './components/CompatibilityAlert'
import { Cpu, Share2, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'

function PCBuilderContent() {
    const {
        totalPrice,
        powerLevel,
        totalPower,
        compatibilityErrors,
        clearBuild
    } = useBuild()

    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

    // Toast de oferta si > $2000 USD (aprox $80000 UYU)
    useEffect(() => {
        if (totalPrice > 80000) {
            toast.success('🎁 ¡Envío gratis + Armado Premium bonificado!', {
                description: 'Tu build supera los $80.000 UYU',
                duration: 5000,
            })
        }
    }, [totalPrice])

    return (
        <div className="min-h-screen bg-[#0A0A0A]">
            <Header />

            {/* Main con padding-top ajustado según demo mode */}
            <main className={`pb-12 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto ${isDemoMode ? 'pt-40' : 'pt-32'}`}>
                {/* Header del Builder */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3"
                        >
                            <Cpu className="w-8 h-8 text-[#C4B001]" />
                            PC Studio
                        </motion.h1>
                        <p className="text-white/50 mt-1">Configurador Interactivo • Hacé clic en los hotspots</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={clearBuild}
                            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 font-medium flex items-center gap-2 transition-all border border-white/5"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reiniciar
                        </button>

                        <button
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C4B001] to-[#A49801] text-black font-semibold flex items-center gap-2 shadow-[0_4px_20px_rgba(196,176,1,0.3)] hover:shadow-[0_8px_30px_rgba(196,176,1,0.4)] transition-all"
                        >
                            <Share2 className="w-4 h-4" />
                            Compartir Build
                        </button>
                    </div>
                </div>

                {/* Alertas de Compatibilidad */}
                {compatibilityErrors.length > 0 && (
                    <div className="mb-6 space-y-2">
                        {compatibilityErrors.map((error, i) => (
                            <CompatibilityAlert key={i} error={error} />
                        ))}
                    </div>
                )}

                {/* HOTSPOT BUILDER - El nuevo canvas interactivo */}
                <HotspotBuilder />

                {/* Barras de Métricas debajo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <PowerMeter level={powerLevel} watts={totalPower} />
                    <BudgetBar total={totalPrice} />
                </div>
            </main>
        </div>
    )
}

export default function PCBuilderPage() {
    return (
        <BuildProvider>
            <PCBuilderContent />
        </BuildProvider>
    )
}
