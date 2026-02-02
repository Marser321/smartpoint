import { redirect } from 'next/navigation'

export default function ServiciosPage() {
    // Redirigir a Landing de Reparaciones por ahora, ya que no hay landing general de servicios aún
    redirect('/reparacion')
}
