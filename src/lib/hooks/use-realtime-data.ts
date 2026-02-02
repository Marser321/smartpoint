'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

interface UseRealtimeDataOptions<T> {
    table: string
    schema?: string
    select?: string
    filter?: {
        column: string
        value: string | number | boolean
    }
    orderBy?: {
        column: string
        ascending?: boolean
    }
    limit?: number
    enabled?: boolean
}

interface UseRealtimeDataReturn<T> {
    data: T[]
    isLoading: boolean
    error: Error | null
    refetch: () => Promise<void>
}

/**
 * Hook para datos en tiempo real con Supabase Realtime.
 * Escucha cambios INSERT, UPDATE y DELETE automáticamente.
 */
export function useRealtimeData<T = any>({
    table,
    schema = 'public',
    select = '*',
    filter,
    orderBy,
    limit,
    enabled = true
}: UseRealtimeDataOptions<T>): UseRealtimeDataReturn<T> {
    const [data, setData] = useState<T[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    const fetchData = useCallback(async () => {
        if (!enabled) return

        try {
            setIsLoading(true)
            setError(null)

            const supabase = createClient()
            let query = supabase.from(table).select(select)

            if (filter) {
                query = query.eq(filter.column, filter.value)
            }

            if (orderBy) {
                query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true })
            }

            if (limit) {
                query = query.limit(limit)
            }

            const { data: result, error: queryError } = await query

            if (queryError) throw queryError

            setData(result as T[])
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Error fetching data'))
        } finally {
            setIsLoading(false)
        }
    }, [table, select, filter?.column, filter?.value, orderBy?.column, orderBy?.ascending, limit, enabled])

    useEffect(() => {
        if (!enabled) return

        fetchData()

        // Configurar suscripción en tiempo real
        const supabase = createClient()
        const channel = supabase
            .channel(`${table}_changes`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema,
                    table
                },
                (payload: RealtimePostgresChangesPayload<any>) => {
                    // Refetch en cualquier cambio para mantener consistencia con filtros
                    fetchData()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [table, schema, enabled, fetchData])

    return {
        data,
        isLoading,
        error,
        refetch: fetchData
    }
}

/**
 * Hook para obtener un solo registro por ID
 */
export function useRealtimeRecord<T = any>(
    table: string,
    id: string | null,
    select = '*'
): {
    data: T | null
    isLoading: boolean
    error: Error | null
    refetch: () => Promise<void>
} {
    const [data, setData] = useState<T | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    const fetchData = useCallback(async () => {
        if (!id) {
            setData(null)
            setIsLoading(false)
            return
        }

        try {
            setIsLoading(true)
            setError(null)

            const supabase = createClient()
            const { data: result, error: queryError } = await supabase
                .from(table)
                .select(select)
                .eq('id', id)
                .single()

            if (queryError) throw queryError

            setData(result as T)
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Error fetching record'))
        } finally {
            setIsLoading(false)
        }
    }, [table, id, select])

    useEffect(() => {
        if (!id) return

        fetchData()

        // Suscripción a cambios de este registro específico
        const supabase = createClient()
        const channel = supabase
            .channel(`${table}_${id}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table,
                    filter: `id=eq.${id}`
                },
                () => fetchData()
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [table, id, fetchData])

    return {
        data,
        isLoading,
        error,
        refetch: fetchData
    }
}

/**
 * Hook para estadísticas en tiempo real
 */
export function useRealtimeStats(refreshInterval = 30000) {
    const [stats, setStats] = useState({
        ticketsPendientes: 0,
        ticketsEnProceso: 0,
        ticketsListos: 0,
        stockBajo: 0,
        ventasHoy: 0
    })
    const [isLoading, setIsLoading] = useState(true)

    const fetchStats = useCallback(async () => {
        try {
            const supabase = createClient()

            // Tickets
            const { data: tickets } = await supabase
                .from('tickets_reparacion')
                .select('estado')

            const ticketStats = {
                ticketsPendientes: tickets?.filter(t =>
                    t.estado === 'recepcion' || t.estado === 'diagnostico'
                ).length || 0,
                ticketsEnProceso: tickets?.filter(t =>
                    t.estado === 'en_mesa' || t.estado === 'espera_repuesto'
                ).length || 0,
                ticketsListos: tickets?.filter(t =>
                    t.estado === 'listo'
                ).length || 0,
            }

            // Inventario bajo stock
            const { count: lowStock } = await supabase
                .from('inventario')
                .select('id', { count: 'exact', head: true })
                .lte('stock_actual', 5)
                .eq('activo', true)

            // Ventas del día
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            const { data: ventas } = await supabase
                .from('ventas')
                .select('total')
                .gte('created_at', today.toISOString())

            const ventasHoy = ventas?.reduce((acc, v) => acc + (v.total || 0), 0) || 0

            setStats({
                ...ticketStats,
                stockBajo: lowStock || 0,
                ventasHoy
            })
        } catch (error) {
            console.error('Error fetching stats:', error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchStats()

        // Refrescar periódicamente
        const interval = setInterval(fetchStats, refreshInterval)

        // También suscribirse a cambios en tiempo real
        const supabase = createClient()
        const ticketsChannel = supabase
            .channel('stats_tickets')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets_reparacion' }, fetchStats)
            .subscribe()

        const ventasChannel = supabase
            .channel('stats_ventas')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'ventas' }, fetchStats)
            .subscribe()

        return () => {
            clearInterval(interval)
            supabase.removeChannel(ticketsChannel)
            supabase.removeChannel(ventasChannel)
        }
    }, [fetchStats, refreshInterval])

    return { stats, isLoading, refetch: fetchStats }
}
