'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Cpu, HardDrive, ArrowRight, Sparkles, Laptop, Gauge } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/layout/header'
import { toast } from 'sonner'

export default function LabPage() {
    const [model, setModel] = useState('')

    return (
        <>
            <Header />
            <main className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium mb-6"
                    >
                        <Cpu className="w-4 h-4" />
                        SmartPoint Lab
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight"
                    >
                        Potencia tu Equipo <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                            al Nivel Máximo
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-white/60 mb-10"
                    >
                        Descubrí el potencial oculto de tu notebook. Nuestra IA analiza tu modelo y te dice exactamente qué upgrades necesitás.
                    </motion.p>

                    {/* Quick Access Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-1 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20"
                    >
                        <div className="bg-black/90 backdrop-blur-xl rounded-[1.4rem] p-8 border border-white/10">
                            <h3 className="text-2xl font-semibold text-white mb-4">
                                ¿Qué máquina tenés?
                            </h3>
                            <div className="relative max-w-md mx-auto">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
                                <input
                                    type="text"
                                    value={model}
                                    onChange={(e) => setModel(e.target.value)}
                                    placeholder="Ej: Asus Tuf F15, MacBook Pro M1..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && model) {
                                            window.location.href = `/lab/upgrade?model=${encodeURIComponent(model)}`
                                        }
                                    }}
                                />
                                <Link
                                    href={model ? `/lab/upgrade?model=${encodeURIComponent(model)}` : '#'}
                                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${model ? 'bg-blue-600 text-white hover:bg-blue-500 cursor-pointer' : 'bg-white/10 text-white/30 cursor-not-allowed'
                                        }`}
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                            <p className="text-sm text-white/40 mt-3">
                                Presioná Enter para un análisis instantáneo
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ServiceCard
                        icon={<HardDrive className="w-8 h-8 text-blue-400" />}
                        title="Upgrade de SSD"
                        desc="Pasá de encender en 60s a 5s. Instalamos NVMe de alta velocidad sin perder tus datos."
                        gradient="from-blue-500/20 to-cyan-500/20"
                        delay={0.4}
                    />
                    <ServiceCard
                        icon={<Cpu className="w-8 h-8 text-purple-400" />}
                        title="Expansión de RAM"
                        desc="Más multitarea, edición fluida y gaming sin tirones. Memorias certificadas."
                        gradient="from-purple-500/20 to-pink-500/20"
                        delay={0.5}
                    />
                    <ServiceCard
                        icon={<Gauge className="w-8 h-8 text-green-400" />}
                        title="Optimización Gamer"
                        desc="Limpieza de bloatware, drivers optimizados y configuración térmica para máximos FPS."
                        gradient="from-green-500/20 to-emerald-500/20"
                        delay={0.6}
                    />
                </div>
            </main>
        </>
    )
}

function ServiceCard({ icon, title, desc, gradient, delay }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            whileHover={{ y: -5 }}
            className={`p-6 rounded-3xl border border-white/5 bg-gradient-to-br ${gradient} backdrop-blur-sm hover:border-white/20 transition-all`}
        >
            <div className="mb-4 p-3 rounded-2xl bg-black/20 w-fit">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-white/60 leading-relaxed">{desc}</p>
        </motion.div>
    )
}
