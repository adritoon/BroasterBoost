import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react';

// Cargamos la fuente Inter (se ve muy bien para UI moderna)
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  // --- 1. URL BASE (CRÍTICO PARA REDES SOCIALES) ---
  // Esta es la URL que configuramos en Vercel
  metadataBase: new URL('https://comprarseguidoresperu.vercel.app'), 

  // --- 2. INFORMACIÓN BÁSICA (SEO) ---
  title: 'SocialBoost Perú | Comprar Seguidores, Likes y Vistas Reales',
  description: 'Potencia tus redes sociales en segundos. Seguidores, Likes y Vistas para TikTok, Instagram, Kick y Facebook. Precios baratos, entrega inmediata y pago seguro con Yape o Tarjeta.',
  
  // --- 3. PALABRAS CLAVE (KEYWORDS) ---
  keywords: ['comprar seguidores peru', 'likes tiktok peru', 'vistas instagram', 'social media marketing', 'yape', 'seguidores reales', 'viewers kick peru', 'kick peru'],

  // --- 4. OPEN GRAPH (CÓMO SE VE AL COMPARTIR EN WHATSAPP/FACEBOOK) ---
  openGraph: {
    title: 'SocialBoost Perú | Crece en Redes Sociales',
    description: 'La forma más segura y rápida de aumentar tus seguidores y likes. Aceptamos Yape, Plin y Tarjetas.',
    siteName: 'SocialBoost Perú',
    locale: 'es_PE', // Español Perú
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Forzamos la clase 'dark' para que siempre se vea el tema oscuro elegante
    <html lang="es" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-200 antialiased min-h-screen`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}