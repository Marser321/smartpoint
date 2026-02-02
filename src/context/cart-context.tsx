'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Producto, CartItem } from '@/types/ecommerce'

interface CartContextType {
    items: CartItem[]
    addItem: (producto: Producto, cantidad?: number) => void
    removeItem: (productoId: string) => void
    updateQuantity: (productoId: string, cantidad: number) => void
    clearCart: () => void
    itemCount: number
    subtotal: number
    isOpen: boolean
    openCart: () => void
    closeCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'smartpoint_cart'

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [isHydrated, setIsHydrated] = useState(false)

    // Cargar carrito desde localStorage al montar
    useEffect(() => {
        const stored = localStorage.getItem(CART_STORAGE_KEY)
        if (stored) {
            try {
                setItems(JSON.parse(stored))
            } catch {
                localStorage.removeItem(CART_STORAGE_KEY)
            }
        }
        setIsHydrated(true)
    }, [])

    // Guardar carrito en localStorage cuando cambia
    useEffect(() => {
        if (isHydrated) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
        }
    }, [items, isHydrated])

    const addItem = (producto: Producto, cantidad = 1) => {
        setItems(prev => {
            const existing = prev.find(item => item.producto.id === producto.id)
            if (existing) {
                return prev.map(item =>
                    item.producto.id === producto.id
                        ? { ...item, cantidad: item.cantidad + cantidad }
                        : item
                )
            }
            return [...prev, { producto, cantidad }]
        })
        setIsOpen(true)
    }

    const removeItem = (productoId: string) => {
        setItems(prev => prev.filter(item => item.producto.id !== productoId))
    }

    const updateQuantity = (productoId: string, cantidad: number) => {
        if (cantidad <= 0) {
            removeItem(productoId)
            return
        }
        setItems(prev =>
            prev.map(item =>
                item.producto.id === productoId
                    ? { ...item, cantidad }
                    : item
            )
        )
    }

    const clearCart = () => {
        setItems([])
        setIsOpen(false)
    }

    const itemCount = items.reduce((sum, item) => sum + item.cantidad, 0)

    const subtotal = items.reduce(
        (sum, item) => sum + item.producto.precio_venta * item.cantidad,
        0
    )

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                itemCount,
                subtotal,
                isOpen,
                openCart: () => setIsOpen(true),
                closeCart: () => setIsOpen(false),
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart debe usarse dentro de CartProvider')
    }
    return context
}
