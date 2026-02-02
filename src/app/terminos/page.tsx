import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import { FileText } from 'lucide-react'

export const metadata = {
    title: 'Términos y Condiciones | Smart Point',
    description: 'Términos y condiciones de servicio de Smart Point Uruguay.',
}

export default function TerminosPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen pt-28 pb-16">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="w-16 h-16 rounded-2xl bg-[var(--buddha-gold-10)] flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-[var(--buddha-gold)]" />
                        </div>
                        <h1 className="heading-1 mb-4">Términos y Condiciones</h1>
                        <p className="text-[var(--text-muted)]">Última actualización: Febrero 2026</p>
                    </div>

                    <div className="prose prose-invert max-w-none space-y-8">
                        <section className="glass-card p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">1. Servicios de Reparación</h2>
                            <ul className="space-y-2 text-[var(--text-secondary)]">
                                <li className="flex items-start gap-2">
                                    <span className="text-[var(--buddha-gold)]">•</span>
                                    Los diagnósticos son gratuitos y sin compromiso
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[var(--buddha-gold)]">•</span>
                                    Los presupuestos tienen validez de 7 días
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[var(--buddha-gold)]">•</span>
                                    Las reparaciones incluyen garantía de 90 días en mano de obra
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[var(--buddha-gold)]">•</span>
                                    Los repuestos tienen garantía según fabricante (mínimo 30 días)
                                </li>
                            </ul>
                        </section>

                        <section className="glass-card p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">2. Equipos No Retirados</h2>
                            <p className="text-[var(--text-secondary)] leading-relaxed">
                                Los equipos que no sean retirados en un plazo de 60 días desde la notificación
                                de que están listos, serán considerados abandonados según la normativa vigente.
                            </p>
                        </section>

                        <section className="glass-card p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">3. Compras Online</h2>
                            <ul className="space-y-2 text-[var(--text-secondary)]">
                                <li className="flex items-start gap-2">
                                    <span className="text-[var(--buddha-gold)]">•</span>
                                    Envío gratis en compras superiores a $3.000 en Maldonado
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[var(--buddha-gold)]">•</span>
                                    Cambios y devoluciones dentro de los 30 días
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[var(--buddha-gold)]">•</span>
                                    Productos deben estar en condiciones originales y sin uso
                                </li>
                            </ul>
                        </section>

                        <section className="glass-card p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">4. Responsabilidad</h2>
                            <p className="text-[var(--text-secondary)] leading-relaxed">
                                Smart Point no se hace responsable por datos almacenados en dispositivos.
                                Recomendamos realizar backup antes de entregar el equipo para reparación.
                            </p>
                        </section>

                        <section className="glass-card p-6 bg-[var(--buddha-gold-10)] border-[var(--buddha-gold-30)]">
                            <h2 className="text-xl font-semibold text-white mb-4">5. Garantía Smart Point</h2>
                            <p className="text-[var(--text-secondary)] leading-relaxed">
                                Todas nuestras reparaciones están respaldadas por nuestra garantía de satisfacción.
                                Si no quedás conforme con el trabajo realizado, lo revisamos sin costo adicional.
                            </p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
