'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
    Plus, Search, Edit, Trash2, Package,
    AlertTriangle, Check, MoreVertical,
    Smartphone, Zap, Shield
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatPriceUYU } from '@/lib/utils'
import type { Producto } from '@/types/ecommerce'

// Tipo para la tabla
type ProductRow = Producto

export default function AdminProductsPage() {
    const [products, setProducts] = useState<ProductRow[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    // Fetch inicial
    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('inventario')
            .select('*')
            .order('created_at', { ascending: false })

        if (data) {
            setProducts(data as ProductRow[])
        }
        setLoading(false)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return

        const supabase = createClient()
        const { error } = await supabase
            .from('inventario')
            .delete()
            .eq('id', id)

        if (!error) {
            setProducts(products.filter(p => p.id !== id))
        } else {
            alert('Error al eliminar: ' + error.message)
        }
    }

    const filteredProducts = products.filter(p =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Productos</h1>
                    <p className="text-white/50 mt-1">Gestión de inventario y tienda</p>
                </div>
                <Link
                    href="/admin/productos/nuevo"
                    className="
                        inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                        bg-[var(--sp-red)] text-white font-medium
                        hover:bg-[var(--sp-red-light)] transition-colors
                        shadow-lg shadow-red-900/20
                    "
                >
                    <Plus className="w-5 h-5" />
                    Nuevo Producto
                </Link>
            </div>

            {/* Filters & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div className="lg:col-span-2 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="
                            w-full pl-10 pr-4 py-3 rounded-xl
                            bg-white/5 border border-white/10
                            text-white placeholder:text-white/30
                            focus:outline-none focus:border-[var(--sp-red)]/50
                            transition-colors
                        "
                    />
                </div>

                {/* Quick Stats */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <Package className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-white/50">Total Productos</p>
                        <p className="text-lg font-bold text-white">{products.length}</p>
                    </div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-white/50">Stock Bajo</p>
                        <p className="text-lg font-bold text-white">
                            {products.filter(p => p.stock_actual <= p.stock_critico).length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 text-sm text-white/50 bg-white/[0.02]">
                                <th className="p-4 font-medium">Producto</th>
                                <th className="p-4 font-medium">Categoría</th>
                                <th className="p-4 font-medium text-center">Stock</th>
                                <th className="p-4 font-medium text-right">Precio</th>
                                <th className="p-4 font-medium text-center">Estado</th>
                                <th className="p-4 font-medium text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-white/50">
                                            Cargando inventario...
                                        </td>
                                    </tr>
                                ) : filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-white/50">
                                            No se encontraron productos
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <motion.tr
                                            key={product.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-white/[0.02] transition-colors group"
                                        >
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 overflow-hidden flex-shrink-0 relative">
                                                        {/* Placeholder simple si no hay img */}
                                                        {product.imagen_url ? (
                                                            <img src={product.imagen_url} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-white/20">
                                                                <Package className="w-5 h-5" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-white line-clamp-1 max-w-[200px]">{product.nombre}</p>
                                                        <p className="text-xs text-white/40 font-mono">{product.sku}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-white/70 capitalize">
                                                {product.tipo}
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className={`
                                                    inline-block px-2 py-1 rounded text-xs font-bold
                                                    ${product.stock_actual === 0 ? 'bg-red-500/20 text-red-400' :
                                                        product.stock_actual <= product.stock_critico ? 'bg-orange-500/20 text-orange-400' :
                                                            'bg-green-500/20 text-green-400'}
                                                `}>
                                                    {product.stock_actual}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right font-medium text-white/90">
                                                {formatPriceUYU(product.precio_venta)}
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className={`
                                                    inline-flex justify-center items-center w-6 h-6 rounded-full
                                                    ${product.activo ? 'bg-green-500/10 text-green-400' : 'bg-white/10 text-white/30'}
                                                `}>
                                                    {product.activo ? <Check className="w-3 h-3" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link
                                                        href={`/admin/productos/${product.id}`}
                                                        className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/70 hover:text-red-400 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
