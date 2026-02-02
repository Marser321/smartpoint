'use client'

import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { useCart } from '@/context/cart-context'
import { formatPriceUYU } from '@/lib/utils'

interface WhatsAppVIPButtonProps {
    phoneNumber?: string
    className?: string
}

export default function WhatsAppVIPButton({
    phoneNumber = '59899123456', // Número del dueño
    className = ''
}: WhatsAppVIPButtonProps) {
    const { items, subtotal, itemCount } = useCart()

    // Solo mostrar si hay items en el carrito
    if (itemCount === 0) return null

    const generateWhatsAppMessage = () => {
        const itemsText = items.map((item, i) =>
            `${i + 1}. ${item.producto.nombre} x${item.cantidad} - ${formatPriceUYU(item.producto.precio_venta * item.cantidad)}`
        ).join('\n')

        const message = `🛒 *PEDIDO VIP - Smart Point*

Hola! Me interesa hacer un pedido:

${itemsText}

💰 *Total:* ${formatPriceUYU(subtotal)}

¿Podemos coordinar el pago y envío?`

        return encodeURIComponent(message)
    }

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${generateWhatsAppMessage()}`

    return (
        <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`
                fixed bottom-6 right-6 z-50
                flex items-center gap-3
                px-5 py-4 rounded-2xl
                bg-gradient-to-r from-green-600 to-green-500
                text-white font-semibold
                shadow-[0_8px_30px_rgba(34,197,94,0.4)]
                hover:shadow-[0_12px_40px_rgba(34,197,94,0.5)]
                transition-all duration-300
                ${className}
            `}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {/* Pulse Effect */}
            <motion.span
                className="absolute inset-0 rounded-2xl bg-green-400/30"
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0, 0.5],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            {/* Icon */}
            <div className="relative">
                <MessageCircle className="w-6 h-6" />
                {/* Badge con cantidad */}
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white text-green-600 text-xs font-bold flex items-center justify-center shadow-lg">
                    {itemCount}
                </span>
            </div>

            {/* Label */}
            <div className="relative hidden sm:block">
                <span className="text-sm opacity-80">Cerrar venta por</span>
                <span className="block text-lg font-bold tracking-wide">WhatsApp VIP</span>
            </div>

            {/* Mobile Label */}
            <span className="relative sm:hidden text-base font-bold">
                WhatsApp
            </span>
        </motion.a>
    )
}
