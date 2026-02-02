'use client'

import { motion } from 'framer-motion'

interface ProductSkeletonProps {
    count?: number
}

function SingleSkeleton({ index }: { index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-2xl bg-white/[0.03] border border-white/[0.08] overflow-hidden"
        >
            {/* Image skeleton */}
            <div className="aspect-square bg-gradient-to-br from-white/[0.05] to-white/[0.02] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent animate-shimmer" />
            </div>

            {/* Content skeleton */}
            <div className="p-4 space-y-3">
                {/* Category badge */}
                <div className="h-4 w-16 rounded-full bg-white/[0.08]" />

                {/* Title */}
                <div className="space-y-2">
                    <div className="h-4 w-full rounded bg-white/[0.08]" />
                    <div className="h-4 w-2/3 rounded bg-white/[0.06]" />
                </div>

                {/* Price */}
                <div className="h-6 w-24 rounded bg-white/[0.08] mt-4" />
            </div>
        </motion.div>
    )
}

export default function ProductSkeleton({ count = 6 }: ProductSkeletonProps) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <SingleSkeleton key={i} index={i} />
            ))}
        </>
    )
}
