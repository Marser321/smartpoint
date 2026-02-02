'use client'

import { CartProvider } from '@/context/cart-context'
import CartDrawer from '@/components/tienda/cart-drawer'
import WhatsAppVIPButton from '@/components/tienda/whatsapp-vip-button'
import { ReactNode } from 'react'

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <CartProvider>
            {children}
            <CartDrawer />
            <WhatsAppVIPButton phoneNumber="59899123456" />
        </CartProvider>
    )
}
