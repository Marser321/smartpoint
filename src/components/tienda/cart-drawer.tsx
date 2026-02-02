'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/context/cart-context'
import { formatPriceUYU } from '@/lib/utils'

// Apple easing
const appleEasing: [number, number, number, number] = [0.23, 1, 0.32, 1]

export default function CartDrawer() {
    const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, itemCount } = useCart()

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200]"
                    />

                    {/* Drawer - Glassmorphism */}
                    <motion.div
                        initial={{ x: '100%', opacity: 0.8 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0.8 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300, ease: appleEasing }}
                        className="
                            fixed right-0 top-0 bottom-0 w-full max-w-md z-[200] 
                            flex flex-col
                            bg-[var(--cod-gray-light)]/95 backdrop-blur-2xl
                            border-l border-white/[0.08]
                            shadow-[-20px_0_60px_rgba(0,0,0,0.5)]
                        "
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[var(--sp-red)]/10 flex items-center justify-center">
                                    <ShoppingBag className="w-5 h-5 text-[var(--sp-red)]" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-white tracking-tight">
                                        Tu Carrito
                                    </h2>
                                    <p className="text-xs text-white/50">{itemCount} productos</p>
                                </div>
                            </div>
                            <motion.button
                                onClick={closeCart}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="
                                    p-2 rounded-xl 
                                    bg-white/5 backdrop-blur-xl
                                    border border-white/10
                                    hover:bg-white/10 
                                    transition-all duration-300
                                "
                            >
                                <X className="w-5 h-5 text-white" />
                            </motion.button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {items.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center py-16"
                                >
                                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                                        <ShoppingBag className="w-10 h-10 text-white/20" />
                                    </div>
                                    <p className="text-white/50 mb-4">Tu carrito está vacío</p>
                                    <motion.button
                                        onClick={closeCart}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="text-[var(--sp-red)] hover:underline font-medium"
                                    >
                                        Seguir comprando
                                    </motion.button>
                                </motion.div>
                            ) : (
                                <div className="space-y-4">
                                    {items.map((item, i) => (
                                        <motion.div
                                            key={item.producto.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ delay: i * 0.05, ease: appleEasing }}
                                            className="
                                                flex gap-4 p-4 rounded-xl 
                                                bg-white/[0.03] backdrop-blur-xl
                                                border border-white/[0.05]
                                                hover:bg-white/[0.05]
                                                transition-all duration-300
                                            "
                                        >
                                            {/* Image */}
                                            <div className="w-20 h-20 rounded-xl bg-[var(--cod-gray)] flex items-center justify-center overflow-hidden flex-shrink-0">
                                                {item.producto.imagen_url ? (
                                                    <Image
                                                        src={item.producto.imagen_url}
                                                        alt={item.producto.nombre}
                                                        width={80}
                                                        height={80}
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <ShoppingBag className="w-8 h-8 text-white/20" />
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-white font-medium truncate">
                                                    {item.producto.nombre}
                                                </h3>
                                                <p className="text-sm bg-gradient-to-r from-[var(--sp-red)] to-[var(--sp-red-light)] bg-clip-text text-transparent font-semibold mt-1">
                                                    {formatPriceUYU(item.producto.precio_venta)}
                                                </p>

                                                {/* Quantity */}
                                                <div className="flex items-center gap-2 mt-3">
                                                    <motion.button
                                                        onClick={() => updateQuantity(item.producto.id, item.cantidad - 1)}
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        className="
                                                            w-8 h-8 rounded-lg 
                                                            bg-white/5 border border-white/10
                                                            flex items-center justify-center 
                                                            hover:bg-white/10 
                                                            transition-colors duration-300
                                                        "
                                                    >
                                                        <Minus className="w-4 h-4 text-white" />
                                                    </motion.button>
                                                    <span className="w-8 text-center text-white font-medium">
                                                        {item.cantidad}
                                                    </span>
                                                    <motion.button
                                                        onClick={() => updateQuantity(item.producto.id, item.cantidad + 1)}
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        className="
                                                            w-8 h-8 rounded-lg 
                                                            bg-white/5 border border-white/10
                                                            flex items-center justify-center 
                                                            hover:bg-white/10 
                                                            transition-colors duration-300
                                                        "
                                                    >
                                                        <Plus className="w-4 h-4 text-white" />
                                                    </motion.button>
                                                    <motion.button
                                                        onClick={() => removeItem(item.producto.id)}
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        className="
                                                            ml-auto p-2 rounded-lg 
                                                            hover:bg-[var(--error)]/10 
                                                            transition-colors duration-300 group
                                                        "
                                                    >
                                                        <Trash2 className="w-4 h-4 text-white/40 group-hover:text-[var(--error)]" />
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-6 border-t border-white/5 space-y-4 bg-white/[0.02]"
                            >
                                <div className="flex justify-between items-center">
                                    <span className="text-white/60">Subtotal</span>
                                    <span className="text-xl font-bold text-white">{formatPriceUYU(subtotal)}</span>
                                </div>
                                <p className="text-xs text-white/40 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" />
                                    Envío calculado en el checkout
                                </p>
                                <motion.div
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Link
                                        href="/tienda/checkout"
                                        onClick={closeCart}
                                        className="
                                            flex items-center justify-center gap-2 w-full py-4
                                            bg-gradient-to-r from-[var(--sp-red)] to-[var(--sp-red-dark)]
                                            text-white font-semibold rounded-xl
                                            shadow-lg shadow-[var(--sp-red)]/20
                                            hover:shadow-[0_0_40px_var(--sp-red-30)]
                                            transition-all duration-300
                                        "
                                    >
                                        Finalizar Compra
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </motion.div>
                            </motion.div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
