import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import { Toaster } from "sonner";
import DemoBanner from "@/components/layout/DemoBanner";
import AssistanceWidget from "@/components/ui/assistance-widget";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Smart Point | Servicio Técnico Premium & Accesorios - Maldonado, Uruguay",
  description: "Reparación de celulares, tablets y notebooks con garantía. Accesorios premium para tu dispositivo. Servicio express en Punta del Este y Maldonado.",
  keywords: ["reparación celular", "servicio técnico", "Maldonado", "Punta del Este", "accesorios", "fundas iPhone", "pantalla celular"],
  authors: [{ name: "Smart Point" }],
  openGraph: {
    title: "Smart Point | Servicio Técnico Premium",
    description: "Reparación de celulares con garantía. Accesorios premium. Punta del Este, Uruguay.",
    url: "https://smartpoint.uy",
    siteName: "Smart Point",
    locale: "es_UY",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="antialiased">
        <Providers>
          <DemoBanner />
          <div className={process.env.NEXT_PUBLIC_DEMO_MODE === 'true' ? 'pt-10' : ''}>
            {children}
          </div>
          <Toaster
            position="top-right"
            richColors
            theme="dark"
            toastOptions={{
              style: {
                background: 'rgba(20, 20, 20, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(12px)',
              }
            }}
          />
          <AssistanceWidget />
        </Providers>
      </body>
    </html>
  );
}

