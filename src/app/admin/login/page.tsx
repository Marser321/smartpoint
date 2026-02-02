'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Wrench, Mail, Lock, Loader2, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const supabase = createClient()
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                setError('Email o contraseña incorrectos')
                return
            }

            router.push('/admin/dashboard')
            router.refresh()
        } catch {
            setError('Error al iniciar sesión')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--sp-red)] to-[var(--sp-red-dark)] flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(196,30,58,0.3)]">
                        <Wrench className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Panel Técnico</h1>
                    <p className="text-[var(--text-muted)]">Smart Point Maldonado</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="glass-card p-8 space-y-6">
                    {error && (
                        <div className="flex items-center gap-2 bg-[var(--error-bg)] border border-[var(--error)]/30 rounded-lg p-3">
                            <AlertCircle className="w-5 h-5 text-[var(--error)]" />
                            <span className="text-[var(--error)] text-sm">{error}</span>
                        </div>
                    )}

                    <div>
                        <label className="label block mb-2">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="tecnico@smartpoint.uy"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--sp-red)] transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="label block mb-2">Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--sp-red)] transition-colors"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-premium w-full justify-center py-4 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Ingresando...
                            </>
                        ) : (
                            'Ingresar'
                        )}
                    </button>
                </form>

                <p className="text-center text-[var(--text-muted)] text-sm mt-6">
                    Solo para personal autorizado de Smart Point
                </p>
            </motion.div>
        </div>
    )
}
