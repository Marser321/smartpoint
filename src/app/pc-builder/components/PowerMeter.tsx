'use client'

import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

interface PowerMeterProps {
    level: number // 0-100
    watts: number
}

export default function PowerMeter({ level, watts }: PowerMeterProps) {
    const getColor = () => {
        if (level < 30) return 'from-gray-500 to-gray-400'
        if (level < 60) return 'from-blue-500 to-cyan-400'
        if (level < 85) return 'from-purple-500 to-pink-400'
        return 'from-red-500 to-orange-400'
    }

    const getLabel = () => {
        if (level < 30) return 'Básico'
        if (level < 60) return 'Gaming'
        if (level < 85) return 'Entusiasta'
        return 'BESTIA'
    }

    return (
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium text-white">Nivel de Poder</span>
                </div>
                <span className="text-xs text-white/50">{watts}W estimado</span>
            </div>

            <div className="h-4 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${level}%` }}
                    transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                    className={`h-full bg-gradient-to-r ${getColor()} rounded-full relative`}
                >
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </motion.div>
            </div>

            <div className="flex justify-between mt-2">
                <span className="text-xs text-white/40">Básico</span>
                <span className={`text-xs font-bold ${level > 75 ? 'text-red-400' : 'text-white/60'}`}>
                    {getLabel()}
                </span>
                <span className="text-xs text-white/40">Bestia</span>
            </div>
        </div>
    )
}
