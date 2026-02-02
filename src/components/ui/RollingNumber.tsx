'use client'

import { useEffect, useState, useRef } from 'react'

interface RollingNumberProps {
    value: number
    prefix?: string
    suffix?: string
    className?: string
    duration?: number
}

/**
 * Componente de número con animación de conteo (rolling numbers).
 * Refuerza la sensación de "construcción de valor".
 */
export default function RollingNumber({
    value,
    prefix = '',
    suffix = '',
    className = '',
    duration = 500
}: RollingNumberProps) {
    const [displayValue, setDisplayValue] = useState(value)
    const previousValue = useRef(value)
    const animationRef = useRef<number | null>(null)

    useEffect(() => {
        const startValue = previousValue.current
        const endValue = value
        const difference = endValue - startValue
        const startTime = performance.now()

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)

            // Easing function (ease-out cubic)
            const eased = 1 - Math.pow(1 - progress, 3)

            const currentValue = Math.round(startValue + difference * eased)
            setDisplayValue(currentValue)

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate)
            } else {
                previousValue.current = endValue
            }
        }

        animationRef.current = requestAnimationFrame(animate)

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [value, duration])

    return (
        <span className={`tabular-nums ${className}`}>
            {prefix}{displayValue.toLocaleString()}{suffix}
        </span>
    )
}
