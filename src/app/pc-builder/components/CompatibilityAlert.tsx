'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, AlertCircle, Zap, Cpu, Box } from 'lucide-react'
import { CompatibilityError } from '../context/BuildContext'

interface CompatibilityAlertProps {
    error: CompatibilityError
}

// Mapeo de tipos de error a iconos
const ERROR_ICONS: Record<string, React.ReactNode> = {
    socket: <Cpu className="w-5 h-5" />,
    power: <Zap className="w-5 h-5" />,
    dimensions: <Box className="w-5 h-5" />,
}

export default function CompatibilityAlert({ error }: CompatibilityAlertProps) {
    const isWarning = error.severity === 'warning'
    const errorType = error.type || 'default'
    const Icon = ERROR_ICONS[errorType] || (isWarning ? AlertTriangle : AlertCircle)

    return (
        <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95, x: 0 }}
            animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                // Vibración suave para errores críticos
                x: !isWarning ? [0, -3, 3, -2, 2, 0] : 0
            }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
                x: { duration: 0.4, delay: 0.2 }
            }}
            className={`
                relative p-4 rounded-2xl border backdrop-blur-md
                ${isWarning
                    ? 'bg-yellow-500/10 border-yellow-500/30'
                    : 'bg-red-500/10 border-red-500/40'
                }
            `}
            style={{
                // Glassmorphism estilo cristal
                boxShadow: isWarning
                    ? '0 8px 32px rgba(234, 179, 8, 0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
                    : '0 8px 32px rgba(239, 68, 68, 0.2), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 40px rgba(239, 68, 68, 0.15)'
            }}
        >
            <div className="flex items-start gap-3">
                <motion.div
                    animate={!isWarning ? {
                        scale: [1, 1.2, 1],
                        rotate: [0, -5, 5, 0]
                    } : {}}
                    transition={{ duration: 0.5, repeat: !isWarning ? Infinity : 0, repeatDelay: 2 }}
                    className={`flex-shrink-0 mt-0.5 ${isWarning ? 'text-yellow-400' : 'text-red-400'}`}
                >
                    {typeof Icon === 'object' ? Icon : (
                        isWarning
                            ? <AlertTriangle className="w-5 h-5" />
                            : <AlertCircle className="w-5 h-5" />
                    )}
                </motion.div>

                <div className="flex-1">
                    <p className={`text-sm font-semibold ${isWarning ? 'text-yellow-200' : 'text-red-200'}`}>
                        {isWarning ? '⚠️ Advertencia' : '🚫 Incompatibilidad Detectada'}
                    </p>
                    <p className={`text-sm mt-1 leading-relaxed ${isWarning ? 'text-yellow-200/80' : 'text-red-200/80'}`}>
                        {error.message}
                    </p>

                    {/* Sugerencia de solución */}
                    {!isWarning && (
                        <p className="text-xs mt-2 text-red-300/60 italic">
                            💡 Cambiá el componente para resolver el conflicto
                        </p>
                    )}
                </div>
            </div>

            {/* Efecto de neón pulsante para errores críticos */}
            {!isWarning && (
                <motion.div
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                        background: 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, transparent 50%)',
                        boxShadow: '0 0 60px rgba(239, 68, 68, 0.2)'
                    }}
                />
            )}
        </motion.div>
    )
}

