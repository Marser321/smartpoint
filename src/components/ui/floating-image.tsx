'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface FloatingImageProps {
    src: string
    alt: string
    className?: string
    depth?: number
    delay?: number
}

export default function FloatingImage({
    src,
    alt,
    className,
    depth = 1,
    delay = 0
}: FloatingImageProps) {
    return (
        <motion.div
            className={cn("absolute pointer-events-none select-none z-0", className)}
            initial={{ opacity: 0, y: 20 }}
            animate={{
                opacity: 1,
                y: [0, -15 * depth, 0],
                rotate: [0, 2 * depth, -2 * depth, 0]
            }}
            transition={{
                opacity: { duration: 0.8, delay },
                y: {
                    duration: 4 + depth,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatType: "reverse"
                },
                rotate: {
                    duration: 6 + depth,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatType: "reverse"
                }
            }}
        >
            <div className={`
                relative rounded-3xl overflow-hidden
                shadow-[0_20px_50px_rgba(0,0,0,0.3)]
                border border-white/10
                backdrop-blur-sm
            `}>
                {/* Glass reflection overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent z-10" />

                <Image
                    src={src}
                    alt={alt}
                    width={300}
                    height={300}
                    className="object-cover w-full h-full transform transition-transform hover:scale-105 duration-700"
                />
            </div>
        </motion.div>
    )
}
