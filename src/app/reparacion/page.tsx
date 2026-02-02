import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import TicketForm from '@/components/sat/ticket-form'
import { Wrench, Clock, Shield, CheckCircle } from 'lucide-react'

export const metadata = {
    title: 'Solicitar Reparación | Smart Point',
    description: 'Solicitá la reparación de tu celular, tablet o notebook. Diagnóstico gratuito y garantía de 6 meses.',
}

export default function ReparacionPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen pt-28 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 badge-premium mb-4">
                            <Wrench className="w-4 h-4" />
                            Servicio Técnico
                        </div>
                        <h1 className="heading-1 mb-4">
                            Solicitá tu{' '}
                            <span className="text-gradient-gold">reparación</span>
                        </h1>
                        <p className="body-large max-w-2xl mx-auto">
                            Completá el formulario y te contactamos para coordinar.
                            Diagnóstico gratuito y sin compromiso.
                        </p>
                    </div>

                    {/* Benefits */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                        {[
                            { icon: Clock, label: 'Reparación Express', desc: '2-4 horas' },
                            { icon: Shield, label: 'Garantía', desc: '6 meses' },
                            { icon: CheckCircle, label: 'Diagnóstico', desc: 'Gratuito' },
                            { icon: Wrench, label: 'Repuestos', desc: 'Premium' },
                        ].map((item) => (
                            <div key={item.label} className="glass-card p-4 text-center">
                                <item.icon className="w-6 h-6 text-[var(--buddha-gold)] mx-auto mb-2" />
                                <p className="font-medium text-white text-sm">{item.label}</p>
                                <p className="text-xs text-[var(--text-muted)]">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Form */}
                    <TicketForm />

                    {/* Additional Info */}
                    <div className="mt-16 text-center">
                        <p className="text-[var(--text-muted)] mb-4">
                            ¿Preferís contactarnos directamente?
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href="https://wa.me/59899123456"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-glass"
                            >
                                WhatsApp: 099 123 456
                            </a>
                            <a
                                href="tel:+59899123456"
                                className="btn-glass"
                            >
                                Llamar Ahora
                            </a>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
