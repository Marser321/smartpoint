import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import { Shield } from 'lucide-react'

export const metadata = {
    title: 'Política de Privacidad | Smart Point',
    description: 'Política de privacidad y protección de datos de Smart Point Uruguay.',
}

export default function PrivacidadPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen pt-28 pb-16">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="w-16 h-16 rounded-2xl bg-[var(--buddha-gold-10)] flex items-center justify-center mx-auto mb-4">
                            <Shield className="w-8 h-8 text-[var(--buddha-gold)]" />
                        </div>
                        <h1 className="heading-1 mb-4">Política de Privacidad</h1>
                        <p className="text-[var(--text-muted)]">Última actualización: Febrero 2026</p>
                    </div>

                    <div className="prose prose-invert max-w-none space-y-8">
                        <section className="glass-card p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">1. Información que Recopilamos</h2>
                            <p className="text-[var(--text-secondary)] leading-relaxed">
                                En Smart Point recopilamos información personal que vos nos proporcionás directamente,
                                incluyendo nombre, número de teléfono, correo electrónico y dirección cuando solicitás
                                un servicio de reparación o realizás una compra.
                            </p>
                        </section>

                        <section className="glass-card p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">2. Uso de la Información</h2>
                            <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                                Utilizamos tu información para:
                            </p>
                            <ul className="space-y-2 text-[var(--text-secondary)]">
                                <li className="flex items-start gap-2">
                                    <span className="text-[var(--buddha-gold)]">•</span>
                                    Procesar y gestionar tus solicitudes de reparación
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[var(--buddha-gold)]">•</span>
                                    Comunicarnos contigo sobre el estado de tu equipo
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[var(--buddha-gold)]">•</span>
                                    Procesar pedidos y envíos de productos
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[var(--buddha-gold)]">•</span>
                                    Mejorar nuestros servicios y experiencia de usuario
                                </li>
                            </ul>
                        </section>

                        <section className="glass-card p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">3. Protección de Datos</h2>
                            <p className="text-[var(--text-secondary)] leading-relaxed">
                                Implementamos medidas de seguridad técnicas y organizativas para proteger tu información
                                personal contra acceso no autorizado, pérdida o alteración. Tus datos se almacenan en
                                servidores seguros con encriptación.
                            </p>
                        </section>

                        <section className="glass-card p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">4. Tus Derechos</h2>
                            <p className="text-[var(--text-secondary)] leading-relaxed">
                                Tenés derecho a acceder, rectificar o eliminar tus datos personales en cualquier momento.
                                Para ejercer estos derechos, contactanos por WhatsApp o email.
                            </p>
                        </section>

                        <section className="glass-card p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">5. Contacto</h2>
                            <p className="text-[var(--text-secondary)] leading-relaxed">
                                Para cualquier consulta sobre esta política, podés contactarnos en:<br />
                                <span className="text-[var(--buddha-gold)]">contacto@smartpoint.uy</span>
                            </p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
