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
        <div className="flex min-h-screen bg-[var(--cod-gray)]">
            {/* Sidebar fijo a la izquierda */}
            <div className="w-64 flex-shrink-0 hidden md:block">
                <Sidebar />
            </div>

            {/* Contenido principal con scroll y márgenes */}
            <main className="flex-1 max-h-screen overflow-y-auto p-6 md:p-8 lg:p-12">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}

