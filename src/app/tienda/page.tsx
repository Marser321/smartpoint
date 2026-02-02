import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import ProductCard from '@/components/tienda/product-card'
import { ShoppingBag, Filter, Search } from 'lucide-react'
import type { Producto } from '@/types/ecommerce'

export const metadata = {
    title: 'Tienda | Smart Point - Accesorios Premium',
    description: 'Fundas, cargadores, cables y accesorios premium para tu celular. Envíos a todo Maldonado.',
}

import { DEMO_PRODUCTS } from '@/lib/demo-data'




async function getProducts(category?: string): Promise<Producto[]> {
    try {
        const supabase = await createClient()

        let query = supabase
            .from('inventario')
            .select('*')
            .eq('es_venta', true)
            .eq('activo', true)
            .order('created_at', { ascending: false })

        if (category && category !== 'all') {
            if (category === 'hardware') {
                query = query.in('tipo', HARDWARE_TYPES)
            } else {
                query = query.eq('tipo', category)
            }
        }

        const { data, error } = await query

        if (error) throw error

        // Si no hay productos en DB, usar demo
        let products = data?.length ? data as Producto[] : DEMO_PRODUCTS

        // Filtrar demo data si es necesario (cuando falla DB o está vacía)
        if (!data?.length && category && category !== 'all') {
            if (category === 'hardware') {
                // Demo data no tiene tipos hardware mapeados aun, pero se intentar
                products = products.filter(p => HARDWARE_TYPES.includes(p.tipo))
            } else {
                products = products.filter(p => p.tipo === category)
            }
        }

        return products

    } catch (error) {
        console.error('Error fetching products (usando fallback demo):', error)
        // Fallback robusto para evitar pantalla de error 500
        let fallback = DEMO_PRODUCTS
        if (category && category !== 'all') {
            if (category === 'hardware') {
                // No filtrar demo por hardware si falla, para mostrar ALGO
            } else {
                fallback = fallback.filter(p => p.tipo === category)
            }
        }
        return fallback
    }
}

const CATEGORIES = [
    { id: 'all', label: 'Todos' },
    { id: 'funda', label: 'Fundas' },
    { id: 'vidrio', label: 'Vidrios' },
    { id: 'cargador', label: 'Cargadores' },
    { id: 'cable', label: 'Cables' },
    { id: 'auricular', label: 'Auriculares' },
    { id: 'accesorio', label: 'Accesorios' },
    { id: 'hardware', label: 'Hardware PC' },
]

const HARDWARE_TYPES = ['cpu', 'gpu', 'motherboard', 'ram', 'case', 'psu', 'storage', 'cooling', 'os', 'cables']

export default async function TiendaPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    // Await searchParams as per Next.js 15+ requirements if needed, or just access it.
    // In strict Next.js 15 types, searchParams is a Promise, but in typical usage it's often passed resolved.
    // However, sticking to safe access.
    const sp = await searchParams
    const category = typeof sp?.categoria === 'string' ? sp.categoria : 'all'

    const productos = await getProducts(category)

    return (
        <>
            <Header />
            <main className="min-h-screen pt-28 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 badge-premium mb-4">
                            <ShoppingBag className="w-4 h-4" />
                            Accesorios Premium
                        </div>
                        <h1 className="heading-1 mb-4">
                            Tienda{' '}
                            <span className="text-gradient-gold">Smart Point</span>
                        </h1>
                        <p className="body-large max-w-2xl mx-auto">
                            Los mejores accesorios para tu dispositivo.
                            Calidad garantizada y envíos a todo Maldonado.
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="glass-card p-4 mb-8">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                                <input
                                    type="text"
                                    placeholder="Buscar productos..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-2.5 text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--buddha-gold)]"
                                />
                            </div>

                            {/* Categories */}
                            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                                {CATEGORIES.map((cat) => {
                                    const isActive = category === cat.id || (category === '' && cat.id === 'all')
                                    return (
                                        <Link
                                            key={cat.id}
                                            href={cat.id === 'all' ? '/tienda' : `/tienda?categoria=${cat.id}`}
                                            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${isActive
                                                ? 'bg-[var(--buddha-gold-10)] text-[var(--buddha-gold)] border border-[var(--buddha-gold-30)]'
                                                : 'bg-white/5 text-[var(--text-secondary)] hover:bg-[var(--buddha-gold-10)] hover:text-[var(--buddha-gold)]'
                                                }`}
                                        >
                                            {cat.label}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    {productos.length === 0 ? (
                        <div className="glass-card p-12 text-center">
                            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-[var(--text-muted)] opacity-50" />
                            <h3 className="text-lg font-semibold text-white mb-2">
                                No se encontraron productos
                            </h3>
                            <p className="text-[var(--text-muted)]">
                                Intenta con otra categoría o término de búsqueda.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                            {productos.map((producto, index) => (
                                <ProductCard key={producto.id} producto={producto} index={index} />
                            ))}
                        </div>
                    )}

                    {/* Info Banner */}
                    <div className="mt-12 glass-card p-6 lg:p-8">
                        <div className="grid md:grid-cols-3 gap-6 text-center">
                            <div>
                                <p className="text-2xl font-bold text-[var(--buddha-gold)]">Envío Gratis</p>
                                <p className="text-sm text-[var(--text-muted)]">En compras +$3000</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[var(--buddha-gold)]">Retiro en Local</p>
                                <p className="text-sm text-[var(--text-muted)]">Maldonado centro</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[var(--buddha-gold)]">Garantía</p>
                                <p className="text-sm text-[var(--text-muted)]">30 días de cambio</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
