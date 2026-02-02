'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingCart, Plus, X, ArrowRight, Sparkles } from 'lucide-react'
import { useCart } from '@/context/cart-context'
import { formatPriceUYU } from '@/lib/utils'
import type { Producto } from '@/types/ecommerce'

interface CrossSellProps {
    currentProductId?: string
    currentCategory?: string
    trigger: 'cart' | 'checkout' | 'product'
}

// Productos sugeridos de demo (en producción: consulta a Supabase)
const suggestedProducts: Producto[] = [
    {
        id: 'cs-1',
        sku: 'CABLE-LTN-2M',
        nombre: 'Cable Lightning Premium 2m',
        precio_venta: 590,
        precio_costo: 300,
        tipo: 'cable',
        marca: 'Premium',
        stock_actual: 50,
        stock_critico: 5,
        es_repuesto: false,
        es_venta: true,
        activo: true,
        imagen_url: '/products/cable.jpg'
    },
    {
        id: 'cs-2',
        sku: 'CARG-20W-C',
        nombre: 'Cargador Rápido 20W USB-C',
        precio_venta: 890,
        precio_costo: 450,
        tipo: 'cargador',
        marca: 'Premium',
        stock_actual: 30,
        stock_critico: 3,
        es_repuesto: false,
        es_venta: true,
        activo: true,
        imagen_url: '/products/charger.jpg'
    },
    {
        id: 'cs-3',
        sku: 'VID-9H-UNI',
        nombre: 'Vidrio Templado 9H',
        precio_venta: 450,
        precio_costo: 150,
        tipo: 'protector',
        marca: 'Premium',
        stock_actual: 100,
        stock_critico: 10,
        es_repuesto: false,
        es_venta: true,
        activo: true,
        imagen_url: '/products/glass.jpg'
    },
    {
        id: 'cs-4',
        sku: 'POP-MAG-01',
        nombre: 'PopSocket Magnético',
        precio_venta: 350,
        precio_costo: 120,
        tipo: 'accesorio',
        marca: 'Premium',
        stock_actual: 40,
        stock_critico: 5,
        es_repuesto: false,
        es_venta: true,
        activo: true,
        imagen_url: '/products/popsocket.jpg'
    },
]

export default function CrossSell({ currentProductId, currentCategory, trigger }: CrossSellProps) {
    const [products, setProducts] = useState<Producto[]>([])
    const [isVisible, setIsVisible] = useState(true)
    const { addItem, items } = useCart()

    useEffect(() => {
        // Filtrar productos que no están en el carrito y son diferentes al actual
        const cartIds = items.map(i => i.producto.id)
        const filtered = suggestedProducts
            .filter(p => p.id !== currentProductId && !cartIds.includes(p.id))
            .slice(0, 3)
        setProducts(filtered)
    }, [currentProductId, items])

    const handleAddToCart = (product: Producto) => {
        addItem(product, 1)
    }

    if (products.length === 0 || !isVisible) return null

    const titles: Record<typeof trigger, string> = {
        cart: '¿Necesitás algo más?',
        checkout: 'Últimas sugerencias',
        product: 'Combina con',
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-5 border-[var(--buddha-gold-30)]"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[var(--buddha-gold)]" />
                    <h3 className="font-semibold text-white">{titles[trigger]}</h3>
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="p-1 rounded-lg hover:bg-white/5 text-[var(--text-muted)]"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-3">
                {products.map(product => (
                    <div
                        key={product.id}
                        className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                    >
                        <div className="w-14 h-14 rounded-lg bg-[var(--cod-gray)] flex items-center justify-center overflow-hidden flex-shrink-0">
                            {product.imagen_url ? (
                                <Image
                                    src={product.imagen_url}
                                    alt={product.nombre}
                                    width={56}
                                    height={56}
                                    className="object-cover"
                                />
                            ) : (
                                <ShoppingCart className="w-6 h-6 text-[var(--text-muted)]" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">{product.nombre}</p>
                            <p className="text-[var(--buddha-gold)] text-sm font-bold">
                                {formatPriceUYU(product.precio_venta)}
                            </p>
                        </div>
                        <button
                            onClick={() => handleAddToCart(product)}
                            className="w-9 h-9 rounded-lg bg-[var(--buddha-gold-10)] hover:bg-[var(--buddha-gold)] text-[var(--buddha-gold)] hover:text-[var(--cod-gray)] flex items-center justify-center transition-colors flex-shrink-0"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>

            <Link
                href="/tienda"
                className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--buddha-gold)] transition-colors"
            >
                Ver más productos
                <ArrowRight className="w-4 h-4" />
            </Link>
        </motion.div>
    )
}
