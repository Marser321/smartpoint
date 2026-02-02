'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
    ShoppingBag, ArrowLeft, Truck, Shield,
    Check, Star, Share2, Heart, AlertCircle
} from 'lucide-react'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import { useCart } from '@/context/cart-context'
import { createClient } from '@/lib/supabase/client'
import { formatPriceUYU } from '@/lib/utils'
import type { Producto } from '@/types/ecommerce'
import { DEMO_PRODUCTS } from '@/lib/demo-data'
import ProductCard from '@/components/tienda/product-card'

export default function ProductDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { addItem } = useCart()
    const [product, setProduct] = useState<Producto | null>(null)
    const [recommended, setRecommended] = useState<Producto[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [isAdded, setIsAdded] = useState(false)

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true)
            const supabase = createClient()

            // 1. Intentar buscar en DB
            const { data, error } = await supabase
                .from('inventario')
                .select('*')
                .eq('id', params.id)
                .single()

            let currentProduct: Producto | null = null

            if (data && !error) {
                currentProduct = data as Producto
            } else {
                // 2. Fallback a DEMO_PRODUCTS
                console.log('Producto no encontrado en DB, buscando en demo data')
                const demo = DEMO_PRODUCTS.find(p => p.id === params.id)
                if (demo) {
                    currentProduct = demo
                }
            }

            setProduct(currentProduct || null)
            setLoading(false)

            // 3. Buscar recomendados (misma categoría, excluyendo actual)
            if (currentProduct) {
                // Primero intentar DB
                const { data: recData } = await supabase
                    .from('inventario')
                    .select('*')
                    .eq('tipo', currentProduct.tipo)
                    .neq('id', currentProduct.id)
                    .limit(4)

                let recs = recData ? recData as Producto[] : []

                // Si no hay suficientes en DB, rellenar con DEMO
                if (recs.length < 4) {
                    const demoRecs = DEMO_PRODUCTS.filter(p =>
                        p.tipo === currentProduct?.tipo &&
                        p.id !== currentProduct.id &&
                        !recs.find(r => r.id === p.id)
                    ).slice(0, 4 - recs.length)
                    recs = [...recs, ...demoRecs]
                }

                setRecommended(recs)
            }
        }

        fetchProduct()
    }, [params.id])

    const handleAddToCart = () => {
        if (!product) return
        addItem(product)
        setIsAdded(true)
        setTimeout(() => setIsAdded(false), 2000)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--cod-gray)] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--sp-red)]"></div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[var(--cod-gray)] flex flex-col items-center justify-center text-white">
                <h2 className="text-2xl font-bold mb-4">Producto no encontrado</h2>
                <Link href="/tienda" className="text-[var(--sp-red)] hover:underline">
                    Volver a la tienda
                </Link>
            </div>
        )
    }

    // Generar array de imágenes (principal + adicionales)
    const allImages = [product.imagen_url, ...(product.imagenes_adicionales || [])].filter(Boolean)
    // Si no hay imágenes, usar placeholder
    if (allImages.length === 0) allImages.push('/placeholder-product.png')

    return (
        <>
            <Header />
            <main className="min-h-screen pt-28 pb-16 bg-[var(--cod-gray)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Breadcrumb & Back */}
                    <div className="flex items-center gap-4 mb-8 text-sm">
                        <Link
                            href="/tienda"
                            className="flex items-center gap-2 text-[var(--text-muted)] hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Volver a la tienda
                        </Link>
                        <span className="text-[var(--text-muted)]">/</span>
                        <span className="text-[var(--text-muted)] capitalize">{product.tipo}</span>
                        <span className="text-[var(--text-muted)]">/</span>
                        <span className="text-white truncate max-w-[200px]">{product.nombre}</span>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
                        {/* Gallery Section */}
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative aspect-square rounded-3xl overflow-hidden bg-white/[0.02] border border-white/10"
                            >
                                {allImages[selectedImage] ? (
                                    <Image
                                        src={allImages[selectedImage] || '/placeholder-product.png'}
                                        alt={product.nombre}
                                        fill
                                        className="object-cover object-center"
                                        priority
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">
                                        <ShoppingBag className="w-16 h-16 opacity-20" />
                                    </div>
                                )}

                                {/* Badge Stock */}
                                {product.stock_actual <= product.stock_critico && product.stock_actual > 0 && (
                                    <div className="absolute top-4 left-4 px-3 py-1 bg-orange-500/90 backdrop-blur text-white text-xs font-bold rounded-full uppercase tracking-wide">
                                        ¡Últimas unidades!
                                    </div>
                                )}
                                {product.stock_actual === 0 && (
                                    <div className="absolute top-4 left-4 px-3 py-1 bg-red-500/90 backdrop-blur text-white text-xs font-bold rounded-full uppercase tracking-wide">
                                        Agotado
                                    </div>
                                )}
                            </motion.div>

                            {/* Thumbnails */}
                            {allImages.length > 1 && (
                                <div className="flex gap-4 overflow-x-auto pb-2">
                                    {allImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(idx)}
                                            className={`
                                                relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0
                                                border-2 transition-all
                                                ${selectedImage === idx
                                                    ? 'border-[var(--sp-red)]'
                                                    : 'border-transparent hover:border-white/20'
                                                }
                                            `}
                                        >
                                            <Image
                                                src={img || '/placeholder-product.png'}
                                                alt={`Vista ${idx + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col"
                        >
                            <div className="mb-2 flex items-center gap-2">
                                <span className="text-[var(--sp-red)] font-medium text-sm tracking-wide uppercase">
                                    {product.marca}
                                </span>
                                {product.stock_actual > 0 ? (
                                    <span className="flex items-center gap-1 text-green-400 text-xs font-medium px-2 py-0.5 bg-green-500/10 rounded-full">
                                        <Check className="w-3 h-3" /> En Stock
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-red-400 text-xs font-medium px-2 py-0.5 bg-red-500/10 rounded-full">
                                        <AlertCircle className="w-3 h-3" /> Sin Stock
                                    </span>
                                )}
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                                {product.nombre}
                            </h1>

                            <div className="flex items-end gap-3 mb-6">
                                <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                                    {formatPriceUYU(product.precio_venta)}
                                </span>
                                {product.precio_anterior && (
                                    <span className="text-[var(--text-muted)] mb-1.5 text-lg line-through">
                                        {formatPriceUYU(product.precio_anterior)}
                                    </span>
                                )}
                                <span className="text-[var(--text-muted)] mb-1.5 text-sm ml-auto sm:ml-0">
                                    IMP. INCLUIDOS
                                </span>
                            </div>

                            <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-8 border-b border-white/5 pb-8">
                                {product.descripcion}
                            </p>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock_actual === 0}
                                    className={`
                                        flex-1 py-4 px-8 rounded-xl font-bold text-lg flex items-center justify-center gap-2
                                        transition-all duration-300 transform active:scale-95
                                        ${isAdded
                                            ? 'bg-green-500 text-white'
                                            : product.stock_actual === 0
                                                ? 'bg-white/5 text-white/30 cursor-not-allowed'
                                                : 'bg-[var(--sp-red)] hover:bg-[var(--sp-red-light)] text-white shadow-[0_0_20px_rgba(196,30,58,0.3)] hover:shadow-[0_0_30px_rgba(196,30,58,0.5)]'
                                        }
                                    `}
                                >
                                    {isAdded ? (
                                        <>
                                            <Check className="w-6 h-6" />
                                            ¡Agregado!
                                        </>
                                    ) : product.stock_actual === 0 ? (
                                        'Agotado'
                                    ) : (
                                        <>
                                            <ShoppingBag className="w-6 h-6" />
                                            Agregar al Carrito
                                        </>
                                    )}
                                </button>

                                <button className="p-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
                                    <Heart className="w-6 h-6" />
                                </button>
                                <button className="p-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
                                    <Share2 className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Features */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                                    <Truck className="w-5 h-5 text-[var(--sp-red)] flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-white text-sm">Envío Gratis</h4>
                                        <p className="text-white/50 text-xs mt-0.5">En pedidos mayores a $3.000</p>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
                                    <Shield className="w-5 h-5 text-[var(--sp-red)] flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-white text-sm">Garantía Smart</h4>
                                        <p className="text-white/50 text-xs mt-0.5">30 días por defectos de fábrica</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Recommended Products */}
                    {recommended.length > 0 && (
                        <div className="pt-12 border-t border-white/10">
                            <h2 className="heading-2 mb-8">También te podría interesar</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {recommended.map((prod, idx) => (
                                    <ProductCard key={prod.id} producto={prod} index={idx} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    )
}
