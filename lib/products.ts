import { Instagram, Music, Facebook, Youtube, Gamepad2, Heart, Eye, MessageCircle, Share2, Users, Clock, ThumbsUp } from 'lucide-react';

// 1. Definimos las Categorías (Redes)
export type ProductType = 'instagram' | 'tiktok' | 'facebook' | 'youtube' | 'kick' | 'spotify';

// 2. Definimos los Tipos de Servicio (Sub-filtros)
export type ServiceType = 'followers' | 'likes' | 'views' | 'comments' | 'shares' | 'streaming' | 'plays' | 'listeners' | 'saves';

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
}

export const PRODUCTS: Product[] = [
  // =========================================
  // TIKTOK
  // =========================================
  {
    id: 'tt-followers-100',
    name: '100 Seguidores TikTok',
    price: 5.00,
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
    price: 15.00,
    provider_id: 2560,
    provider_quantity: 500,
    type: 'tiktok',
    service_type: 'followers',
    icon: 'users'
  },
  {
    id: 'tt-followers-1k',
    name: '1,000 Seguidores TikTok',
    price: 25.00,
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
    price: 100.00,
    provider_id: 2560,
    provider_quantity: 5000,
    type: 'tiktok',
    service_type: 'followers',
    icon: 'users'
  },
  {
    id: 'tt-followers-10k',
    name: '10,000 Seguidores TikTok',
    price: 180.00,
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
    price: 3.00, // Ajustado para no competir con el de 1000
    provider_id: 2563,
    provider_quantity: 100,
    type: 'tiktok',
    service_type: 'likes',
    icon: 'heart'
  },
  {
    id: 'tt-likes-500',
    name: '500 Likes TikTok',
    price: 5.00, // Reducido para entrada fácil
    provider_id: 2563,
    provider_quantity: 500,
    type: 'tiktok',
    service_type: 'likes',
    icon: 'heart'
  },
  {
    id: 'tt-likes-1k',
    name: '1,000 Likes TikTok',
    price: 6.00, // GANCHO: De S/ 15 a S/ 6. Irresistible.
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
    price: 25.00, // De S/ 50 a S/ 25
    provider_id: 2563,
    provider_quantity: 5000,
    type: 'tiktok',
    service_type: 'likes',
    icon: 'heart'
  },
  {
    id: 'tt-likes-10k',
    name: '10,000 Likes TikTok',
    price: 45.00, // De S/ 90 a S/ 45
    provider_id: 2563,
    provider_quantity: 10000,
    type: 'tiktok',
    service_type: 'likes',
    icon: 'heart'
  },
  {
    id: 'tt-likes-20k',
    name: '20,000 Likes TikTok',
    price: 80.00, // De S/ 160 a S/ 80
    provider_id: 2563,
    provider_quantity: 20000,
    type: 'tiktok',
    service_type: 'likes',
    icon: 'heart'
  },
  {
    id: 'tt-likes-50k',
    name: '50,000 Likes TikTok',
    price: 180.00, // De S/ 350 a S/ 180
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
    price: 4.00,
    provider_id: 5791,
    provider_quantity: 1000,
    type: 'tiktok',
    service_type: 'views',
    icon: 'eye'
  },
  {
    id: 'tt-views-5k',
    name: '5,000 Vistas Tiktok',
    price: 10.00,
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
    price: 20.00,
    provider_id: 5791,
    provider_quantity: 10000,
    type: 'tiktok',
    service_type: 'views',
    icon: 'eye'
  },
  {
    id: 'tt-views-20k',
    name: '20,000 Vistas Tiktok',
    price: 35.00,
    provider_id: 5791,
    provider_quantity: 20000,
    type: 'tiktok',
    service_type: 'views',
    icon: 'eye'
  },
  {
    id: 'tt-views-50k',
    name: '50,000 Vistas Tiktok',
    price: 50.00,
    provider_id: 5791,
    provider_quantity: 50000,
    type: 'tiktok',
    service_type: 'views',
    icon: 'eye'
  },
  {
    id: 'tt-views-100k',
    name: '100,000 Vistas Tiktok',
    price: 85.00,
    provider_id: 5791,
    provider_quantity: 100000,
    type: 'tiktok',
    service_type: 'views',
    icon: 'eye'
  },

  // =========================================
  // INSTAGRAM SEGUIDORES
  // =========================================
  {
    id: 'ig-followers-100',
    name: '100 Seguidores Instagram',
    price: 5.00,
    provider_id: 8706, 
    provider_quantity: 100,
    type: 'instagram',
    service_type: 'followers',
    icon: 'instagram'
  },
  {
    id: 'ig-followers-500',
    name: '500 Seguidores Instagram',
    price: 12.00, // Bajado de 15 a 12
    provider_id: 8706,
    provider_quantity: 500,
    type: 'instagram',
    service_type: 'followers',
    icon: 'instagram'
  },
  {
    id: 'ig-followers-1k',
    name: '1,000 Seguidores Instagram',
    price: 20.00, // Bajado de 25 a 20. Precio Gancho.
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
    price: 85.00, // Bajado de 90
    provider_id: 8706,
    provider_quantity: 5000,
    type: 'instagram',
    service_type: 'followers',
    icon: 'instagram'
  },
  {
    id: 'ig-followers-10k',
    name: '10,000 Seguidores Instagram',
    price: 160.00, // Bajado de 180
    provider_id: 8706,
    provider_quantity: 10000,
    type: 'instagram',
    service_type: 'followers',
    icon: 'instagram'
  },
  {
    id: 'ig-followers-20k',
    name: '20,000 Seguidores Instagram',
    price: 300.00, // Bajado de 340
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
    price: 3.00,
    provider_id: 8159,
    provider_quantity: 100,
    type: 'instagram',
    service_type: 'likes',
    icon: 'heart'
  },
  {
    id: 'ig-likes-500',
    name: '500 Likes Instagram',
    price: 5.00, // Ticket mínimo perfecto
    provider_id: 8159,
    provider_quantity: 500,
    type: 'instagram',
    service_type: 'likes',
    icon: 'heart'
  },
  {
    id: 'ig-likes-1k',
    name: '1,000 Likes Instagram',
    price: 9.00, // Bajado de 15 a 9.
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
    price: 35.00, // Bajado de 50
    provider_id: 8159,
    provider_quantity: 5000,
    type: 'instagram',
    service_type: 'likes',
    icon: 'heart'
  },
  {
    id: 'ig-likes-10k',
    name: '10,000 Likes Instagram',
    price: 60.00, // Bajado de 90
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
    price: 2.00,
    provider_id: 7706,
    provider_quantity: 100,
    type: 'instagram',
    service_type: 'views',
    icon: 'eye'
  },
  {
    id: 'ig-views-500',
    name: '500 Vistas Reels',
    price: 3.00, // Casi regalado para que prueben
    provider_id: 7706,
    provider_quantity: 500,
    type: 'instagram',
    service_type: 'views',
    icon: 'eye'
  },
  {
    id: 'ig-views-1k',
    name: '1,000 Vistas Reels',
    price: 5.00, // GANCHO: De 12 a 5.
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
    price: 10.00, // De 35 a 10. Gran valor.
    provider_id: 7706,
    provider_quantity: 5000,
    type: 'instagram',
    service_type: 'views',
    icon: 'eye'
  },
  {
    id: 'ig-views-10k',
    name: '10,000 Vistas Reels',
    price: 18.00, // De 60 a 18.
    provider_id: 7706,
    provider_quantity: 10000,
    type: 'instagram',
    service_type: 'views',
    icon: 'eye'
  },
  {
    id: 'ig-views-50k',
    name: '50,000 Vistas Reels',
    price: 60.00, // De 250 a 60. (Te cuesta centavos, vende volumen).
    provider_id: 7706,
    provider_quantity: 50000,
    type: 'instagram',
    service_type: 'views',
    icon: 'eye'
  },
  {
    id: 'ig-views-100k',
    name: '100,000 Vistas Reels',
    price: 100.00, // De 480 a 100. Viralidad barata.
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
  {
    id: 'kick-viewers-100-15',
    name: '100 Viewers (15 minutos)',
    price: 2.00, // Costo: 0.09 -> Venta: 2.00 (Ganancia x20). GANCHO TOTAL.
    provider_id: 3768,
    provider_quantity: 100,
    type: 'kick',
    service_type: 'streaming',
    icon: 'users'
  },
  {
    id: 'kick-viewers-100-30',
    name: '100 Viewers (30 minutos)',
    price: 4.00, // Costo: 0.17 -> Venta: 4.00. Irresistible.
    provider_id: 3769,
    provider_quantity: 100,
    type: 'kick',
    service_type: 'streaming',
    icon: 'users'
  },
  {
    id: 'kick-viewers-100-1',
    name: '100 Viewers (1 Hora)',
    price: 6.00, // Costo: 0.40 -> Venta: 6.00. (Antes S/ 15).
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
    price: 10.00, // Costo: 0.70 -> Venta: 10.00. (Antes S/ 25).
    provider_id: 3771,
    provider_quantity: 200,
    type: 'kick',
    service_type: 'streaming',
    icon: 'users'
  },
  {
    id: 'kick-viewers-500-30',
    name: '500 Viewers (30 minutos)',
    price: 15.00, // Costo: 0.90 -> Venta: 15.00. (Antes S/ 30).
    provider_id: 3769,
    provider_quantity: 500,
    type: 'kick',
    service_type: 'streaming',
    icon: 'users'
  },
  {
    id: 'kick-viewers-500-1',
    name: '500 Viewers (1 Hora)',
    price: 25.00, // Costo: 1.70 -> Venta: 25.00. (Antes S/ 50).
    provider_id: 3771,
    provider_quantity: 500,
    type: 'kick',
    service_type: 'streaming',
    icon: 'users'
  },
  {
    id: 'kick-viewers-1000-30',
    name: '1000 Viewers (30 minutos)',
    price: 20.00, // Costo: 1.70 -> Venta: 20.00. (Antes S/ 45).
    provider_id: 3769,
    provider_quantity: 1000,
    type: 'kick',
    service_type: 'streaming',
    icon: 'users'
  },
  {
    id: 'kick-viewers-1000-1',
    name: '1000 Viewers (1 Hora)',
    price: 35.00, // Costo: 3.40 -> Venta: 35.00. (Antes S/ 80). ¡OFERTÓN!
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
    price: 60.00, // Costo: 3.50 -> Venta: 60.00. (Antes S/ 150).
    provider_id: 3771,
    provider_quantity: 2000,
    type: 'kick',
    service_type: 'streaming',
    icon: 'users'
  },
  // --- PACKS DE LARGA DURACIÓN (Márgenes más altos aquí) ---
  {
    id: 'kick-viewers-1000-2',
    name: '1000 Viewers (2 Horas)',
    price: 65.00, // Costo: 6.80 -> Venta: 65.00. (Antes S/ 150).
    provider_id: 3772,
    provider_quantity: 1000,
    type: 'kick',
    service_type: 'streaming',
    icon: 'users'
  },
  {
    id: 'kick-viewers-2000-2',
    name: '2000 Viewers (2 Horas)',
    price: 120.00, // Costo: 13.60 -> Venta: 120.00. (Antes S/ 280).
    provider_id: 3772,
    provider_quantity: 2000,
    type: 'kick',
    service_type: 'streaming',
    icon: 'users'
  },
  {
    id: 'kick-viewers-1000-3',
    name: '1000 Viewers (3 Horas)',
    price: 90.00, // Costo: 10.20 -> Venta: 90.00. (Antes S/ 210).
    provider_id: 3773,
    provider_quantity: 1000,
    type: 'kick',
    service_type: 'streaming',
    icon: 'users'
  },
  {
    id: 'kick-viewers-2000-3',
    name: '2000 Viewers (3 Horas)',
    price: 180.00, // Costo: 20.50 -> Venta: 180.00. (Antes S/ 400).
    provider_id: 3773,
    provider_quantity: 2000,
    type: 'kick',
    service_type: 'streaming',
    icon: 'users'
  },
  {
    id: 'kick-viewers-1000-5',
    name: '1000 Viewers (5 Horas)',
    price: 150.00, // Costo: 17.00 -> Venta: 150.00. (Antes S/ 340).
    provider_id: 3775,
    provider_quantity: 1000,
    type: 'kick',
    service_type: 'streaming',
    icon: 'users'
  },
  {
    id: 'kick-viewers-2000-5',
    name: '2000 Viewers (5 Horas)',
    price: 280.00, // Costo: 34.00 -> Venta: 280.00. (Antes S/ 650).
    provider_id: 3775,
    provider_quantity: 2000,
    type: 'kick',
    service_type: 'streaming',
    icon: 'users'
  },

  // =========================================
  // YOUTUBE
  // =========================================
  {
    id: 'yt-subs-50',
    name: '50 Suscriptores',
    price: 12.00,
    provider_id: 0,
    provider_quantity: 50,
    type: 'youtube',
    service_type: 'followers', // Subs = Followers en lógica de filtro
    icon: 'youtube'
  },
  {
    id: 'yt-subs-100',
    name: '100 Suscriptores',
    price: 20.00,
    provider_id: 0,
    provider_quantity: 100,
    type: 'youtube',
    service_type: 'followers',
    icon: 'youtube'
  },
  {
    id: 'yt-subs-500',
    name: '500 Suscriptores',
    price: 85.00,
    provider_id: 0,
    provider_quantity: 500,
    type: 'youtube',
    service_type: 'followers',
    icon: 'youtube',
    popular: true
  },
  {
    id: 'yt-watchtime-100',
    name: '100 Horas Visualización',
    price: 30.00,
    provider_id: 0,
    provider_quantity: 100,
    type: 'youtube',
    service_type: 'views', // Watchtime lo agrupamos en "Views" o consumo
    icon: 'clock'
  },
  // =========================================
  // FACEBOOK
  // =========================================
  {
    id: 'fb-followers-100',
    name: '100 Seguidores Página',
    price: 5.00,
    provider_id: 0,
    provider_quantity: 100,
    type: 'facebook',
    service_type: 'followers',
    icon: 'facebook'
  },
  {
    id: 'fb-followers-500',
    name: '500 Seguidores Página',
    price: 15.00,
    provider_id: 0,
    provider_quantity: 500,
    type: 'facebook',
    service_type: 'followers',
    icon: 'facebook'
  },
  {
    id: 'fb-followers-1k',
    name: '1,000 Seguidores Página',
    price: 22.00,
    provider_id: 0,
    provider_quantity: 1000,
    type: 'facebook',
    service_type: 'followers',
    icon: 'facebook',
    popular: true
  },
  {
    id: 'fb-likes-post-500',
    name: '500 Likes en Post',
    price: 10.00,
    provider_id: 0,
    provider_quantity: 500,
    type: 'facebook',
    service_type: 'likes',
    icon: 'thumbs-up'
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

export const CATEGORIES = [
  { id: 'tiktok', label: 'TikTok', color: 'from-black to-gray-800' },
  { id: 'instagram', label: 'Instagram', color: 'from-pink-500 to-purple-500' },
  //{ id: 'youtube', label: 'YouTube', color: 'from-red-500 to-red-700' },
  //{ id: 'facebook', label: 'Facebook', color: 'from-blue-500 to-blue-700' },
  { id: 'spotify', label: 'Spotify', color: 'from-green-500 to-green-700' },
  { id: 'kick', label: 'Kick', color: 'from-green-400 to-green-600' },
];