import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/admin/sidebar'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Bypass de autenticación en modo demo
    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

    if (!isDemoMode) {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        // Redirigir a login si no está autenticado
        if (!user) {
            redirect('/admin/login')
        }
    }

    return (
        <div className="min-h-screen bg-[var(--cod-gray)]">
            {/* Sidebar - incluye su propio header móvil */}
            <Sidebar />

            {/* Contenido principal */}
            {/* pt-16 en móvil para el header, lg:pl-72 para el sidebar en desktop */}
            <main className="pt-16 lg:pt-0 lg:pl-72 min-h-screen">
                <div className="p-4 md:p-6 lg:p-8 xl:p-12">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}


