'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminSidebar from '@/components/admin/sidebar'
import {
    Users, Plus, Search, Edit2, Trash2, Phone, Mail,
    Ticket as TicketIcon
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Cliente {
    id: string
    nombre: string
    telefono: string
    email?: string
    direccion?: string
    created_at: string
    _count?: {
        tickets: number
    }
}

export default function ClientesPage() {
    const [clientes, setClientes] = useState<Cliente[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        loadClientes()
    }, [])

    const loadClientes = async () => {
        const supabase = createClient()
        const { data } = await supabase
            .from('clientes')
            .select('*')
            .order('nombre')

        setClientes(data || [])
        setLoading(false)
    }

    const filteredClientes = clientes.filter(c =>
        c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.telefono.includes(searchTerm) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-[var(--cod-gray)]">
            <AdminSidebar />
            <main className="lg:ml-72 pt-16 lg:pt-0">
                <div className="p-6 lg:p-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="heading-2 text-white mb-1">Clientes</h1>
                            <p className="text-[var(--text-muted)]">
                                {clientes.length} clientes registrados
                            </p>
                        </div>
                        <button className="btn-premium">
                            <Plus className="w-5 h-5" />
                            Nuevo Cliente
                        </button>
                    </div>

                    {/* Search */}
                    <div className="glass-card p-4 mb-6">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                placeholder="Buscar por nombre, teléfono o email..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-2.5 text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--buddha-gold)]"
                            />
                        </div>
                    </div>

                    {/* Grid */}
                    {loading ? (
                        <div className="glass-card p-12 text-center">
                            <div className="animate-spin w-8 h-8 border-2 border-[var(--buddha-gold)] border-t-transparent rounded-full mx-auto" />
                        </div>
                    ) : filteredClientes.length === 0 ? (
                        <div className="glass-card p-12 text-center">
                            <Users className="w-16 h-16 mx-auto mb-4 text-[var(--text-muted)] opacity-50" />
                            <h3 className="text-lg font-semibold text-white mb-2">Sin clientes</h3>
                            <p className="text-[var(--text-muted)]">
                                {searchTerm ? 'No hay resultados' : 'Los clientes aparecerán cuando soliciten reparaciones o compren'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredClientes.map(cliente => (
                                <div key={cliente.id} className="glass-card p-5 hover:border-[var(--buddha-gold-30)] transition-colors">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 rounded-full bg-[var(--buddha-gold-10)] flex items-center justify-center">
                                            <span className="text-[var(--buddha-gold)] font-bold text-lg">
                                                {cliente.nombre.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-2 rounded-lg hover:bg-white/5 text-[var(--text-muted)] hover:text-white">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className="text-white font-semibold mb-3">{cliente.nombre}</h3>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2 text-[var(--text-muted)]">
                                            <Phone className="w-4 h-4" />
                                            <a href={`tel:${cliente.telefono}`} className="hover:text-[var(--buddha-gold)]">
                                                {cliente.telefono}
                                            </a>
                                        </div>
                                        {cliente.email && (
                                            <div className="flex items-center gap-2 text-[var(--text-muted)]">
                                                <Mail className="w-4 h-4" />
                                                <a href={`mailto:${cliente.email}`} className="hover:text-[var(--buddha-gold)] truncate">
                                                    {cliente.email}
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-[var(--text-muted)]">
                                        <span>Cliente desde {formatDate(cliente.created_at)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
