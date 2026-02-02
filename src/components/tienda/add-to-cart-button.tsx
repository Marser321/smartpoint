'use client'

import { useState } from 'react'
import { ShoppingBag, Minus, Plus, Check } from 'lucide-react'
import { useCart } from '@/context/cart-context'
import type { Producto } from '@/types/ecommerce'

interface Props {
    producto: Producto
}

export default function AddToCartButton({ producto }: Props) {
    const { addItem } = useCart()
    const [quantity, setQuantity] = useState(1)
    const [added, setAdded] = useState(false)

    const handleAdd = () => {
        addItem(producto, quantity)
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    const isOutOfStock = producto.stock_actual === 0

    return (
        <div className="space-y-4">
            {/* Quantity Selector */}
            {!isOutOfStock && (
                <div className="flex items-center gap-4">
                    <span className="text-[var(--text-muted)]">Cantidad:</span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            disabled={quantity <= 1}
                            className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors disabled:opacity-50"
                        >
                            <Minus className="w-4 h-4 text-white" />
                        </button>
                        <span className="w-12 text-center text-white font-medium text-lg">
                            {quantity}
                        </span>
                        <button
                            onClick={() => setQuantity(q => Math.min(producto.stock_actual, q + 1))}
                            disabled={quantity >= producto.stock_actual}
                            className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors disabled:opacity-50"
                        >
                            <Plus className="w-4 h-4 text-white" />
                        </button>
                    </div>
                </div>
            )}

            {/* Add Button */}
            <button
                onClick={handleAdd}
                disabled={isOutOfStock || added}
                className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 ${isOutOfStock
                        ? 'bg-white/5 text-[var(--text-muted)] cursor-not-allowed'
                        : added
                            ? 'bg-[var(--success)] text-white'
                            : 'btn-premium'
                    }`}
            >
                {isOutOfStock ? (
                    <>
                        <ShoppingBag className="w-5 h-5" />
                        Sin Stock
                    </>
                ) : added ? (
                    <>
                        <Check className="w-5 h-5" />
                        ¡Agregado al Carrito!
                    </>
                ) : (
                    <>
                        <ShoppingBag className="w-5 h-5" />
                        Agregar al Carrito
                    </>
                )}
            </button>

            {/* Stock indicator */}
            {!isOutOfStock && producto.stock_actual <= producto.stock_critico && (
                <p className="text-center text-sm text-[var(--warning)]">
                    Stock limitado - Solo quedan {producto.stock_actual}
                </p>
            )}
        </div>
    )
}
