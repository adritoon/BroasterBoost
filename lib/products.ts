import { Instagram, Music, Facebook, Youtube, Gamepad2, Heart, Eye, MessageCircle, Share2, Users, Clock, ThumbsUp } from 'lucide-react';

// 1. Definimos las Categorías (Redes)
export type ProductType = 'instagram' | 'tiktok' | 'facebook' | 'youtube' | 'kick' | 'twitch' | 'spotify';

// 2. Definimos los Tipos de Servicio (Sub-filtros)
export type ServiceType = 'followers' | 'likes' | 'reactions' | 'views' | 'viewsShorts' | 'watchtime' | 'comments' | 'shares' | 'streaming' | 'streaming_chat' | 'plays' | 'pkbattle' | 'listeners' | 'saves';

export interface Product {
  id: string;             // ID único interno
  name: string;           // Nombre visible
  price: number;          // Precio en Soles (S/.)
  provider_id: number;    // ID del servicio en el mayorista
  provider_quantity: number; // Cantidad EXACTA a enviar
  type: ProductType;      // Categoría Principal
  service_type: ServiceType; // <--- NUEVO: Para el sub-filtro
  icon: string;           // Icono visual
  popular?: boolean;      // Destacado
  label?: string;         // Etiqueta (ej: "Oferta", "Pack")
  speed?: string;      // Ej: "⚡ Inicio: Inmediato"
  guarantee?: string;  // Ej: "🛡️ Garantía: 30 días"
  status?: 'active' | 'maintenance' | 'out_of_stock'; // Estado del producto
  yapeOnly?: boolean;    // Si true, solo permite pago vía Yape QR (sin MercadoPago)
}
export const MAINTENANCE_SUBCATEGORIES: { type: ProductType; service_type: ServiceType }[] = [
];

const RAW_PRODUCTS: Product[] = [
  // =========================================
  // TIKTOK
  // =========================================
  {
    id: 'tt-followers-100',
    name: '100 Seguidores TikTok',
    price: 20.00,
    provider_id: 2560,
    provider_quantity: 100,
    type: 'tiktok',
    service_type: 'followers', // <--- Agregado
    icon: 'users'
    //speed: '⚡ 0-6 horas',      // Ej: "⚡ Inicio: Inmediato"
    //guarantee: '🛡️ Sin caidas'  // Ej: "🛡️ Garantía: 30 días"
  },
  // =========================================
  // TIKTOK SEGUIDORES
  // =========================================
  {
    id: 'tt-followers-500',
    name: '500 Seguidores TikTok',
    price: 45.00,
    provider_id: 2560,
    provider_quantity: 500,
    type: 'tiktok',
    service_type: 'followers',
    icon: 'users'
  },
  {
    id: 'tt-followers-1k',
    name: '1,000 Seguidores TikTok',
    price: 75.00,
    provider_id: 2560,
    provider_quantity: 1000,
    type: 'tiktok',
    service_type: 'followers',
    icon: 'users',
    popular: true,
    label: 'Más Vendido'
  },
  {
    id: 'tt-followers-5k',
    name: '5,000 Seguidores TikTok',
    price: 245.00,
    provider_id: 2560,
    provider_quantity: 5000,
    type: 'tiktok',
    service_type: 'followers',
    icon: 'users'
  },
  {
    id: 'tt-followers-10k',
    name: '10,000 Seguidores TikTok',
    price: 445.00,
    provider_id: 2560,
    provider_quantity: 10000,
    type: 'tiktok',
    service_type: 'followers',
    icon: 'users',
    label: 'Pack Influencer'
  },

  // =========================================
  // TIKTOK LIKES
  // Estrategia: Bajar precios para volumen
  // =========================================
  {
    id: 'tt-likes-100',
    name: '100 Likes TikTok',
    price: 7.00, // Ajustado para no competir con el de 1000
    provider_id: 2563,
    provider_quantity: 100,
    type: 'tiktok',
    service_type: 'likes',
    icon: 'heart'
  },
  {
    id: 'tt-likes-500',
    name: '500 Likes TikTok',
    price: 15.00, // Reducido para entrada fácil
    provider_id: 2563,
    provider_quantity: 500,
    type: 'tiktok',
    service_type: 'likes',
    icon: 'heart'
  },
  {
    id: 'tt-likes-1k',
    name: '1,000 Likes TikTok',
    price: 20.00, // GANCHO: De S/ 15 a S/ 6. Irresistible.
    provider_id: 2563,
    provider_quantity: 1000,
    type: 'tiktok',
    service_type: 'likes',
    icon: 'heart',
    popular: true,
    label: 'Oferta Especial'
  },
  {
    id: 'tt-likes-5k',
    name: '5,000 Likes TikTok',
    price: 50.00, // De S/ 50 a S/ 25
    provider_id: 2563,
    provider_quantity: 5000,
    type: 'tiktok',
    service_type: 'likes',
    icon: 'heart'
  },
  {
    id: 'tt-likes-10k',
    name: '10,000 Likes TikTok',
    price: 85.00, // De S/ 90 a S/ 45
    provider_id: 2563,
    provider_quantity: 10000,
    type: 'tiktok',
    service_type: 'likes',
    icon: 'heart'
  },
  {
    id: 'tt-likes-20k',
    name: '20,000 Likes TikTok',
    price: 150.00, // De S/ 160 a S/ 80
    provider_id: 2563,
    provider_quantity: 20000,
    type: 'tiktok',
    service_type: 'likes',
    icon: 'heart'
  },
  {
    id: 'tt-likes-50k',
    name: '50,000 Likes TikTok',
    price: 250.00, // De S/ 350 a S/ 180
    provider_id: 2563,
    provider_quantity: 50000,
    type: 'tiktok',
    service_type: 'likes',
    icon: 'heart'
  },

  // =========================================
  // TIKTOK VISTAS
  // =========================================
  {
    id: 'tt-views-1k',
    name: '1,000 Vistas Tiktok',
    price: 7.00,
    provider_id: 5791,
    provider_quantity: 1000,
    type: 'tiktok',
    service_type: 'views',
    icon: 'eye'
  },
  {
    id: 'tt-views-5k',
    name: '5,000 Vistas Tiktok',
    price: 17.50,
    provider_id: 5791,
    provider_quantity: 5000,
    type: 'tiktok',
    service_type: 'views',
    icon: 'eye',
    popular: true,
    label: 'Más Vendido'
  },
  {
    id: 'tt-views-10k',
    name: '10,000 Vistas Tiktok',
    price: 28.00,
    provider_id: 5791,
    provider_quantity: 10000,
    type: 'tiktok',
    service_type: 'views',
    icon: 'eye'
  },
  {
    id: 'tt-views-20k',
    name: '20,000 Vistas Tiktok',
    price: 42.00,
    provider_id: 5791,
    provider_quantity: 20000,
    type: 'tiktok',
    service_type: 'views',
    icon: 'eye'
  },
  {
    id: 'tt-views-50k',
    name: '50,000 Vistas Tiktok',
    price: 70.00,
    provider_id: 5791,
    provider_quantity: 50000,
    type: 'tiktok',
    service_type: 'views',
    icon: 'eye'
  },
  {
    id: 'tt-views-100k',
    name: '100,000 Vistas Tiktok',
    price: 105.00,
    provider_id: 5791,
    provider_quantity: 100000,
    type: 'tiktok',
    service_type: 'views',
    icon: 'eye'
  },
  // =========================================
  // TIKTOK VIEWERS STREAMS
  // Costo proveedor: $4.50/1K/hr = S/ 17.10/1K/hr
  // Provider IDs: 1120 (1hr), 1122 (2hr), 1123 (3hr)
  // Margen objetivo: 55-75%
  // =========================================
  // 1 Hora
  {
    id: 'tt-viewers-100-1',
    name: '100 Viewers (1 Hora)',
    price: 7.90, // Costo: ~S/ 1.71 → Margen: 78%
    provider_id: 1120,
    provider_quantity: 100,
    type: 'tiktok',
    service_type: 'streaming',
    icon: 'users'
  },
  {
    id: 'tt-viewers-200-1',
    name: '200 Viewers (1 Hora)',
    price: 12.90, // Costo: ~S/ 3.42 → Margen: 73%
    provider_id: 1120,
    provider_quantity: 200,
    type: 'tiktok',
    service_type: 'streaming',
    icon: 'users'
  },
  {
    id: 'tt-viewers-500-1',
    name: '500 Viewers (1 Hora)',
    price: 24.90, // Costo: ~S/ 8.55 → Margen: 66%
    provider_id: 1120,
    provider_quantity: 500,
    type: 'tiktok',
    service_type: 'streaming',
    icon: 'users',
    popular: true,
    label: 'Pack Streamer'
  },
  {
    id: 'tt-viewers-1000-1',
    name: '1000 Viewers (1 Hora)',
    price: 39.90, // Costo: ~S/ 17.10 → Margen: 57%
    provider_id: 1120,
    provider_quantity: 1000,
    type: 'tiktok',
    service_type: 'streaming',
    icon: 'users',
    popular: true,
    label: 'Más Popular'
  },
  {
    id: 'tt-viewers-2000-1',
    name: '2000 Viewers (1 Hora)',
    price: 69.90, // Costo: ~S/ 34.20 → Margen: 51%
    provider_id: 1120,
    provider_quantity: 2000,
    type: 'tiktok',
    service_type: 'streaming',
    icon: 'users'
  },
  // 2 Horas
  {
    id: 'tt-viewers-100-2',
    name: '100 Viewers (2 Horas)',
    price: 12.90, // Costo: ~S/ 3.42 → Margen: 73%
    provider_id: 1122,
    provider_quantity: 100,
    type: 'tiktok',
    service_type: 'streaming',
    icon: 'users'
  },
  {
    id: 'tt-viewers-200-2',
    name: '200 Viewers (2 Horas)',
    price: 22.90, // Costo: ~S/ 6.84 → Margen: 70%
    provider_id: 1122,
    provider_quantity: 200,
    type: 'tiktok',
    service_type: 'streaming',
    icon: 'users'
  },
  {
    id: 'tt-viewers-500-2',
    name: '500 Viewers (2 Horas)',
    price: 42.90, // Costo: ~S/ 17.10 → Margen: 60%
    provider_id: 1122,
    provider_quantity: 500,
    type: 'tiktok',
    service_type: 'streaming',
    icon: 'users'
  },
  {
    id: 'tt-viewers-1000-2',
    name: '1000 Viewers (2 Horas)',
    price: 69.90, // Costo: ~S/ 34.20 → Margen: 51%
    provider_id: 1122,
    provider_quantity: 1000,
    type: 'tiktok',
    service_type: 'streaming',
    icon: 'users'
  },
  {
    id: 'tt-viewers-2000-2',
    name: '2000 Viewers (2 Horas)',
    price: 119.90, // Costo: ~S/ 68.40 → Margen: 43%
    provider_id: 1122,
    provider_quantity: 2000,
    type: 'tiktok',
    service_type: 'streaming',
    icon: 'users'
  },
  // 3 Horas
  {
    id: 'tt-viewers-100-3',
    name: '100 Viewers (3 Horas)',
    price: 17.90, // Costo: ~S/ 5.13 → Margen: 71%
    provider_id: 1123,
    provider_quantity: 100,
    type: 'tiktok',
    service_type: 'streaming',
    icon: 'users'
  },
  {
    id: 'tt-viewers-200-3',
    name: '200 Viewers (3 Horas)',
    price: 29.90, // Costo: ~S/ 10.26 → Margen: 66%
    provider_id: 1123,
    provider_quantity: 200,
    type: 'tiktok',
    service_type: 'streaming',
    icon: 'users'
  },
  {
    id: 'tt-viewers-500-3',
    name: '500 Viewers (3 Horas)',
    price: 59.90, // Costo: ~S/ 25.65 → Margen: 57%
    provider_id: 1123,
    provider_quantity: 500,
    type: 'tiktok',
    service_type: 'streaming',
    icon: 'users'
  },
  {
    id: 'tt-viewers-1000-3',
    name: '1000 Viewers (3 Horas)',
    price: 94.90, // Costo: ~S/ 51.30 → Margen: 46%
    provider_id: 1123,
    provider_quantity: 1000,
    type: 'tiktok',
    service_type: 'streaming',
    icon: 'users'
  },
  {
    id: 'tt-viewers-2000-3',
    name: '2000 Viewers (3 Horas)',
    price: 169.90, // Costo: ~S/ 102.60 → Margen: 40%
    provider_id: 1123,
    provider_quantity: 2000,
    type: 'tiktok',
    service_type: 'streaming',
    icon: 'users'
  },
  // =========================================
  // TIKTOK PK BATTLES
  // =========================================
  {
    id: 'tt-pkbattle-100',
    name: '100 Puntos de batalla',
    price: 2.00, // Costo: 0.15 -> Venta: 60.00. (Antes S/ 150).
    provider_id: 5159,
    provider_quantity: 100,
    type: 'tiktok',
    service_type: 'pkbattle',
    icon: 'sword'
  },
  {
    id: 'tt-pkbattle-500',
    name: '500 Puntos de batalla',
    price: 9.00, // Costo: 0.67 -> Venta: 60.00. (Antes S/ 150).
    provider_id: 5159,
    provider_quantity: 500,
    type: 'tiktok',
    service_type: 'pkbattle',
    icon: 'sword'
  },
  {
    id: 'tt-pkbattle-1000',
    name: '1000 Puntos de batalla',
    price: 15.00, // Costo: 1.40 -> Venta: 60.00. (Antes S/ 150).
    provider_id: 5159,
    provider_quantity: 1000,
    type: 'tiktok',
    service_type: 'pkbattle',
    icon: 'sword'
  },
  {
    id: 'tt-pkbattle-5000',
    name: '5000 Puntos de batalla',
    price: 25.50, // Costo: 6.75 -> Venta: 60.00. (Antes S/ 150).
    provider_id: 5159,
    provider_quantity: 5000,
    type: 'tiktok',
    service_type: 'pkbattle',
    icon: 'sword'
  },
  {
    id: 'tt-pkbattle-10000',
    name: '10000 Puntos de batalla',
    price: 45.50, // Costo: 13.50 -> Venta: 60.00. (Antes S/ 150).
    provider_id: 5159,
    provider_quantity: 10000,
    type: 'tiktok',
    service_type: 'pkbattle',
    icon: 'sword'
  },
  {
    id: 'tt-pkbattle-20000',
    name: '20000 Puntos de batalla',
    price: 80.50, // Costo: 26.90 -> Venta: 60.00. (Antes S/ 150).
    provider_id: 5159,
    provider_quantity: 20000,
    type: 'tiktok',
    service_type: 'pkbattle',
    icon: 'sword'
  },
  {
    id: 'tt-pkbattle-50000',
    name: '50000 Puntos de batalla',
    price: 140.50, // Costo: 67.20 -> Venta: 60.00. (Antes S/ 150).
    provider_id: 5159,
    provider_quantity: 50000,
    type: 'tiktok',
    service_type: 'pkbattle',
    icon: 'sword'
  },
  {
    id: 'tt-pkbattle-100000',
    name: '100000 Puntos de batalla',
    price: 255.50, // Costo: 135 -> Venta: 60.00. (Antes S/ 150).
    provider_id: 5159,
    provider_quantity: 100000,
    type: 'tiktok',
    service_type: 'pkbattle',
    icon: 'sword'
  },
  // =========================================
  // INSTAGRAM SEGUIDORES
  // =========================================
  {
    id: 'ig-followers-100',
    name: '100 Seguidores Instagram',
    price: 8.00,
    provider_id: 8706, 
    provider_quantity: 100,
    type: 'instagram',
    service_type: 'followers',
    icon: 'instagram'
  },
  {
    id: 'ig-followers-500',
    name: '500 Seguidores Instagram',
    price: 20.00, // Bajado de 15 a 12
    provider_id: 8706,
    provider_quantity: 500,
    type: 'instagram',
    service_type: 'followers',
    icon: 'instagram'
  },
  {
    id: 'ig-followers-1k',
    name: '1,000 Seguidores Instagram',
    price: 35.00, // Bajado de 25 a 20. Precio Gancho.
    provider_id: 8706,
    provider_quantity: 1000,
    type: 'instagram',
    service_type: 'followers',
    icon: 'instagram',
    popular: true,
    label: 'Top Ventas'
  },
  {
    id: 'ig-followers-5k',
    name: '5,000 Seguidores Instagram',
    price: 125.00, // Bajado de 90
    provider_id: 8706,
    provider_quantity: 5000,
    type: 'instagram',
    service_type: 'followers',
    icon: 'instagram'
  },
  {
    id: 'ig-followers-10k',
    name: '10,000 Seguidores Instagram',
    price: 215.00, // Bajado de 180
    provider_id: 8706,
    provider_quantity: 10000,
    type: 'instagram',
    service_type: 'followers',
    icon: 'instagram'
  },
  {
    id: 'ig-followers-20k',
    name: '20,000 Seguidores Instagram',
    price: 350.00, // Bajado de 340
    provider_id: 8706,
    provider_quantity: 20000,
    type: 'instagram',
    service_type: 'followers',
    icon: 'instagram'
  },

  // =========================================
  // INSTAGRAM LIKES
  // =========================================
  {
    id: 'ig-likes-100',
    name: '100 Likes Instagram',
    price: 7.00,
    provider_id: 8159,
    provider_quantity: 100,
    type: 'instagram',
    service_type: 'likes',
    icon: 'heart'
  },
  {
    id: 'ig-likes-500',
    name: '500 Likes Instagram',
    price: 15.00, // Ticket mínimo perfecto
    provider_id: 8159,
    provider_quantity: 500,
    type: 'instagram',
    service_type: 'likes',
    icon: 'heart'
  },
  {
    id: 'ig-likes-1k',
    name: '1,000 Likes Instagram',
    price: 20.00, // Bajado de 15 a 9.
    provider_id: 8159,
    provider_quantity: 1000,
    type: 'instagram',
    service_type: 'likes',
    icon: 'heart',
    popular: true,
    label: 'Top Ventas'
  },
  {
    id: 'ig-likes-5k',
    name: '5,000 Likes Instagram',
    price: 75.00, // Bajado de 50
    provider_id: 8159,
    provider_quantity: 5000,
    type: 'instagram',
    service_type: 'likes',
    icon: 'heart'
  },
  {
    id: 'ig-likes-10k',
    name: '10,000 Likes Instagram',
    price: 125.00, // Bajado de 90
    provider_id: 8159,
    provider_quantity: 10000,
    type: 'instagram',
    service_type: 'likes',
    icon: 'heart'
  },
  {
    id: 'ig-likes-50k',
    name: '50,000 Likes Instagram',
    price: 250.00, // Bajado de 420 (Descuento agresivo)
    provider_id: 8159,
    provider_quantity: 50000,
    type: 'instagram',
    service_type: 'likes',
    icon: 'heart'
  },
  {
    id: 'ig-likes-100k',
    name: '100,000 Likes Instagram',
    price: 450.00, // Bajado de 820
    provider_id: 8159,
    provider_quantity: 100000,
    type: 'instagram',
    service_type: 'likes',
    icon: 'heart'
  },

  // =========================================
  // INSTAGRAM VISTAS (REELS)
  // CAMBIOS DRASTICOS AQUÍ
  // =========================================
  {
    id: 'ig-views-100',
    name: '100 Vistas Reels',
    price: 6.00,
    provider_id: 7706,
    provider_quantity: 100,
    type: 'instagram',
    service_type: 'views',
    icon: 'eye'
  },
  {
    id: 'ig-views-500',
    name: '500 Vistas Reels',
    price: 12.00, // Casi regalado para que prueben
    provider_id: 7706,
    provider_quantity: 500,
    type: 'instagram',
    service_type: 'views',
    icon: 'eye'
  },
  {
    id: 'ig-views-1k',
    name: '1,000 Vistas Reels',
    price: 20.00, // GANCHO: De 12 a 5.
    provider_id: 7706,
    provider_quantity: 1000,
    type: 'instagram',
    service_type: 'views',
    icon: 'eye',
    popular: true,
    label: 'Top Ventas'
  },
  {
    id: 'ig-views-5k',
    name: '5,000 Vistas Reels',
    price: 50.00, // De 35 a 10. Gran valor.
    provider_id: 7706,
    provider_quantity: 5000,
    type: 'instagram',
    service_type: 'views',
    icon: 'eye'
  },
  {
    id: 'ig-views-10k',
    name: '10,000 Vistas Reels',
    price: 80.00, // De 60 a 18.
    provider_id: 7706,
    provider_quantity: 10000,
    type: 'instagram',
    service_type: 'views',
    icon: 'eye'
  },
  {
    id: 'ig-views-50k',
    name: '50,000 Vistas Reels',
    price: 160.00, // De 250 a 60. (Te cuesta centavos, vende volumen).
    provider_id: 7706,
    provider_quantity: 50000,
    type: 'instagram',
    service_type: 'views',
    icon: 'eye'
  },
  {
    id: 'ig-views-100k',
    name: '100,000 Vistas Reels',
    price: 250.00, // De 480 a 100. Viralidad barata.
    provider_id: 7706,
    provider_quantity: 100000,
    type: 'instagram',
    service_type: 'views',
    icon: 'eye'
  },

  // =========================================
  // KICK FOLLOWERS
  // =========================================
  {
    id: 'kick-followers-10',
    name: '10 Seguidores Kick',
    price: 4.00,
    provider_id: 7266,
    provider_quantity: 10,
    type: 'kick',
    service_type: 'followers',
    icon: 'gamepad-2'
  },
  {
    id: 'kick-followers-50',
    name: '50 Seguidores Kick',
    price: 8.00, // Bajado a 8
    provider_id: 7266,
    provider_quantity: 50,
    type: 'kick',
    service_type: 'followers',
    icon: 'gamepad-2'
  },
  {
    id: 'kick-followers-100',
    name: '100 Seguidores Kick',
    price: 12.00, // Bajado de 15
    provider_id: 7266,
    provider_quantity: 100,
    type: 'kick',
    service_type: 'followers',
    icon: 'gamepad-2'
  },
  {
    id: 'kick-followers-500',
    name: '500 Seguidores Kick',
    price: 35.00, // Bajado de 50 a 35
    provider_id: 7266,
    provider_quantity: 500,
    type: 'kick',
    service_type: 'followers',
    icon: 'gamepad-2'
  },
  {
    id: 'kick-followers-1k',
    name: '1,000 Seguidores Kick',
    price: 65.00, // GANCHO: Bajado de 90 a 65
    provider_id: 7266,
    provider_quantity: 1000,
    type: 'kick',
    service_type: 'followers',
    icon: 'gamepad-2',
    popular: true,
    label: 'Afiliado Rápido'
  },
  {
    id: 'kick-followers-5k',
    name: '5,000 Seguidores Kick',
    price: 300.00, // Bajado de 350
    provider_id: 7266,
    provider_quantity: 5000,
    type: 'kick',
    service_type: 'followers',
    icon: 'gamepad-2'
  },
  {
    id: 'kick-followers-10k',
    name: '10,000 Seguidores Kick',
    price: 550.00, // Bajado de 650
    provider_id: 7266,
    provider_quantity: 10000,
    type: 'kick',
    service_type: 'followers',
    icon: 'gamepad-2'
  },

  // =========================================
  // KICK VIEWERS (Precios Agresivos / Estrategia Volumen)
  // =========================================
  /*{
    id: 'kick-viewers-100-15',
    name: '100 Viewers (15 minutos)',
    price: 1.50, // Costo: 0.09 -> Venta: 2.00 (Ganancia x20). GANCHO TOTAL.
    provider_id: 3768,
    provider_quantity: 100,
    type: 'kick',
    service_type: 'streaming',
    icon: 'users'
  },*/
  /*{
    id: 'kick-viewers-100-30',
    name: '100 Viewers (30 minutos)',
    price: 2.00, // Costo: 0.17 -> Venta: 4.00. Irresistible.
    provider_id: 3769,
    provider_quantity: 100,
    type: 'kick',
    service_type: 'streaming',
    icon: 'users'
  },*/
  {
    id: 'kick-viewers-100-1',
    name: '100 Viewers (1 Hora)',
    price: 5.90, // Costo: 0.40 -> Venta: 5.90 (Precio base)
    provider_id: 3771,
    provider_quantity: 100,
    type: 'kick',
    service_type: 'streaming',
    icon: 'users',
    popular: true,
    label: 'Pack Streamer'
  },
  {
    id: 'kick-viewers-200-1',
    name: '200 Viewers (1 Hora)',
    price: 9.90, // Costo: 0.70 -> Venta: 9.90 (Ahorro de S/ 1.90)
    provider_id: 3771,
    provider_quantity: 200,
    type: 'kick',
    service_type: 'streaming',
    icon: 'users'
  },
  /*{
    id: 'kick-viewers-500-30',
    name: '500 Viewers (30 minutos)',
    price: 3.90, // Costo: 0.90 -> Venta: 3.90
    provider_id: 3769,
    provider_quantity: 500,
    type: 'kick',
    service_type: 'streaming',
    icon: 'users'
  },*/
  {
    id: 'kick-viewers-500-1',
    name: '500 Viewers (1 Hora)',
    price: 19.90, // Costo: 1.70 -> Venta: 19.90 (Ahorro de S/ 9.60)
    provider_id: 3771,
    provider_quantity: 500,
    type: 'kick',
    service_type: 'streaming',
    icon: 'users'
  },
  /*{
    id: 'kick-viewers-1000-30',
    name: '1000 Viewers (30 minutos)',
    price: 6.90, // Costo: 1.70 -> Venta: 6.90
    provider_id: 3769,
    provider_quantity: 1000,
    type: 'kick',
    service_type: 'streaming',
    icon: 'users'
  },*/
  {
    id: 'kick-viewers-1000-1',
    name: '1000 Viewers (1 Hora)',
    price: 29.90, // Costo: 3.40 -> Venta: 29.90 (Descuento de ~50%)
    provider_id: 3771,
    provider_quantity: 1000,
    type: 'kick',
    service_type: 'streaming',
    icon: 'users',
    popular: true,
    label: 'Afiliado Kick'
  },
  {
    id: 'kick-viewers-2000-1',
    name: '2000 Viewers (1 Hora)',
    price: 49.90, // Costo: 6.80 -> Venta: 49.90 (Descuento de >50%)
    provider_id: 3771,
    provider_quantity: 2000,
    type: 'kick',
    service_type: 'streaming',
    icon: 'users'
  },
  // --- PACKS DE LARGA DURACIÓN (Márgenes más altos aquí) ---
  // 2 Horas
  {
    id: 'kick-viewers-100-2',
    name: '100 Viewers (2 Horas)',
    price: 9.90,
    provider_id: 3772,
    provider_quantity: 100,
    type: 'kick',
    service_type: 'streaming',
    icon: 'users'
  },
  {
    id: 'kick-viewers-200-2',
    name: '200 Viewers (2 Horas)',
    price: 16.90,
    provider_id: 3772,
    provider_quantity: 200,
    type: 'kick',
    service_type: 'streaming',
    icon: 'users'
  },
  {
    id: 'kick-viewers-500-2',
    name: '500 Viewers (2 Horas)',
    price: 32.90,
    provider_id: 3772,
    provider_quantity: 500,
    type: 'kick',
    service_type: 'streaming',
    icon: 'users'
  },
  {
    id: 'kick-viewers-1000-2',
    name: '1000 Viewers (2 Horas)',
    price: 49.90, // Costo: 6.80 -> Venta: 49.90
    provider_id: 3772,
    provider_quantity: 1000,
    type: 'kick',
    service_type: 'streaming',
    icon: 'users'
  },
  {
    id: 'kick-viewers-2000-2',
    name: '2000 Viewers (2 Horas)',
    price: 89.90, // Costo: 13.60 -> Venta: 89.90
    provider_id: 3772,
    provider_quantity: 2000,
    type: 'kick',
    service_type: 'streaming',
    icon: 'users'
  },
  // 3 Horas
  {
    id: 'kick-viewers-100-3',
    name: '100 Viewers (3 Horas)',
    price: 13.90,
    provider_id: 3773,
    provider_quantity: 100,
    type: 'kick',
    service_type: 'streaming',
    icon: 'users'
  },
  {
    id: 'kick-viewers-200-3',
    name: '200 Viewers (3 Horas)',
    price: 22.90,
    provider_id: 3773,
    provider_quantity: 200,
    type: 'kick',
    service_type: 'streaming',
    icon: 'users'
  },
  {
    id: 'kick-viewers-500-3',
    name: '500 Viewers (3 Horas)',
    price: 46.90,
    provider_id: 3773,
    provider_quantity: 500,
    type: 'kick',
    service_type: 'streaming',
    icon: 'users'
  },
  {
    id: 'kick-viewers-1000-3',
    name: '1000 Viewers (3 Horas)',
    price: 69.90, // Costo: 10.20 -> Venta: 69.90
    provider_id: 3773,
    provider_quantity: 1000,
    type: 'kick',
    service_type: 'streaming',
    icon: 'users'
  },
  {
    id: 'kick-viewers-2000-3',
    name: '2000 Viewers (3 Horas)',
    price: 119.90, // Costo: 20.50 -> Venta: 119.90
    provider_id: 3773,
    provider_quantity: 2000,
    type: 'kick',
    service_type: 'streaming',
    icon: 'users'
  },
  // 5 Horas
  {
    id: 'kick-viewers-100-5',
    name: '100 Viewers (5 Horas)',
    price: 19.90,
    provider_id: 3775,
    provider_quantity: 100,
    type: 'kick',
    service_type: 'streaming',
    icon: 'users'
  },
  {
    id: 'kick-viewers-200-5',
    name: '200 Viewers (5 Horas)',
    price: 34.90,
    provider_id: 3775,
    provider_quantity: 200,
    type: 'kick',
    service_type: 'streaming',
    icon: 'users'
  },
  {
    id: 'kick-viewers-500-5',
    name: '500 Viewers (5 Horas)',
    price: 69.90,
    provider_id: 3775,
    provider_quantity: 500,
    type: 'kick',
    service_type: 'streaming',
    icon: 'users'
  },
  {
    id: 'kick-viewers-1000-5',
    name: '1000 Viewers (5 Horas)',
    price: 99.90, // Costo: 17.00 -> Venta: 99.90
    provider_id: 3775,
    provider_quantity: 1000,
    type: 'kick',
    service_type: 'streaming',
    icon: 'users'
  },
  {
    id: 'kick-viewers-2000-5',
    name: '2000 Viewers (5 Horas)',
    price: 169.90, // Costo: 34.00 -> Venta: 169.90
    provider_id: 3775,
    provider_quantity: 2000,
    type: 'kick',
    service_type: 'streaming',
    icon: 'users'
  },

  // =========================================
  // KICK EN VIVO + CHAT (Viewers + 120 comments/hora tasa fija)
  // Comentarios: 60 normales + 60 IA por hora (2/min)
  // Precio = precio viewers solo + premium chat
  // =========================================
  // 1 Hora (+S/ 10)
  {
    id: 'kick-chat-100-1',
    name: '100 Viewers + Chat (1 Hora)',
    price: 15.90,
    provider_id: 0,
    provider_quantity: 100,
    type: 'kick',
    service_type: 'streaming_chat',
    icon: 'message-circle',
    yapeOnly: true,
    popular: true,
    label: 'Pack Streamer'
  },
  {
    id: 'kick-chat-200-1',
    name: '200 Viewers + Chat (1 Hora)',
    price: 19.90,
    provider_id: 0,
    provider_quantity: 200,
    type: 'kick',
    service_type: 'streaming_chat',
    icon: 'message-circle',
    yapeOnly: true
  },
  {
    id: 'kick-chat-500-1',
    name: '500 Viewers + Chat (1 Hora)',
    price: 29.90,
    provider_id: 0,
    provider_quantity: 500,
    type: 'kick',
    service_type: 'streaming_chat',
    icon: 'message-circle',
    yapeOnly: true
  },
  {
    id: 'kick-chat-1000-1',
    name: '1000 Viewers + Chat (1 Hora)',
    price: 39.90,
    provider_id: 0,
    provider_quantity: 1000,
    type: 'kick',
    service_type: 'streaming_chat',
    icon: 'message-circle',
    yapeOnly: true,
    popular: true,
    label: 'Más Popular'
  },
  {
    id: 'kick-chat-2000-1',
    name: '2000 Viewers + Chat (1 Hora)',
    price: 59.90,
    provider_id: 0,
    provider_quantity: 2000,
    type: 'kick',
    service_type: 'streaming_chat',
    icon: 'message-circle',
    yapeOnly: true
  },
  // 2 Horas (+S/ 18)
  {
    id: 'kick-chat-100-2',
    name: '100 Viewers + Chat (2 Horas)',
    price: 27.90,
    provider_id: 0,
    provider_quantity: 100,
    type: 'kick',
    service_type: 'streaming_chat',
    icon: 'message-circle',
    yapeOnly: true
  },
  {
    id: 'kick-chat-200-2',
    name: '200 Viewers + Chat (2 Horas)',
    price: 34.90,
    provider_id: 0,
    provider_quantity: 200,
    type: 'kick',
    service_type: 'streaming_chat',
    icon: 'message-circle',
    yapeOnly: true
  },
  {
    id: 'kick-chat-500-2',
    name: '500 Viewers + Chat (2 Horas)',
    price: 50.90,
    provider_id: 0,
    provider_quantity: 500,
    type: 'kick',
    service_type: 'streaming_chat',
    icon: 'message-circle',
    yapeOnly: true
  },
  {
    id: 'kick-chat-1000-2',
    name: '1000 Viewers + Chat (2 Horas)',
    price: 67.90,
    provider_id: 0,
    provider_quantity: 1000,
    type: 'kick',
    service_type: 'streaming_chat',
    icon: 'message-circle',
    yapeOnly: true
  },
  {
    id: 'kick-chat-2000-2',
    name: '2000 Viewers + Chat (2 Horas)',
    price: 107.90,
    provider_id: 0,
    provider_quantity: 2000,
    type: 'kick',
    service_type: 'streaming_chat',
    icon: 'message-circle',
    yapeOnly: true
  },
  // 3 Horas (+S/ 25)
  {
    id: 'kick-chat-100-3',
    name: '100 Viewers + Chat (3 Horas)',
    price: 38.90,
    provider_id: 0,
    provider_quantity: 100,
    type: 'kick',
    service_type: 'streaming_chat',
    icon: 'message-circle',
    yapeOnly: true
  },
  {
    id: 'kick-chat-200-3',
    name: '200 Viewers + Chat (3 Horas)',
    price: 47.90,
    provider_id: 0,
    provider_quantity: 200,
    type: 'kick',
    service_type: 'streaming_chat',
    icon: 'message-circle',
    yapeOnly: true
  },
  {
    id: 'kick-chat-500-3',
    name: '500 Viewers + Chat (3 Horas)',
    price: 71.90,
    provider_id: 0,
    provider_quantity: 500,
    type: 'kick',
    service_type: 'streaming_chat',
    icon: 'message-circle',
    yapeOnly: true
  },
  {
    id: 'kick-chat-1000-3',
    name: '1000 Viewers + Chat (3 Horas)',
    price: 94.90,
    provider_id: 0,
    provider_quantity: 1000,
    type: 'kick',
    service_type: 'streaming_chat',
    icon: 'message-circle',
    yapeOnly: true
  },
  {
    id: 'kick-chat-2000-3',
    name: '2000 Viewers + Chat (3 Horas)',
    price: 144.90,
    provider_id: 0,
    provider_quantity: 2000,
    type: 'kick',
    service_type: 'streaming_chat',
    icon: 'message-circle',
    yapeOnly: true
  },
  // 5 Horas (+S/ 40)
  {
    id: 'kick-chat-100-5',
    name: '100 Viewers + Chat (5 Horas)',
    price: 59.90,
    provider_id: 0,
    provider_quantity: 100,
    type: 'kick',
    service_type: 'streaming_chat',
    icon: 'message-circle',
    yapeOnly: true
  },
  {
    id: 'kick-chat-200-5',
    name: '200 Viewers + Chat (5 Horas)',
    price: 74.90,
    provider_id: 0,
    provider_quantity: 200,
    type: 'kick',
    service_type: 'streaming_chat',
    icon: 'message-circle',
    yapeOnly: true
  },
  {
    id: 'kick-chat-500-5',
    name: '500 Viewers + Chat (5 Horas)',
    price: 109.90,
    provider_id: 0,
    provider_quantity: 500,
    type: 'kick',
    service_type: 'streaming_chat',
    icon: 'message-circle',
    yapeOnly: true
  },
  {
    id: 'kick-chat-1000-5',
    name: '1000 Viewers + Chat (5 Horas)',
    price: 139.90,
    provider_id: 0,
    provider_quantity: 1000,
    type: 'kick',
    service_type: 'streaming_chat',
    icon: 'message-circle',
    yapeOnly: true
  },
  {
    id: 'kick-chat-2000-5',
    name: '2000 Viewers + Chat (5 Horas)',
    price: 209.90,
    provider_id: 0,
    provider_quantity: 2000,
    type: 'kick',
    service_type: 'streaming_chat',
    icon: 'message-circle',
    yapeOnly: true
  },

  // =========================================
  // YOUTUBE
  // =========================================
  {
    id: 'yt-subs-50',
    name: '50 Suscriptores',
    price: 8.00,
    provider_id: 8871,
    provider_quantity: 50,
    type: 'youtube',
    service_type: 'followers', // Subs = Followers en lógica de filtro
    icon: 'youtube'
  },
  {
    id: 'yt-subs-100',
    name: '100 Suscriptores',
    price: 15.00,
    provider_id: 8871,
    provider_quantity: 100,
    type: 'youtube',
    service_type: 'followers',
    icon: 'youtube'
  },
  {
    id: 'yt-subs-250',
    name: '250 Suscriptores',
    price: 30.00,
    provider_id: 8871,
    provider_quantity: 250,
    type: 'youtube',
    service_type: 'followers',
    icon: 'youtube'
  },
  {
    id: 'yt-subs-500',
    name: '500 Suscriptores',
    price: 50.00,
    provider_id: 8871,
    provider_quantity: 500,
    type: 'youtube',
    service_type: 'followers',
    icon: 'youtube',
    popular: true
  },
  {
    id: 'yt-subs-1000',
    name: '1000 Suscriptores',
    price: 90.00,
    provider_id: 8871,
    provider_quantity: 1000,
    type: 'youtube',
    service_type: 'followers',
    icon: 'youtube'
  },
  {
    id: 'yt-subs-5000',
    name: '5000 Suscriptores',
    price: 400.00,
    provider_id: 8871,
    provider_quantity: 5000,
    type: 'youtube',
    service_type: 'followers',
    icon: 'youtube'
  },
  {
    id: 'yt-subs-10000',
    name: '10000 Suscriptores',
    price: 750.00,
    provider_id: 8871,
    provider_quantity: 10000,
    type: 'youtube',
    service_type: 'followers',
    icon: 'youtube'
  },
  //VIEWS VIDEO YOUTUBE
  {
    id: 'yt-views-500',
    name: '500 Views de video',
    price: 12.00,
    provider_id: 8120,
    provider_quantity: 500,
    type: 'youtube',
    service_type: 'views',
    icon: 'youtube'
  },
  {
    id: 'yt-views-1000',
    name: '1,000 Views de video',
    price: 20.00,
    provider_id: 8120,
    provider_quantity: 1000,
    type: 'youtube',
    service_type: 'views',
    icon: 'youtube'
  },
  {
    id: 'yt-views-5000',
    name: '5,000 Views de video',
    price: 80.00,
    provider_id: 8120,
    provider_quantity: 5000,
    type: 'youtube',
    service_type: 'views',
    icon: 'youtube',
    popular: true
  },
  {
    id: 'yt-views-10000',
    name: '10,000 Views de video',
    price: 140.00,
    provider_id: 8120,
    provider_quantity: 10000,
    type: 'youtube',
    service_type: 'views',
    icon: 'youtube'
  },
  {
    id: 'yt-views-50000',
    name: '50,000 Views de video',
    price: 625.00,
    provider_id: 8120,
    provider_quantity: 50000,
    type: 'youtube',
    service_type: 'views',
    icon: 'youtube'
  },
  {
    id: 'yt-views-100000',
    name: '100,000 Views de video',
    price: 750.00,
    provider_id: 8120,
    provider_quantity: 100000,
    type: 'youtube',
    service_type: 'views',
    icon: 'youtube'
  },
  //VIEWS SHORTS YOUTUBE
  {
    id: 'yt-views-shorts-100',
    name: '100 Views de short',
    price: 4.00,
    provider_id: 6673,
    provider_quantity: 100,
    type: 'youtube',
    service_type: 'viewsShorts',
    icon: 'youtube'
  },
  {
    id: 'yt-views-shorts-500',
    name: '500 Views de short',
    price: 15.00,
    provider_id: 6673,
    provider_quantity: 500,
    type: 'youtube',
    service_type: 'viewsShorts',
    icon: 'youtube'
  },
  {
    id: 'yt-views-shorts-1000',
    name: '1,000 Views de short',
    price: 25.00,
    provider_id: 6673,
    provider_quantity: 1000,
    type: 'youtube',
    service_type: 'viewsShorts',
    icon: 'youtube'
  },
  {
    id: 'yt-views-shorts-5000',
    name: '5,000 Views de short',
    price: 105.00,
    provider_id: 6673,
    provider_quantity: 5000,
    type: 'youtube',
    service_type: 'viewsShorts',
    icon: 'youtube',
    popular: true
  },
  {
    id: 'yt-views-shorts-10000',
    name: '10,000 Views de short',
    price: 195.00,
    provider_id: 6673,
    provider_quantity: 10000,
    type: 'youtube',
    service_type: 'viewsShorts',
    icon: 'youtube'
  },
  {
    id: 'yt-views-shorts-50000',
    name: '50,000 Views de short',
    price: 900.00,
    provider_id: 6673,
    provider_quantity: 50000,
    type: 'youtube',
    service_type: 'viewsShorts',
    icon: 'youtube'
  },
  {
    id: 'yt-views-shorts-100000',
    name: '100,000 Views de short',
    price: 1650.00,
    provider_id: 6673,
    provider_quantity: 100000,
    type: 'youtube',
    service_type: 'viewsShorts',
    icon: 'youtube'
  },
  //WATCHTIME YOUTUBE
  {
    id: 'yt-watchtime-5',
    name: '5 Horas Visualización',
    price: 10.00,
    provider_id: 8831,
    provider_quantity: 5,
    type: 'youtube',
    service_type: 'watchtime',
    icon: 'clock'
  },
  {
    id: 'yt-watchtime-10',
    name: '10 Horas Visualización',
    price: 20.00,
    provider_id: 8831,
    provider_quantity: 10,
    type: 'youtube',
    service_type: 'watchtime',
    icon: 'clock'
  },
  {
    id: 'yt-watchtime-50',
    name: '50 Horas Visualización',
    price: 80.00,
    provider_id: 8831,
    provider_quantity: 50,
    type: 'youtube',
    service_type: 'watchtime',
    icon: 'clock'
  },
  {
    id: 'yt-watchtime-100',
    name: '100 Horas Visualización',
    price: 140.00,
    provider_id: 8831,
    provider_quantity: 100,
    type: 'youtube',
    service_type: 'watchtime',
    icon: 'clock',
    popular: true
  },
  //YOUTUBE LIKES VIDEOS
  {
    id: 'yt-likes-100',
    name: '100 likes de video',
    price: 6.00,
    provider_id: 6241,
    provider_quantity: 100,
    type: 'youtube',
    service_type: 'likes',
    icon: 'thumbs-up'
  },
  {
    id: 'yt-likes-500',
    name: '500 likes de video',
    price: 12.00,
    provider_id: 6241,
    provider_quantity: 500,
    type: 'youtube',
    service_type: 'likes',
    icon: 'thumbs-up'
  },
  {
    id: 'yt-likes-1000',
    name: '1,000 likes de video',
    price: 18.00,
    provider_id: 6241,
    provider_quantity: 1000,
    type: 'youtube',
    service_type: 'likes',
    icon: 'thumbs-up',
    popular: true
  },
  {
    id: 'yt-likes-5000',
    name: '5,000 likes de video',
    price: 50.00,
    provider_id: 6241,
    provider_quantity: 5000,
    type: 'youtube',
    service_type: 'likes',
    icon: 'thumbs-up'
  },
  {
    id: 'yt-likes-10000',
    name: '10,000 likes de video',
    price: 80.00,
    provider_id: 6241,
    provider_quantity: 10000,
    type: 'youtube',
    service_type: 'likes',
    icon: 'thumbs-up'
  },
  {
    id: 'yt-likes-50000',
    name: '50,000 likes de video',
    price: 250.00,
    provider_id: 6241,
    provider_quantity: 50000,
    type: 'youtube',
    service_type: 'likes',
    icon: 'thumbs-up'
  },
  {
    id: 'yt-likes-100000',
    name: '100,000 likes de video',
    price: 400.00,
    provider_id: 6241,
    provider_quantity: 100000,
    type: 'youtube',
    service_type: 'likes',
    icon: 'thumbs-up'
  },
  //YOUTUBE LIKES SHORTS
  {
    id: 'yt-likes-shorts-100',
    name: '100 likes de shorts',
    price: 6.00,
    provider_id: 6243,
    provider_quantity: 100,
    type: 'youtube',
    service_type: 'likes',
    icon: 'thumbs-up'
  },
  {
    id: 'yt-likes-shorts-500',
    name: '500 likes de shorts',
    price: 12.00,
    provider_id: 6243,
    provider_quantity: 500,
    type: 'youtube',
    service_type: 'likes',
    icon: 'thumbs-up'
  },
  {
    id: 'yt-likes-shorts-1000',
    name: '1,000 likes de shorts',
    price: 18.00,
    provider_id: 6243,
    provider_quantity: 1000,
    type: 'youtube',
    service_type: 'likes',
    icon: 'thumbs-up',
    popular: true
  },
  {
    id: 'yt-likes-shorts-5000',
    name: '5,000 likes de shorts',
    price: 50.00,
    provider_id: 6243,
    provider_quantity: 5000,
    type: 'youtube',
    service_type: 'likes',
    icon: 'thumbs-up'
  },
  {
    id: 'yt-likes-shorts-10000',
    name: '10,000 likes de shorts',
    price: 80.00,
    provider_id: 6243,
    provider_quantity: 10000,
    type: 'youtube',
    service_type: 'likes',
    icon: 'thumbs-up'
  },
  {
    id: 'yt-likes-shorts-50000',
    name: '50,000 likes de shorts',
    price: 250.00,
    provider_id: 6243,
    provider_quantity: 50000,
    type: 'youtube',
    service_type: 'likes',
    icon: 'thumbs-up'
  },
  {
    id: 'yt-likes-shorts-100000',
    name: '100,000 likes de shorts',
    price: 400.00,
    provider_id: 6243,
    provider_quantity: 100000,
    type: 'youtube',
    service_type: 'likes',
    icon: 'thumbs-up'
  },
  // =========================================
  // FACEBOOK
  // =========================================
  {
    id: 'fb-followers-10',
    name: '10 Seguidores/Likes Página',
    price: 5.00,
    provider_id: 9061,
    provider_quantity: 10,
    type: 'facebook',
    service_type: 'followers',
    icon: 'facebook'
  },
  {
    id: 'fb-followers-50',
    name: '50 Seguidores/Likes Página',
    price: 10.00,
    provider_id: 9061,
    provider_quantity: 50,
    type: 'facebook',
    service_type: 'followers',
    icon: 'facebook'
  },
  {
    id: 'fb-followers-100',
    name: '100 Seguidores/Likes Página',
    price: 15.00,
    provider_id: 9061,
    provider_quantity: 100,
    type: 'facebook',
    service_type: 'followers',
    icon: 'facebook'
  },
  {
    id: 'fb-followers-500',
    name: '500 Seguidores/Likes Página',
    price: 30.00,
    provider_id: 9061,
    provider_quantity: 500,
    type: 'facebook',
    service_type: 'followers',
    icon: 'facebook'
  },
  {
    id: 'fb-followers-1k',
    name: '1,000 Seguidores/Likes Página',
    price: 45.00,
    provider_id: 9061,
    provider_quantity: 1000,
    type: 'facebook',
    service_type: 'followers',
    icon: 'facebook',
    popular: true
  },
  {
    id: 'fb-followers-5k',
    name: '5,000 Seguidores/Likes Página',
    price: 100.00,
    provider_id: 9061,
    provider_quantity: 5000,
    type: 'facebook',
    service_type: 'followers',
    icon: 'facebook'
  },
  {
    id: 'fb-followers-10k',
    name: '10,000 Seguidores/Likes Página',
    price: 150.00,
    provider_id: 9061,
    provider_quantity: 10000,
    type: 'facebook',
    service_type: 'followers',
    icon: 'facebook'
  },
  {
    id: 'fb-followers-50k',
    name: '50,000 Seguidores/Likes Página',
    price: 350.00,
    provider_id: 9061,
    provider_quantity: 50000,
    type: 'facebook',
    service_type: 'followers',
    icon: 'facebook'
  },
  {
    id: 'fb-followers-100k',
    name: '100,000 Seguidores/Likes Página',
    price: 550.00,
    provider_id: 9061,
    provider_quantity: 100000,
    type: 'facebook',
    service_type: 'followers',
    icon: 'facebook'
  },
  {
    id: 'fb-likes-post-50',
    name: '50 Likes en Post',
    price: 5.00,
    provider_id: 5133,
    provider_quantity: 50,
    type: 'facebook',
    service_type: 'likes',
    icon: 'thumbs-up'
  },
  {
    id: 'fb-likes-post-100',
    name: '100 Likes en Post',
    price: 7.00,
    provider_id: 5133,
    provider_quantity: 100,
    type: 'facebook',
    service_type: 'likes',
    icon: 'thumbs-up'
  },
  {
    id: 'fb-likes-post-500',
    name: '500 Likes en Post',
    price: 15.00,
    provider_id: 5133,
    provider_quantity: 500,
    type: 'facebook',
    service_type: 'likes',
    icon: 'thumbs-up'
  },
  {
    id: 'fb-likes-post-1k',
    name: '1,000 Likes en Post',
    price: 20.00,
    provider_id: 5133,
    provider_quantity: 1000,
    type: 'facebook',
    service_type: 'likes',
    icon: 'thumbs-up',
    popular: true
  },
  {
    id: 'fb-likes-post-5k',
    name: '5,000 Likes en Post',
    price: 60.00,
    provider_id: 5133,
    provider_quantity: 5000,
    type: 'facebook',
    service_type: 'likes',
    icon: 'thumbs-up'
  },
  {
    id: 'fb-likes-post-10k',
    name: '10,000 Likes en Post',
    price: 100.00,
    provider_id: 5133,
    provider_quantity: 10000,
    type: 'facebook',
    service_type: 'likes',
    icon: 'thumbs-up'
  },
  {
    id: 'fb-likes-post-50k',
    name: '50,000 Likes en Post',
    price: 285.00,
    provider_id: 5133,
    provider_quantity: 50000,
    type: 'facebook',
    service_type: 'likes',
    icon: 'thumbs-up'
  },
  {
    id: 'fb-likes-post-100k',
    name: '100,000 Likes en Post',
    price: 535.00,
    provider_id: 5133,
    provider_quantity: 100000,
    type: 'facebook',
    service_type: 'likes',
    icon: 'thumbs-up'
  },
  {
    id: 'fb-react-love-50',
    name: '50 Me encanta ❤',
    price: 6.00,
    provider_id: 5986,
    provider_quantity: 50,
    type: 'facebook',
    service_type: 'reactions',
    icon: 'post'
  },
  {
    id: 'fb-react-love-100',
    name: '100 Me encanta ❤',
    price: 8.00,
    provider_id: 5986,
    provider_quantity: 100,
    type: 'facebook',
    service_type: 'reactions',
    icon: 'post'
  },
  {
    id: 'fb-react-love-500',
    name: '500 Me encanta ❤',
    price: 17.00,
    provider_id: 5986,
    provider_quantity: 500,
    type: 'facebook',
    service_type: 'reactions',
    icon: 'post'
  },
  {
    id: 'fb-react-love-1k',
    name: '1,000 Me encanta ❤',
    price: 25.00,
    provider_id: 5986,
    provider_quantity: 1000,
    type: 'facebook',
    service_type: 'reactions',
    icon: 'post'
  },
  {
    id: 'fb-react-love-5k',
    name: '5,000 Me encanta ❤',
    price: 65.00,
    provider_id: 5986,
    provider_quantity: 5000,
    type: 'facebook',
    service_type: 'reactions',
    icon: 'post'
  },
  {
    id: 'fb-react-love-10k',
    name: '10,000 Me encanta ❤',
    price: 110.00,
    provider_id: 5986,
    provider_quantity: 10000,
    type: 'facebook',
    service_type: 'reactions',
    icon: 'post'
  },
  {
    id: 'fb-react-care-50',
    name: '50 Me importa 🥰',
    price: 6.00,
    provider_id: 5987,
    provider_quantity: 50,
    type: 'facebook',
    service_type: 'reactions',
    icon: 'post'
  },
  {
    id: 'fb-react-care-100',
    name: '100 Me importa 🥰',
    price: 8.00,
    provider_id: 5987,
    provider_quantity: 100,
    type: 'facebook',
    service_type: 'reactions',
    icon: 'post'
  },
  {
    id: 'fb-react-care-500',
    name: '500 Me importa 🥰',
    price: 17.00,
    provider_id: 5987,
    provider_quantity: 500,
    type: 'facebook',
    service_type: 'reactions',
    icon: 'post'
  },
  {
    id: 'fb-react-care-1k',
    name: '1,000 Me importa 🥰',
    price: 25.00,
    provider_id: 5987,
    provider_quantity: 1000,
    type: 'facebook',
    service_type: 'reactions',
    icon: 'post'
  },
  {
    id: 'fb-react-care-5k',
    name: '5,000 Me importa 🥰',
    price: 65.00,
    provider_id: 5987,
    provider_quantity: 5000,
    type: 'facebook',
    service_type: 'reactions',
    icon: 'post'
  },
  {
    id: 'fb-react-care-10k',
    name: '10,000 Me importa 🥰',
    price: 110.00,
    provider_id: 5987,
    provider_quantity: 10000,
    type: 'facebook',
    service_type: 'reactions',
    icon: 'post'
  },
  {
    id: 'fb-react-wow-50',
    name: '50 Me asombra 😮',
    price: 6.00,
    provider_id: 5988,
    provider_quantity: 50,
    type: 'facebook',
    service_type: 'reactions',
    icon: 'post'
  },
  {
    id: 'fb-react-wow-100',
    name: '100 Me asombra 😮',
    price: 8.00,
    provider_id: 5988,
    provider_quantity: 100,
    type: 'facebook',
    service_type: 'reactions',
    icon: 'post'
  },
  {
    id: 'fb-react-wow-500',
    name: '500 Me asombra 😮',
    price: 17.00,
    provider_id: 5988,
    provider_quantity: 500,
    type: 'facebook',
    service_type: 'reactions',
    icon: 'post'
  },
  {
    id: 'fb-react-wow-1k',
    name: '1,000 Me asombra 😮',
    price: 25.00,
    provider_id: 5988,
    provider_quantity: 1000,
    type: 'facebook',
    service_type: 'reactions',
    icon: 'post'
  },
  {
    id: 'fb-react-wow-5k',
    name: '5,000 Me asombra 😮',
    price: 65.00,
    provider_id: 5988,
    provider_quantity: 5000,
    type: 'facebook',
    service_type: 'reactions',
    icon: 'post'
  },
  {
    id: 'fb-react-wow-10k',
    name: '10,000 Me asombra 😮',
    price: 110.00,
    provider_id: 5988,
    provider_quantity: 10000,
    type: 'facebook',
    service_type: 'reactions',
    icon: 'post'
  },
  {
    id: 'fb-react-haha-50',
    name: '50 Me divierte 😂',
    price: 6.00,
    provider_id: 5989,
    provider_quantity: 50,
    type: 'facebook',
    service_type: 'reactions',
    icon: 'post'
  },
  {
    id: 'fb-react-haha-100',
    name: '100 Me divierte 😂',
    price: 8.00,
    provider_id: 5989,
    provider_quantity: 100,
    type: 'facebook',
    service_type: 'reactions',
    icon: 'post'
  },
  {
    id: 'fb-react-haha-500',
    name: '500 Me divierte 😂',
    price: 17.00,
    provider_id: 5989,
    provider_quantity: 500,
    type: 'facebook',
    service_type: 'reactions',
    icon: 'post'
  },
  {
    id: 'fb-react-haha-1k',
    name: '1,000 Me divierte 😂',
    price: 25.00,
    provider_id: 5989,
    provider_quantity: 1000,
    type: 'facebook',
    service_type: 'reactions',
    icon: 'post'
  },
  {
    id: 'fb-react-haha-5k',
    name: '5,000 Me divierte 😂',
    price: 65.00,
    provider_id: 5989,
    provider_quantity: 5000,
    type: 'facebook',
    service_type: 'reactions',
    icon: 'post'
  },
  {
    id: 'fb-react-haha-10k',
    name: '10,000 Me divierte 😂',
    price: 110.00,
    provider_id: 5989,
    provider_quantity: 10000,
    type: 'facebook',
    service_type: 'reactions',
    icon: 'post'
  },
  {
    id: 'fb-react-sad-50',
    name: '50 Me entristece 😥',
    price: 6.00,
    provider_id: 5990,
    provider_quantity: 50,
    type: 'facebook',
    service_type: 'reactions',
    icon: 'post'
  },
  {
    id: 'fb-react-sad-100',
    name: '100 Me entristece 😥',
    price: 8.00,
    provider_id: 5990,
    provider_quantity: 100,
    type: 'facebook',
    service_type: 'reactions',
    icon: 'post'
  },
  {
    id: 'fb-react-sad-500',
    name: '500 Me entristece 😥',
    price: 17.00,
    provider_id: 5990,
    provider_quantity: 500,
    type: 'facebook',
    service_type: 'reactions',
    icon: 'post'
  },
  {
    id: 'fb-react-sad-1k',
    name: '1,000 Me entristece 😥',
    price: 25.00,
    provider_id: 5990,
    provider_quantity: 1000,
    type: 'facebook',
    service_type: 'reactions',
    icon: 'post'
  },
  {
    id: 'fb-react-sad-5k',
    name: '5,000 Me entristece 😥',
    price: 65.00,
    provider_id: 5990,
    provider_quantity: 5000,
    type: 'facebook',
    service_type: 'reactions',
    icon: 'post'
  },
  {
    id: 'fb-react-sad-10k',
    name: '10,000 Me entristece 😥',
    price: 110.00,
    provider_id: 5990,
    provider_quantity: 10000,
    type: 'facebook',
    service_type: 'reactions',
    icon: 'post'
  },
  {
    id: 'fb-react-angry-50',
    name: '50 Me enoja 😡',
    price: 6.00,
    provider_id: 5991,
    provider_quantity: 50,
    type: 'facebook',
    service_type: 'reactions',
    icon: 'post'
  },
  {
    id: 'fb-react-angry-100',
    name: '100 Me enoja 😡',
    price: 8.00,
    provider_id: 5991,
    provider_quantity: 100,
    type: 'facebook',
    service_type: 'reactions',
    icon: 'post'
  },
  {
    id: 'fb-react-angry-500',
    name: '500 Me enoja 😡',
    price: 17.00,
    provider_id: 5991,
    provider_quantity: 500,
    type: 'facebook',
    service_type: 'reactions',
    icon: 'post'
  },
  {
    id: 'fb-react-angry-1k',
    name: '1,000 Me enoja 😡',
    price: 25.00,
    provider_id: 5991,
    provider_quantity: 1000,
    type: 'facebook',
    service_type: 'reactions',
    icon: 'post'
  },
  {
    id: 'fb-react-angry-5k',
    name: '5,000 Me enoja 😡',
    price: 65.00,
    provider_id: 5991,
    provider_quantity: 5000,
    type: 'facebook',
    service_type: 'reactions',
    icon: 'post'
  },
  {
    id: 'fb-react-angry-10k',
    name: '10,000 Me enoja 😡',
    price: 110.00,
    provider_id: 5991,
    provider_quantity: 10000,
    type: 'facebook',
    service_type: 'reactions',
    icon: 'post'
  },

  // =========================================
  // TWITCH SEGUIDORES
  // Costo proveedor: $0.30/1K = S/ 1.14/1K
  // Provider ID: 2758
  // =========================================
  {
    id: 'twitch-followers-100',
    name: '100 Seguidores Twitch',
    price: 5.00,
    provider_id: 2758,
    provider_quantity: 100,
    type: 'twitch',
    service_type: 'followers',
    icon: 'users'
  },
  {
    id: 'twitch-followers-500',
    name: '500 Seguidores Twitch',
    price: 12.00,
    provider_id: 2758,
    provider_quantity: 500,
    type: 'twitch',
    service_type: 'followers',
    icon: 'users'
  },
  {
    id: 'twitch-followers-1k',
    name: '1,000 Seguidores Twitch',
    price: 20.00,
    provider_id: 2758,
    provider_quantity: 1000,
    type: 'twitch',
    service_type: 'followers',
    icon: 'users',
    popular: true,
    label: 'Más Vendido'
  },
  {
    id: 'twitch-followers-5k',
    name: '5,000 Seguidores Twitch',
    price: 85.00,
    provider_id: 2758,
    provider_quantity: 5000,
    type: 'twitch',
    service_type: 'followers',
    icon: 'users'
  },
  {
    id: 'twitch-followers-10k',
    name: '10,000 Seguidores Twitch',
    price: 155.00,
    provider_id: 2758,
    provider_quantity: 10000,
    type: 'twitch',
    service_type: 'followers',
    icon: 'users',
    label: 'Pack Streamer'
  },
  {
    id: 'twitch-followers-20k',
    name: '20,000 Seguidores Twitch',
    price: 280.00,
    provider_id: 2758,
    provider_quantity: 20000,
    type: 'twitch',
    service_type: 'followers',
    icon: 'users'
  },

  // =========================================
  // TWITCH VIEWERS (Solo Viewers - Yape Only)
  // Costo proveedor: $2.60/1K = S/ 9.88/1K (1 hora)
  // Sin código de proveedor - manual
  // =========================================
  {
    id: 'twitch-viewers-100-1',
    name: '100 Viewers (1 Hora)',
    price: 5.90,
    provider_id: 0,
    provider_quantity: 100,
    type: 'twitch',
    service_type: 'streaming',
    icon: 'users',
    yapeOnly: true
  },
  {
    id: 'twitch-viewers-200-1',
    name: '200 Viewers (1 Hora)',
    price: 9.90,
    provider_id: 0,
    provider_quantity: 200,
    type: 'twitch',
    service_type: 'streaming',
    icon: 'users',
    yapeOnly: true
  },
  {
    id: 'twitch-viewers-500-1',
    name: '500 Viewers (1 Hora)',
    price: 19.90,
    provider_id: 0,
    provider_quantity: 500,
    type: 'twitch',
    service_type: 'streaming',
    icon: 'users',
    yapeOnly: true,
    popular: true,
    label: 'Pack Streamer'
  },
  {
    id: 'twitch-viewers-1000-1',
    name: '1000 Viewers (1 Hora)',
    price: 29.90, // Costo: $2.60 = S/ 9.88
    provider_id: 0,
    provider_quantity: 1000,
    type: 'twitch',
    service_type: 'streaming',
    icon: 'users',
    yapeOnly: true,
    popular: true,
    label: 'Más Popular'
  },
  {
    id: 'twitch-viewers-2000-1',
    name: '2000 Viewers (1 Hora)',
    price: 49.90,
    provider_id: 0,
    provider_quantity: 2000,
    type: 'twitch',
    service_type: 'streaming',
    icon: 'users',
    yapeOnly: true
  },
  // 2 Horas
  {
    id: 'twitch-viewers-100-2',
    name: '100 Viewers (2 Horas)',
    price: 9.90,
    provider_id: 0,
    provider_quantity: 100,
    type: 'twitch',
    service_type: 'streaming',
    icon: 'users',
    yapeOnly: true
  },
  {
    id: 'twitch-viewers-200-2',
    name: '200 Viewers (2 Horas)',
    price: 16.90,
    provider_id: 0,
    provider_quantity: 200,
    type: 'twitch',
    service_type: 'streaming',
    icon: 'users',
    yapeOnly: true
  },
  {
    id: 'twitch-viewers-500-2',
    name: '500 Viewers (2 Horas)',
    price: 32.90,
    provider_id: 0,
    provider_quantity: 500,
    type: 'twitch',
    service_type: 'streaming',
    icon: 'users',
    yapeOnly: true
  },
  {
    id: 'twitch-viewers-1000-2',
    name: '1000 Viewers (2 Horas)',
    price: 49.90,
    provider_id: 0,
    provider_quantity: 1000,
    type: 'twitch',
    service_type: 'streaming',
    icon: 'users',
    yapeOnly: true
  },
  {
    id: 'twitch-viewers-2000-2',
    name: '2000 Viewers (2 Horas)',
    price: 89.90,
    provider_id: 0,
    provider_quantity: 2000,
    type: 'twitch',
    service_type: 'streaming',
    icon: 'users',
    yapeOnly: true
  },
  // 3 Horas
  {
    id: 'twitch-viewers-100-3',
    name: '100 Viewers (3 Horas)',
    price: 13.90,
    provider_id: 0,
    provider_quantity: 100,
    type: 'twitch',
    service_type: 'streaming',
    icon: 'users',
    yapeOnly: true
  },
  {
    id: 'twitch-viewers-200-3',
    name: '200 Viewers (3 Horas)',
    price: 22.90,
    provider_id: 0,
    provider_quantity: 200,
    type: 'twitch',
    service_type: 'streaming',
    icon: 'users',
    yapeOnly: true
  },
  {
    id: 'twitch-viewers-500-3',
    name: '500 Viewers (3 Horas)',
    price: 46.90,
    provider_id: 0,
    provider_quantity: 500,
    type: 'twitch',
    service_type: 'streaming',
    icon: 'users',
    yapeOnly: true
  },
  {
    id: 'twitch-viewers-1000-3',
    name: '1000 Viewers (3 Horas)',
    price: 69.90,
    provider_id: 0,
    provider_quantity: 1000,
    type: 'twitch',
    service_type: 'streaming',
    icon: 'users',
    yapeOnly: true
  },
  {
    id: 'twitch-viewers-2000-3',
    name: '2000 Viewers (3 Horas)',
    price: 119.90,
    provider_id: 0,
    provider_quantity: 2000,
    type: 'twitch',
    service_type: 'streaming',
    icon: 'users',
    yapeOnly: true
  },

  // =========================================
  // TWITCH EN VIVO + CHAT (Viewers + 120 comments/hora tasa fija)
  // Comentarios: 60 normales ($0.45) + 60 IA ($0.80) por hora = $1.25/hr = S/ 4.75/hr
  // Precio = precio viewers solo + premium chat
  // =========================================
  // 1 Hora (+S/ 10)
  {
    id: 'twitch-chat-100-1',
    name: '100 Viewers + Chat (1 Hora)',
    price: 15.90,
    provider_id: 0,
    provider_quantity: 100,
    type: 'twitch',
    service_type: 'streaming_chat',
    icon: 'message-circle',
    yapeOnly: true,
    popular: true,
    label: 'Pack Streamer'
  },
  {
    id: 'twitch-chat-200-1',
    name: '200 Viewers + Chat (1 Hora)',
    price: 19.90,
    provider_id: 0,
    provider_quantity: 200,
    type: 'twitch',
    service_type: 'streaming_chat',
    icon: 'message-circle',
    yapeOnly: true
  },
  {
    id: 'twitch-chat-500-1',
    name: '500 Viewers + Chat (1 Hora)',
    price: 29.90,
    provider_id: 0,
    provider_quantity: 500,
    type: 'twitch',
    service_type: 'streaming_chat',
    icon: 'message-circle',
    yapeOnly: true
  },
  {
    id: 'twitch-chat-1000-1',
    name: '1000 Viewers + Chat (1 Hora)',
    price: 39.90,
    provider_id: 0,
    provider_quantity: 1000,
    type: 'twitch',
    service_type: 'streaming_chat',
    icon: 'message-circle',
    yapeOnly: true,
    popular: true,
    label: 'Más Popular'
  },
  {
    id: 'twitch-chat-2000-1',
    name: '2000 Viewers + Chat (1 Hora)',
    price: 59.90,
    provider_id: 0,
    provider_quantity: 2000,
    type: 'twitch',
    service_type: 'streaming_chat',
    icon: 'message-circle',
    yapeOnly: true
  },
  // 2 Horas (+S/ 18)
  {
    id: 'twitch-chat-100-2',
    name: '100 Viewers + Chat (2 Horas)',
    price: 27.90,
    provider_id: 0,
    provider_quantity: 100,
    type: 'twitch',
    service_type: 'streaming_chat',
    icon: 'message-circle',
    yapeOnly: true
  },
  {
    id: 'twitch-chat-200-2',
    name: '200 Viewers + Chat (2 Horas)',
    price: 34.90,
    provider_id: 0,
    provider_quantity: 200,
    type: 'twitch',
    service_type: 'streaming_chat',
    icon: 'message-circle',
    yapeOnly: true
  },
  {
    id: 'twitch-chat-500-2',
    name: '500 Viewers + Chat (2 Horas)',
    price: 50.90,
    provider_id: 0,
    provider_quantity: 500,
    type: 'twitch',
    service_type: 'streaming_chat',
    icon: 'message-circle',
    yapeOnly: true
  },
  {
    id: 'twitch-chat-1000-2',
    name: '1000 Viewers + Chat (2 Horas)',
    price: 67.90,
    provider_id: 0,
    provider_quantity: 1000,
    type: 'twitch',
    service_type: 'streaming_chat',
    icon: 'message-circle',
    yapeOnly: true
  },
  {
    id: 'twitch-chat-2000-2',
    name: '2000 Viewers + Chat (2 Horas)',
    price: 107.90,
    provider_id: 0,
    provider_quantity: 2000,
    type: 'twitch',
    service_type: 'streaming_chat',
    icon: 'message-circle',
    yapeOnly: true
  },
  // 3 Horas (+S/ 25)
  {
    id: 'twitch-chat-100-3',
    name: '100 Viewers + Chat (3 Horas)',
    price: 38.90,
    provider_id: 0,
    provider_quantity: 100,
    type: 'twitch',
    service_type: 'streaming_chat',
    icon: 'message-circle',
    yapeOnly: true
  },
  {
    id: 'twitch-chat-200-3',
    name: '200 Viewers + Chat (3 Horas)',
    price: 47.90,
    provider_id: 0,
    provider_quantity: 200,
    type: 'twitch',
    service_type: 'streaming_chat',
    icon: 'message-circle',
    yapeOnly: true
  },
  {
    id: 'twitch-chat-500-3',
    name: '500 Viewers + Chat (3 Horas)',
    price: 71.90,
    provider_id: 0,
    provider_quantity: 500,
    type: 'twitch',
    service_type: 'streaming_chat',
    icon: 'message-circle',
    yapeOnly: true
  },
  {
    id: 'twitch-chat-1000-3',
    name: '1000 Viewers + Chat (3 Horas)',
    price: 94.90,
    provider_id: 0,
    provider_quantity: 1000,
    type: 'twitch',
    service_type: 'streaming_chat',
    icon: 'message-circle',
    yapeOnly: true
  },
  {
    id: 'twitch-chat-2000-3',
    name: '2000 Viewers + Chat (3 Horas)',
    price: 144.90,
    provider_id: 0,
    provider_quantity: 2000,
    type: 'twitch',
    service_type: 'streaming_chat',
    icon: 'message-circle',
    yapeOnly: true
  },

  // =========================================
  // SPOTIFY
  // =========================================
  {
    id: 'spotify-followers-global-100',
    name: '100 Seguidores Global',
    price: 3.00,
    provider_id: 1981,
    provider_quantity: 100,
    type: 'spotify',
    service_type: 'followers',
    icon: 'users'
  },
  {
    id: 'spotify-followers-peru-100',
    name: '100 Seguidores (Perú 🇵🇪)',
    price: 2.00,
    provider_id: 4511,
    provider_quantity: 100,
    type: 'spotify',
    service_type: 'followers',
    icon: 'users'
  },
  {
    id: 'spotify-followers-global-500',
    name: '500 Seguidores Global',
    price: 8.00,
    provider_id: 1981,
    provider_quantity: 500,
    type: 'spotify',
    service_type: 'followers',
    icon: 'users'
  },
  {
    id: 'spotify-followers-peru-500',
    name: '500 Seguidores (Perú 🇵🇪)',
    price: 12.00,
    provider_id: 4511,
    provider_quantity: 500,
    type: 'spotify',
    service_type: 'followers',
    icon: 'users'
  },
  {
    id: 'spotify-followers-global-1k',
    name: '1,000 Seguidores Global',
    price: 13.00,
    provider_id: 1981,
    provider_quantity: 1000,
    type: 'spotify',
    service_type: 'followers',
    icon: 'users'
  },
  {
    id: 'spotify-followers-peru-1k',
    name: '1,000 Seguidores (Perú 🇵🇪)',
    price: 18.00,
    provider_id: 4511,
    provider_quantity: 1000,
    type: 'spotify',
    service_type: 'followers',
    icon: 'users',
    popular: true
  },
  {
    id: 'spotify-followers-global-5k',
    name: '5,000 Seguidores Global',
    price: 40.00,
    provider_id: 1981,
    provider_quantity: 5000,
    type: 'spotify',
    service_type: 'followers',
    icon: 'users'
  },
  {
    id: 'spotify-followers-peru-5k',
    name: '5,000 Seguidores (Perú 🇵🇪)',
    price: 50.00,
    provider_id: 4511,
    provider_quantity: 5000,
    type: 'spotify',
    service_type: 'followers',
    icon: 'users'
  },
  {
    id: 'spotify-followers-global-10k',
    name: '10,000 Seguidores Global',
    price: 70.00,
    provider_id: 1981,
    provider_quantity: 10000,
    type: 'spotify',
    service_type: 'followers',
    icon: 'users'
  },
  {
    id: 'spotify-followers-peru-10k',
    name: '10,000 Seguidores (Perú 🇵🇪)',
    price: 85.00,
    provider_id: 4511,
    provider_quantity: 10000,
    type: 'spotify',
    service_type: 'followers',
    icon: 'users'
  },
  {
    id: 'spotify-followers-global-50k',
    name: '50,000 Seguidores Global',
    price: 300.00,
    provider_id: 1981,
    provider_quantity: 50000,
    type: 'spotify',
    service_type: 'followers',
    icon: 'users'
  },
  {
    id: 'spotify-followers-peru-50k',
    name: '50,000 Seguidores (Perú 🇵🇪)',
    price: 400.00,
    provider_id: 4511,
    provider_quantity: 50000,
    type: 'spotify',
    service_type: 'followers',
    icon: 'users'
  },
  {
    id: 'spotify-followers-global-100k',
    name: '100,000 Seguidores Global',
    price: 600.00,
    provider_id: 1981,
    provider_quantity: 100000,
    type: 'spotify',
    service_type: 'followers',
    icon: 'users'
  },
  {
    id: 'spotify-followers-peru-100k',
    name: '100,000 Seguidores (Perú 🇵🇪)',
    price: 780.00,
    provider_id: 4511,
    provider_quantity: 100000,
    type: 'spotify',
    service_type: 'followers',
    icon: 'users'
  },
  
  // PLAYS SPOTIFY
  {
    id: 'spotify-plays-global-500',
    name: '500 Reproducciones Global',
    price: 5.00,
    provider_id: 1612,
    provider_quantity: 500,
    type: 'spotify',
    service_type: 'plays',
    icon: 'plays'
  },
  {
    id: 'spotify-plays-peru-500',
    name: '500 Reproducciones (Perú 🇵🇪)',
    price: 8.00,
    provider_id: 4410,
    provider_quantity: 500,
    type: 'spotify',
    service_type: 'plays',
    icon: 'plays'
  },
  {
    id: 'spotify-plays-global-1k',
    name: '1,000 Reproducciones Global',
    price: 9.00,
    provider_id: 1612,
    provider_quantity: 1000,
    type: 'spotify',
    service_type: 'plays',
    icon: 'plays'
  },
  {
    id: 'spotify-plays-peru-1k',
    name: '1,000 Reproducciones (Perú 🇵🇪)',
    price: 14.00,
    provider_id: 4410,
    provider_quantity: 1000,
    type: 'spotify',
    service_type: 'plays',
    icon: 'plays',
    popular: true
  },
  {
    id: 'spotify-plays-global-5k',
    name: '5,000 Reproducciones Global',
    price: 30.00,
    provider_id: 1612,
    provider_quantity: 5000,
    type: 'spotify',
    service_type: 'plays',
    icon: 'plays'
  },
  {
    id: 'spotify-plays-peru-5k',
    name: '5,000 Reproducciones (Perú 🇵🇪)',
    price: 45.00,
    provider_id: 4410,
    provider_quantity: 5000,
    type: 'spotify',
    service_type: 'plays',
    icon: 'plays'
  },
  {
    id: 'spotify-plays-global-10k',
    name: '10,000 Reproducciones Global',
    price: 55.00,
    provider_id: 1612,
    provider_quantity: 10000,
    type: 'spotify',
    service_type: 'plays',
    icon: 'plays'
  },
  {
    id: 'spotify-plays-peru-10k',
    name: '10,000 Reproducciones (Perú 🇵🇪)',
    price: 80.00,
    provider_id: 4410,
    provider_quantity: 10000,
    type: 'spotify',
    service_type: 'plays',
    icon: 'plays'
  },
  {
    id: 'spotify-plays-global-50k',
    name: '50,000 Reproducciones Global',
    price: 240.00,
    provider_id: 1612,
    provider_quantity: 50000,
    type: 'spotify',
    service_type: 'plays',
    icon: 'plays'
  },
  {
    id: 'spotify-plays-peru-50k',
    name: '50,000 Reproducciones (Perú 🇵🇪)',
    price: 380.00,
    provider_id: 4410,
    provider_quantity: 50000,
    type: 'spotify',
    service_type: 'plays',
    icon: 'plays'
  },
  {
    id: 'spotify-plays-global-100k',
    name: '100,000 Reproducciones Global',
    price: 470.00,
    provider_id: 1612,
    provider_quantity: 100000,
    type: 'spotify',
    service_type: 'plays',
    icon: 'plays'
  },
  {
    id: 'spotify-plays-peru-100k',
    name: '100,000 Reproducciones (Perú 🇵🇪)',
    price: 740.00,
    provider_id: 4410,
    provider_quantity: 100000,
    type: 'spotify',
    service_type: 'plays',
    icon: 'plays'
  },
  //OYENTES MENSUALES
  {
    id: 'spotify-listeners-1k',
    name: '1,000 Oyentes Mensuales',
    price: 30.00,
    provider_id: 1980,
    provider_quantity: 1000,
    type: 'spotify',
    service_type: 'listeners',
    icon: 'listeners',
    popular: true
  },
  {
    id: 'spotify-listeners-5k',
    name: '5,000 Oyentes Mensuales',
    price: 140.00,
    provider_id: 1980,
    provider_quantity: 5000,
    type: 'spotify',
    service_type: 'listeners',
    icon: 'listeners'
  },
  {
    id: 'spotify-listeners-10k',
    name: '10,000 Oyentes Mensuales',
    price: 270.00,
    provider_id: 1980,
    provider_quantity: 10000,
    type: 'spotify',
    service_type: 'listeners',
    icon: 'listeners'
  },
  {
    id: 'spotify-listeners-50k',
    name: '50,000 Oyentes Mensuales',
    price: 1300.00,
    provider_id: 1980,
    provider_quantity: 50000,
    type: 'spotify',
    service_type: 'listeners',
    icon: 'listeners'
  },
  //GUARDADOS SPOTIFY
  {
    id: 'spotify-saves-100',
    name: '100 Guardados',
    price: 4.00,
    provider_id: 3240,
    provider_quantity: 100,
    type: 'spotify',
    service_type: 'saves',
    icon: 'saves'
  },
  {
    id: 'spotify-saves-500',
    name: '500 Guardados',
    price: 10.00,
    provider_id: 3240,
    provider_quantity: 500,
    type: 'spotify',
    service_type: 'saves',
    icon: 'saves'
  },
  {
    id: 'spotify-saves-1k',
    name: '1,000 Guardados',
    price: 15.00,
    provider_id: 3240,
    provider_quantity: 1000,
    type: 'spotify',
    service_type: 'saves',
    icon: 'saves',
    popular: true
  },
  {
    id: 'spotify-saves-5k',
    name: '5,000 Guardados',
    price: 45.00,
    provider_id: 3240,
    provider_quantity: 5000,
    type: 'spotify',
    service_type: 'saves',
    icon: 'saves'
  },
  {
    id: 'spotify-saves-10k',
    name: '10,000 Guardados',
    price: 80.00,
    provider_id: 3240,
    provider_quantity: 10000,
    type: 'spotify',
    service_type: 'saves',
    icon: 'saves'
  },
  {
    id: 'spotify-saves-50k',
    name: '50,000 Guardados',
    price: 350.00,
    provider_id: 3240,
    provider_quantity: 50000,
    type: 'spotify',
    service_type: 'saves',
    icon: 'saves'
  },
  {
    id: 'spotify-saves-100k',
    name: '100,000 Guardados',
    price: 680.00,
    provider_id: 3240,
    provider_quantity: 100000,
    type: 'spotify',
    service_type: 'saves',
    icon: 'saves'
  }
];

export const PRODUCTS: Product[] = RAW_PRODUCTS.map(product => {
  const isSubcategoryInMaintenance = MAINTENANCE_SUBCATEGORIES.some(
    m => m.type === product.type && m.service_type === product.service_type
  );
  if (isSubcategoryInMaintenance) {
    return { ...product, status: 'maintenance' };
  }
  return product;
});

export interface Category {
  id: string;
  label: string;
  color: string;
  status?: 'active' | 'maintenance';
}

export const CATEGORIES: Category[] = [
  { id: 'tiktok', label: 'TikTok', status: 'active', color: 'from-black to-gray-800' },
  { id: 'instagram', label: 'Instagram', color: 'from-pink-500 to-purple-500' },
  { id: 'youtube', label: 'YouTube', color: 'from-red-500 to-red-700' },
  { id: 'facebook', label: 'Facebook', color: 'from-blue-500 to-blue-700' },
  { id: 'spotify', label: 'Spotify', color: 'from-green-500 to-green-700' },
  { id: 'kick', label: 'Kick', color: 'from-green-400 to-green-600' },
  { id: 'twitch', label: 'Twitch', color: 'from-purple-500 to-purple-700' },
];