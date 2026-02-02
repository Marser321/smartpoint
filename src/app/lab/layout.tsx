import { Zap, Cpu, HardDrive, Shield } from 'lucide-react'

// Layout específico para el Laboratorio de Computación
export default function LabLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-black selection:bg-[var(--sp-red)] selection:text-white">
            {/* Background Grid sutil */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-20" />

            {children}
        </div>
    )
}
