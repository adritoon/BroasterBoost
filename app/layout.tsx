import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SalesNotification } from '@/components/SalesNotification';

// Cargamos la fuente Inter
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  // --- 1. URL BASE ---
  // Fundamental para que Next.js genere las rutas de las imágenes automáticamente
  metadataBase: new URL('https://www.socialboostperu.store'), 

  // --- 2. SEO BÁSICO ---
  title: 'SocialBoost Perú | Comprar Seguidores y Likes (Aceptamos Yape)',
  description: 'Impulsa tus redes al instante. Venta de Seguidores, Likes y Vistas para TikTok, IG, Kick, FB y YT. Precios baratos, entrega real y pagas con Yape/Plin.',
  
  // --- 3. PALABRAS CLAVE ---
  keywords: ['comprar seguidores peru', 'likes tiktok peru', 'vistas instagram', 'social media marketing', 'yape', 'seguidores reales', 'viewers kick peru', 'kick peru'],

  // --- 4. OPEN GRAPH ---
  // Nota: Next.js detectará automáticamente tu archivo opengraph-image.tsx
  // e inyectará la imagen aquí sin que tengas que escribirla manualmente.
  openGraph: {
    title: 'SocialBoost Perú | Crece en Redes Sociales',
    description: 'La forma más segura y rápida de aumentar tus seguidores y likes. Aceptamos Yape, Plin y Tarjetas.',
    siteName: 'SocialBoost Perú',
    locale: 'es_PE',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-200 antialiased min-h-screen relative`}>
        
        {/* Contenido de la página */}
        {children}
        
        {/* Componentes Globales */}
        <Analytics />
        <SalesNotification />

        {/* --- DATOS ESTRUCTURADOS (JSON-LD) --- */}
        {/* Este script le dice a Google explícitamente que eres una Tienda Peruana */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'OnlineStore',
              name: 'SocialBoost Perú',
              description: 'Venta de seguidores y likes para redes sociales en Perú.',
              url: 'https://www.socialboostperu.store',
              priceRange: '$$',
              paymentAccepted: ['Cash', 'Yape', 'Plin', 'Credit Card'],
              currenciesAccepted: 'PEN',
              areaServed: 'PE',
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'PE',
                addressLocality: 'Lima',
              },
            }),
          }}
        />
      </body>
    </html>
  );
}