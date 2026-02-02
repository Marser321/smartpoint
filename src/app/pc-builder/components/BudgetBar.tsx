'use client'

import { motion } from 'framer-motion'
import { DollarSign, Gift } from 'lucide-react'

interface BudgetBarProps {
    total: number
}

// Umbrales en UYU
const THRESHOLDS = [
    { value: 30000, label: 'Entrada' },
    { value: 60000, label: 'Gaming' },
    { value: 100000, label: 'Pro' },
    { value: 150000, label: 'Tope' },
]

export default function BudgetBar({ total }: BudgetBarProps) {
    const maxBudget = 200000 // Máximo visual
    const percentage = Math.min((total / maxBudget) * 100, 100)

    const hasBonus = total > 80000 // $2000 USD aprox

    return (
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium text-white">Presupuesto</span>
                </div>
                <div className="flex items-center gap-2">
                    {hasBonus && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="px-2 py-0.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 text-white text-[10px] font-bold flex items-center gap-1"
                        >
                            <Gift className="w-3 h-3" />
                            BONIFICADO
                        </motion.span>
                    )}
                    <span className="text-lg font-bold text-white">
                        ${total.toLocaleString()}
                    </span>
                </div>
            </div>

            <div className="relative h-4 bg-white/5 rounded-full overflow-hidden">
                {/* Marcadores de threshold */}
                {THRESHOLDS.map(t => (
                    <div
                        key={t.value}
                        className="absolute top-0 bottom-0 w-px bg-white/20"
                        style={{ left: `${(t.value / maxBudget) * 100}%` }}
                    />
                ))}

                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full relative"
                >
                    <div className="absolute inset-0 bg-white/10" />
                </motion.div>
            </div>

            <div className="flex justify-between mt-2 text-[10px] text-white/40">
                {THRESHOLDS.map(t => (
                    <span key={t.value} className={total >= t.value ? 'text-green-400' : ''}>
                        {t.label}
                    </span>
                ))}
            </div>
        </div>
    )
}
