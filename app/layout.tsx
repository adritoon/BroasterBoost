import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SalesNotification } from '@/components/SalesNotification';

// Cargamos la fuente Inter
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  // --- 1. URL BASE ---
  metadataBase: new URL('https://www.socialboostperu.store'), 

  // --- 2. SEO BÁSICO ---
  title: 'SocialBoost Perú | Comprar Seguidores, Likes y Vistas — Paga con Yape',
  description: 'Compra seguidores TikTok, likes Instagram, suscriptores YouTube, viewers Kick, seguidores Facebook y plays Spotify en Perú. Entrega inmediata, precios desde S/ 1.50. Paga seguro con Yape, Plin o tarjeta. Panel SMM #1 de Perú con garantía de reposición.',
  
  // --- 3. PALABRAS CLAVE (Long-tail Perú) ---
  keywords: [
    // TikTok
    'comprar seguidores tiktok peru', 'seguidores tiktok baratos', 'likes tiktok peru',
    'vistas tiktok peru', 'viewers tiktok live peru', 'pk battle tiktok',
    'seguidores tiktok reales peru', 'comprar seguidores tiktok con yape',
    // Instagram
    'comprar seguidores instagram peru', 'likes instagram peru', 'vistas reels instagram peru',
    'seguidores instagram baratos', 'comprar likes instagram con yape',
    // YouTube
    'comprar suscriptores youtube peru', '4000 horas youtube peru', 'watchtime youtube comprar',
    'vistas youtube shorts peru', 'likes youtube peru',
    // Kick
    'viewers kick peru', 'comprar seguidores kick', 'afiliado kick peru',
    'bot viewers kick', 'viewers kick 24/7',
    // Facebook
    'comprar seguidores facebook peru', 'likes facebook peru', 'seguidores fanpage peru',
    // Spotify
    'comprar plays spotify peru', 'oyentes mensuales spotify', 'guardados spotify comprar',
    'reproducciones spotify peru',
    // Genéricos
    'panel smm peru', 'panel smm barato', 'comprar seguidores con yape',
    'comprar seguidores con plin', 'seguidores baratos peru', 'socialboost peru',
    'mejor pagina seguidores peru', 'boost redes sociales peru',
  ],

  // --- 4. CANONICAL & ROBOTS ---
  alternates: {
    canonical: 'https://www.socialboostperu.store',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // --- 5. OPEN GRAPH ---
  openGraph: {
    title: 'SocialBoost Perú | Comprar Seguidores y Likes con Yape',
    description: 'La plataforma #1 de Perú para crecer en TikTok, Instagram, YouTube, Kick, Facebook y Spotify. Precios desde S/ 1.50. Entrega inmediata.',
    siteName: 'SocialBoost Perú',
    locale: 'es_PE',
    type: 'website',
    url: 'https://www.socialboostperu.store',
  },

  // --- 6. TWITTER CARD ---
  twitter: {
    card: 'summary_large_image',
    title: 'SocialBoost Perú — Seguidores, Likes y Vistas desde S/ 1.50',
    description: 'Panel SMM #1 de Perú. Compra seguidores para TikTok, Instagram, YouTube, Kick y más. Paga con Yape o tarjeta.',
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

        {/* --- DATOS ESTRUCTURADOS: TIENDA (JSON-LD) --- */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'OnlineStore',
              name: 'SocialBoost Perú',
              description: 'Panel SMM #1 de Perú. Venta de seguidores, likes, vistas y suscriptores para TikTok, Instagram, YouTube, Kick, Facebook y Spotify.',
              url: 'https://www.socialboostperu.store',
              priceRange: '$',
              paymentAccepted: ['Cash', 'Yape', 'Plin', 'Credit Card', 'Debit Card'],
              currenciesAccepted: 'PEN',
              areaServed: {
                '@type': 'Country',
                name: 'Peru',
              },
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'PE',
                addressLocality: 'Lima',
              },
              sameAs: [],
            }),
          }}
        />

        {/* --- DATOS ESTRUCTURADOS: CATÁLOGO DE PRODUCTOS (JSON-LD) --- */}
        {/* Google puede mostrar precios y disponibilidad directamente en los resultados */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: 'Servicios de Crecimiento en Redes Sociales',
              description: 'Catálogo completo de servicios SMM para Perú',
              numberOfItems: 6,
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  item: {
                    '@type': 'Product',
                    name: 'Seguidores TikTok Perú',
                    description: 'Comprar seguidores TikTok reales en Perú. Entrega inmediata, sin contraseña. Packs desde 100 hasta 10,000 seguidores.',
                    image: 'https://www.socialboostperu.store/og-image.png',
                    url: 'https://www.socialboostperu.store/#tiktok',
                    brand: { '@type': 'Brand', name: 'SocialBoost Perú' },
                    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '312' },
                    offers: {
                      '@type': 'AggregateOffer',
                      lowPrice: '8.00',
                      highPrice: '180.00',
                      priceCurrency: 'PEN',
                      availability: 'https://schema.org/InStock',
                      offerCount: 5,
                    },
                  },
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  item: {
                    '@type': 'Product',
                    name: 'Seguidores Instagram Perú',
                    description: 'Comprar seguidores Instagram en Perú. Likes, vistas Reels y seguidores con garantía de reposición.',
                    image: 'https://www.socialboostperu.store/og-image.png',
                    url: 'https://www.socialboostperu.store/#instagram',
                    brand: { '@type': 'Brand', name: 'SocialBoost Perú' },
                    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.7', reviewCount: '245' },
                    offers: {
                      '@type': 'AggregateOffer',
                      lowPrice: '6.00',
                      highPrice: '450.00',
                      priceCurrency: 'PEN',
                      availability: 'https://schema.org/InStock',
                      offerCount: 20,
                    },
                  },
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  item: {
                    '@type': 'Product',
                    name: 'Suscriptores YouTube Perú',
                    description: 'Comprar suscriptores YouTube, 4000 horas de watchtime, vistas de Shorts y likes. Todo para monetizar tu canal.',
                    image: 'https://www.socialboostperu.store/og-image.png',
                    url: 'https://www.socialboostperu.store/#youtube',
                    brand: { '@type': 'Brand', name: 'SocialBoost Perú' },
                    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.6', reviewCount: '189' },
                    offers: {
                      '@type': 'AggregateOffer',
                      lowPrice: '4.00',
                      highPrice: '1650.00',
                      priceCurrency: 'PEN',
                      availability: 'https://schema.org/InStock',
                      offerCount: 30,
                    },
                  },
                },
                {
                  '@type': 'ListItem',
                  position: 4,
                  item: {
                    '@type': 'Product',
                    name: 'Viewers y Seguidores Kick',
                    description: 'Viewers estables para streams en Kick. Packs de 15 min a 5 horas. Seguidores para conseguir el afiliado rápido.',
                    image: 'https://www.socialboostperu.store/og-image.png',
                    url: 'https://www.socialboostperu.store/#kick',
                    brand: { '@type': 'Brand', name: 'SocialBoost Perú' },
                    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '156' },
                    offers: {
                      '@type': 'AggregateOffer',
                      lowPrice: '1.50',
                      highPrice: '550.00',
                      priceCurrency: 'PEN',
                      availability: 'https://schema.org/InStock',
                      offerCount: 20,
                    },
                  },
                },
                {
                  '@type': 'ListItem',
                  position: 5,
                  item: {
                    '@type': 'Product',
                    name: 'Seguidores Facebook Fanpage',
                    description: 'Seguidores y likes para páginas de Facebook. Reacciones para publicaciones. Ideal para negocios peruanos.',
                    image: 'https://www.socialboostperu.store/og-image.png',
                    url: 'https://www.socialboostperu.store/#facebook',
                    brand: { '@type': 'Brand', name: 'SocialBoost Perú' },
                    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.7', reviewCount: '98' },
                    offers: {
                      '@type': 'AggregateOffer',
                      lowPrice: '5.00',
                      highPrice: '550.00',
                      priceCurrency: 'PEN',
                      availability: 'https://schema.org/InStock',
                      offerCount: 25,
                    },
                  },
                },
                {
                  '@type': 'ListItem',
                  position: 6,
                  item: {
                    '@type': 'Product',
                    name: 'Promoción Musical Spotify',
                    description: 'Plays de Perú y globales, oyentes mensuales, seguidores de artista y guardados para Spotify.',
                    image: 'https://www.socialboostperu.store/og-image.png',
                    url: 'https://www.socialboostperu.store/#spotify',
                    brand: { '@type': 'Brand', name: 'SocialBoost Perú' },
                    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '134' },
                    offers: {
                      '@type': 'AggregateOffer',
                      lowPrice: '4.00',
                      highPrice: '1300.00',
                      priceCurrency: 'PEN',
                      availability: 'https://schema.org/InStock',
                      offerCount: 15,
                    },
                  },
                },
              ],
            }),
          }}
        />

        {/* --- DATOS ESTRUCTURADOS: FAQ (JSON-LD) --- */}
        {/* Google muestra estas preguntas directamente debajo del resultado de búsqueda */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: '¿Necesitan mi contraseña para entregar el pedido?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: '¡NO! Nunca te pediremos tu contraseña. Solo necesitamos el enlace a tu perfil o publicación. Si alguien te pide contraseña, es una estafa.',
                  },
                },
                {
                  '@type': 'Question',
                  name: '¿Cuánto demora en llegar mi pedido de seguidores?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'La mayoría de servicios (Likes, Vistas) inician de inmediato o entre 0 a 15 minutos. Los pedidos grandes se entregan de forma gradual para simular un crecimiento orgánico y proteger tu cuenta.',
                  },
                },
                {
                  '@type': 'Question',
                  name: '¿Los seguidores se borran con el tiempo?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Ofrecemos servicios de alta calidad con garantía de reposición. Si notas una bajada en los primeros 30 días, contáctanos y repondremos los seguidores gratis.',
                  },
                },
                {
                  '@type': 'Question',
                  name: '¿Es seguro pagar con Yape o tarjeta?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Totalmente. Usamos Mercado Pago para tarjetas (con protección antifraude) y para Yape/Plin el trato es directo con nuestra cuenta verificada, sin intermediarios.',
                  },
                },
                {
                  '@type': 'Question',
                  name: '¿Qué hago si puse mal el link?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Escríbenos inmediatamente al botón de WhatsApp con tu comprobante. Si el sistema aún no ha procesado el pedido, podemos corregir el enlace manualmente al instante.',
                  },
                },
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}