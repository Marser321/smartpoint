'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

// Apple easing curve
const appleEasing: [number, number, number, number] = [0.23, 1, 0.32, 1]

const pageVariants = {
    initial: {
        opacity: 0,
        y: 8,
    },
    in: {
        opacity: 1,
        y: 0,
    },
    out: {
        opacity: 0,
        y: -8,
    },
}

const pageTransition = {
    type: 'tween' as const,
    ease: appleEasing,
    duration: 0.35,
}

interface PageTransitionProps {
    children: React.ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname()

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={pathname}
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    )
}
