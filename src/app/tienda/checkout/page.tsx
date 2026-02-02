'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import { motion } from 'framer-motion'
import {
    ShoppingBag, Truck, Store, CreditCard,
    Loader2, CheckCircle, ArrowLeft, MapPin
} from 'lucide-react'
import { useCart } from '@/context/cart-context'
import { formatPriceUYU } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'

type ShippingMethod = 'retiro' | 'envio'
type PaymentMethod = 'mercadopago' | 'transferencia' | 'efectivo'

const SHIPPING_COST = 250 // UYU
const FREE_SHIPPING_MIN = 3000

export default function CheckoutPage() {
    const router = useRouter()
    const { items, subtotal, clearCart, itemCount } = useCart()
    const [step, setStep] = useState<'info' | 'payment' | 'success'>('info')
    const [isProcessing, setIsProcessing] = useState(false)
    const [orderNumber, setOrderNumber] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        shipping: 'retiro' as ShippingMethod,
        direccion: '',
        parada: '',
        referencia: '',
        payment: 'mercadopago' as PaymentMethod,
    })

    const shippingCost = formData.shipping === 'envio' && subtotal < FREE_SHIPPING_MIN
        ? SHIPPING_COST
        : 0
    const total = subtotal + shippingCost

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const canProceed = () => {
        if (!formData.nombre || !formData.telefono) return false
        if (formData.shipping === 'envio' && !formData.direccion) return false
        return true
    }

    const handleSubmit = async () => {
        setIsProcessing(true)

        try {
            // Simular procesamiento
            await new Promise(resolve => setTimeout(resolve, 2000))

            // En producción: crear venta en Supabase, procesar pago, etc.
            const fakeOrderNumber = `ORD-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`

            setOrderNumber(fakeOrderNumber)
            setStep('success')
            clearCart()
        } catch (error) {
            console.error('Error procesando orden:', error)
            alert('Hubo un error al procesar tu orden. Intentá de nuevo.')
        } finally {
            setIsProcessing(false)
        }
    }

    // Si no hay items, redirigir
    if (items.length === 0 && step !== 'success') {
        return (
            <>
                <Header />
                <main className="min-h-screen pt-28 pb-16">
                    <div className="max-w-2xl mx-auto px-4 text-center">
                        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-[var(--text-muted)] opacity-50" />
                        <h1 className="heading-2 text-white mb-4">Tu carrito está vacío</h1>
                        <p className="text-[var(--text-muted)] mb-8">
                            Agregá productos antes de ir al checkout.
                        </p>
                        <Link href="/tienda" className="btn-premium">
                            <ShoppingBag className="w-5 h-5" />
                            Ir a la Tienda
                        </Link>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    // Success
    if (step === 'success') {
        return (
            <>
                <Header />
                <main className="min-h-screen pt-28 pb-16">
                    <div className="max-w-2xl mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card-elevated p-8 text-center"
                        >
                            <div className="w-20 h-20 rounded-full bg-[var(--success-bg)] border border-[var(--success)]/30 flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-10 h-10 text-[var(--success)]" />
                            </div>
                            <h1 className="heading-2 text-white mb-2">¡Orden Confirmada!</h1>
                            <p className="body-large mb-6">
                                Tu número de orden es:
                            </p>
                            <div className="bg-[var(--cod-gray)] rounded-xl p-4 mb-6">
                                <p className="text-3xl font-bold text-gradient-gold font-mono">
                                    {orderNumber}
                                </p>
                            </div>
                            <p className="text-[var(--text-secondary)] mb-8">
                                Te enviamos un mensaje de WhatsApp con los detalles de tu orden
                                y las instrucciones de pago.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href={`https://wa.me/59899123456?text=Hola! Acabo de realizar la orden ${orderNumber}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-premium"
                                >
                                    Contactar por WhatsApp
                                </a>
                                <Link href="/tienda" className="btn-glass">
                                    Seguir Comprando
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Header />
            <main className="min-h-screen pt-28 pb-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back */}
                    <Link
                        href="/tienda"
                        className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-white mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver a la tienda
                    </Link>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Contact Info */}
                            <div className="glass-card p-6">
                                <h2 className="text-lg font-semibold text-white mb-6">Información de Contacto</h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="sm:col-span-2">
                                        <label className="label block mb-2">Nombre completo *</label>
                                        <input
                                            type="text"
                                            value={formData.nombre}
                                            onChange={e => updateField('nombre', e.target.value)}
                                            placeholder="Tu nombre"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--buddha-gold)]"
                                        />
                                    </div>
                                    <div>
                                        <label className="label block mb-2">WhatsApp *</label>
                                        <input
                                            type="tel"
                                            value={formData.telefono}
                                            onChange={e => updateField('telefono', e.target.value)}
                                            placeholder="099 123 456"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--buddha-gold)]"
                                        />
                                    </div>
                                    <div>
                                        <label className="label block mb-2">Email (opcional)</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={e => updateField('email', e.target.value)}
                                            placeholder="tu@email.com"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--buddha-gold)]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Shipping */}
                            <div className="glass-card p-6">
                                <h2 className="text-lg font-semibold text-white mb-6">Método de Envío</h2>
                                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                                    <button
                                        type="button"
                                        onClick={() => updateField('shipping', 'retiro')}
                                        className={`p-4 rounded-xl border text-left transition-all ${formData.shipping === 'retiro'
                                                ? 'bg-[var(--buddha-gold-10)] border-[var(--buddha-gold)]'
                                                : 'bg-white/5 border-white/10 hover:border-white/20'
                                            }`}
                                    >
                                        <Store className={`w-6 h-6 mb-2 ${formData.shipping === 'retiro' ? 'text-[var(--buddha-gold)]' : 'text-[var(--text-secondary)]'}`} />
                                        <p className="font-medium text-white">Retiro en Local</p>
                                        <p className="text-sm text-[var(--text-muted)]">Gratis - Maldonado centro</p>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => updateField('shipping', 'envio')}
                                        className={`p-4 rounded-xl border text-left transition-all ${formData.shipping === 'envio'
                                                ? 'bg-[var(--buddha-gold-10)] border-[var(--buddha-gold)]'
                                                : 'bg-white/5 border-white/10 hover:border-white/20'
                                            }`}
                                    >
                                        <Truck className={`w-6 h-6 mb-2 ${formData.shipping === 'envio' ? 'text-[var(--buddha-gold)]' : 'text-[var(--text-secondary)]'}`} />
                                        <p className="font-medium text-white">Envío a Domicilio</p>
                                        <p className="text-sm text-[var(--text-muted)]">
                                            {subtotal >= FREE_SHIPPING_MIN ? 'Gratis' : formatPriceUYU(SHIPPING_COST)} - Maldonado
                                        </p>
                                    </button>
                                </div>

                                {formData.shipping === 'envio' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="space-y-4"
                                    >
                                        <div>
                                            <label className="label block mb-2">Dirección *</label>
                                            <input
                                                type="text"
                                                value={formData.direccion}
                                                onChange={e => updateField('direccion', e.target.value)}
                                                placeholder="Calle y número"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--buddha-gold)]"
                                            />
                                        </div>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="label block mb-2">Parada (Si aplica)</label>
                                                <input
                                                    type="text"
                                                    value={formData.parada}
                                                    onChange={e => updateField('parada', e.target.value)}
                                                    placeholder="Ej: Parada 12"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--buddha-gold)]"
                                                />
                                            </div>
                                            <div>
                                                <label className="label block mb-2">Referencia</label>
                                                <input
                                                    type="text"
                                                    value={formData.referencia}
                                                    onChange={e => updateField('referencia', e.target.value)}
                                                    placeholder="Ej: Casa azul"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--buddha-gold)]"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Payment */}
                            <div className="glass-card p-6">
                                <h2 className="text-lg font-semibold text-white mb-6">Método de Pago</h2>
                                <div className="space-y-3">
                                    {[
                                        { id: 'mercadopago', label: 'Mercado Pago', desc: 'Tarjetas, transferencia o saldo' },
                                        { id: 'transferencia', label: 'Transferencia Bancaria', desc: 'BROU, Itaú, Santander, Scotiabank' },
                                        { id: 'efectivo', label: 'Efectivo', desc: 'Al retirar o entregar' },
                                    ].map((method) => (
                                        <button
                                            key={method.id}
                                            type="button"
                                            onClick={() => updateField('payment', method.id)}
                                            className={`w-full p-4 rounded-xl border text-left flex items-center gap-4 transition-all ${formData.payment === method.id
                                                    ? 'bg-[var(--buddha-gold-10)] border-[var(--buddha-gold)]'
                                                    : 'bg-white/5 border-white/10 hover:border-white/20'
                                                }`}
                                        >
                                            <CreditCard className={`w-6 h-6 ${formData.payment === method.id ? 'text-[var(--buddha-gold)]' : 'text-[var(--text-secondary)]'}`} />
                                            <div>
                                                <p className="font-medium text-white">{method.label}</p>
                                                <p className="text-sm text-[var(--text-muted)]">{method.desc}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="lg:col-span-1">
                            <div className="glass-card-elevated p-6 sticky top-28">
                                <h2 className="text-lg font-semibold text-white mb-6">Resumen</h2>

                                {/* Items */}
                                <div className="space-y-4 mb-6">
                                    {items.map((item) => (
                                        <div key={item.producto.id} className="flex gap-3">
                                            <div className="w-16 h-16 rounded-lg bg-[var(--cod-gray)] flex items-center justify-center overflow-hidden flex-shrink-0">
                                                {item.producto.imagen_url ? (
                                                    <Image
                                                        src={item.producto.imagen_url}
                                                        alt={item.producto.nombre}
                                                        width={64}
                                                        height={64}
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <ShoppingBag className="w-6 h-6 text-[var(--text-muted)]" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-white truncate">{item.producto.nombre}</p>
                                                <p className="text-xs text-[var(--text-muted)]">Cantidad: {item.cantidad}</p>
                                                <p className="text-sm text-[var(--buddha-gold)]">
                                                    {formatPriceUYU(item.producto.precio_venta * item.cantidad)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Totals */}
                                <div className="border-t border-white/10 pt-4 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[var(--text-muted)]">Subtotal ({itemCount} items)</span>
                                        <span className="text-white">{formatPriceUYU(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[var(--text-muted)]">Envío</span>
                                        <span className={shippingCost === 0 ? 'text-[var(--success)]' : 'text-white'}>
                                            {shippingCost === 0 ? 'Gratis' : formatPriceUYU(shippingCost)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/10">
                                        <span className="text-white">Total</span>
                                        <span className="text-gradient-gold">{formatPriceUYU(total)}</span>
                                    </div>
                                </div>

                                {/* Submit */}
                                <button
                                    onClick={handleSubmit}
                                    disabled={!canProceed() || isProcessing}
                                    className="btn-premium w-full justify-center mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Procesando...
                                        </>
                                    ) : (
                                        <>
                                            Confirmar Orden
                                            <CheckCircle className="w-5 h-5" />
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-[var(--text-muted)] text-center mt-4">
                                    Al confirmar, te contactaremos por WhatsApp para coordinar el pago.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
