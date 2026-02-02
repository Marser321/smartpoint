import { clsx, type ClassValue } from "clsx"

export function cn(...inputs: ClassValue[]) {
    return clsx(inputs)
}

/**
 * Formatea un precio en pesos uruguayos
 */
export function formatPriceUYU(amount: number): string {
    return new Intl.NumberFormat('es-UY', {
        style: 'currency',
        currency: 'UYU',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

/**
 * Formatea una fecha en español
 */
export function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat('es-UY', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(d)
}
