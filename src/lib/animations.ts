/**
 * Presets de animación para Framer Motion
 * Siguiendo el skill luxury_apple_aesthetic
 */

export const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] }
}

export const fadeInDown = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] }
}

export const scaleIn = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] }
}

export const slideInLeft = {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] }
}

export const slideInRight = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] }
}

export const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
}

export const staggerItem = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
}

export const glowPulse = {
    animate: {
        boxShadow: [
            '0 0 20px rgba(196, 176, 1, 0.2)',
            '0 0 40px rgba(196, 176, 1, 0.4)',
            '0 0 20px rgba(196, 176, 1, 0.2)'
        ],
        transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
    }
}

export const floatAnimation = {
    animate: {
        y: [0, -10, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
        }
    }
}

// Helper para delay simple
export const delay = (duration: number) => ({
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: { delay: duration, duration: 0.5 }
    }
})

// Transición suave Apple-style
export const easeOutExpo = [0.23, 1, 0.32, 1]

// Viewport para IntersectionObserver
export const viewportOnce = {
    once: true,
    margin: '-100px'
}
