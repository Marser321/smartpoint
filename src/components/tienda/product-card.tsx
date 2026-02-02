'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingBag, ArrowRight, Heart } from 'lucide-react'
import { useCart } from '@/context/cart-context'
import { formatPriceUYU } from '@/lib/utils'
import type { Producto } from '@/types/ecommerce'

interface ProductCardProps {
    producto: Producto
    priority?: boolean
    index?: number
}

export default function ProductCard({ producto, priority = false, index = 0 }: ProductCardProps) {
    const { addItem } = useCart()

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        addItem(producto)
    }

    return (
        <Link href={`/tienda/${producto.id}`} className="group">
            <motion.div
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="
                    relative h-full flex flex-col
                    bg-white/[0.02] backdrop-blur-md
                    border border-white/5 rounded-3xl
                    overflow-hidden
                    hover:border-[var(--sp-red)]/30 hover:shadow-[0_10px_40px_rgba(0,0,0,0.4)]
                    hover:shadow-[var(--sp-red)]/10
                    transition-all duration-300
                "
            >
                {/* Image Container with "Studio Light" Background */}
                <div className="relative aspect-square p-6 overflow-hidden bg-gradient-to-br from-white/5 via-transparent to-black/20">

                    {/* Radial Glow for product highlighting */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative w-full h-full transform group-hover:scale-110 transition-transform duration-500 ease-out">
                        {producto.imagen_url ? (
                            <Image
                                src={producto.imagen_url}
                                alt={producto.nombre}
                                fill
                                className="object-contain drop-shadow-2xl"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                priority={priority}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/10 group-hover:text-[var(--sp-red)]/50 transition-colors">
                                <ShoppingBag className="w-16 h-16" />
                            </div>
                        )}
                    </div>

                    {/* Quick Add Button - Floating */}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleAddToCart}
                        className="
                            absolute bottom-4 right-4 z-20
                            w-10 h-10 rounded-full
                            bg-white/10 backdrop-blur-md border border-white/20
                            flex items-center justify-center
                            text-white
                            opacity-0 translate-y-4
                            group-hover:opacity-100 group-hover:translate-y-0
                            hover:bg-[var(--sp-red)] hover:border-[var(--sp-red)]
                            transition-all duration-300
                            shadow-lg
                        "
                    >
                        <ShoppingBag className="w-4 h-4" />
                    </motion.button>

                    {/* Badge Stock */}
                    {producto.stock_actual <= producto.stock_critico && producto.stock_actual > 0 && (
                        <span className="absolute top-4 left-4 px-2 py-1 rounded-md bg-orange-500/80 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider">
                            Últimos
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold tracking-widest text-[var(--sp-red)] uppercase bg-[var(--sp-red)]/10 px-2 py-1 rounded-full">
                            {producto.marca}
                        </span>

                        {/* Wishlist placeholder (visual only for now) */}
                        <Heart className="w-4 h-4 text-white/20 hover:text-red-400 transition-colors cursor-pointer" />
                    </div>

                    <h3 className="font-semibold text-white/90 text-lg leading-tight mb-2 line-clamp-2 min-h-[3rem]">
                        {producto.nombre}
                    </h3>

                    <div className="mt-auto pt-4 border-t border-white/5 flex items-end justify-between">
                        <div className="flex flex-col">
                            <span className="text-xs text-white/40">Precio contado</span>
                            <span className="text-xl font-bold text-white">
                                {formatPriceUYU(producto.precio_venta)}
                            </span>
                        </div>
                        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/30 group-hover:bg-white group-hover:text-black transition-all">
                            <ArrowRight className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    )
}
