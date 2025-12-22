import { Instagram, Music, Facebook, Youtube, Gamepad2, Heart, Eye, MessageCircle, Share2, Users, Clock, ThumbsUp } from 'lucide-react';

// 1. Definimos las Categorías (Redes)
export type ProductType = 'instagram' | 'tiktok' | 'facebook' | 'youtube' | 'kick';

// 2. Definimos los Tipos de Servicio (Sub-filtros)
export type ServiceType = 'followers' | 'likes' | 'views' | 'comments' | 'shares' | 'streaming';

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
  },
  {
    id: 'tt-followers-500',
    name: '500 Seguidores TikTok',
    price: 15.00,
    provider_id: 2560,
    provider_quantity: 500,
    type: 'tiktok',
    service_type: 'followers', // <--- Agregado
    icon: 'users'
  },
  {
    id: 'tt-followers-1k',
    name: '1,000 Seguidores TikTok',
    price: 25.00,
    provider_id: 2560,
    provider_quantity: 1000,
    type: 'tiktok',
    service_type: 'followers', // <--- Agregado
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
    service_type: 'followers', // <--- Agregado
    icon: 'users'
  },
  {
    id: 'tt-followers-10k',
    name: '10,000 Seguidores TikTok',
    price: 180.00,
    provider_id: 2560,
    provider_quantity: 10000,
    type: 'tiktok',
    service_type: 'followers', // <--- Agregado
    icon: 'users',
    label: 'Pack Influencer'
  },
  // Extras TikTok
  {
    id: 'tt-likes-100',
    name: '100 Likes TikTok',
    price: 4.00,
    provider_id: 2563,
    provider_quantity: 100,
    type: 'tiktok',
    service_type: 'likes', // <--- Diferente tipo
    icon: 'heart'
  },
  {
    id: 'tt-likes-500',
    name: '500 Likes TikTok',
    price: 10.00,
    provider_id: 2563,
    provider_quantity: 500,
    type: 'tiktok',
    service_type: 'likes', // <--- Diferente tipo
    icon: 'heart'
  },
  {
    id: 'tt-likes-1k',
    name: '1,000 Likes TikTok',
    price: 15.00,
    provider_id: 2563,
    provider_quantity: 1000,
    type: 'tiktok',
    service_type: 'likes', // <--- Diferente tipo
    icon: 'heart',
    popular: true,
    label: 'Más Vendido'
  },
  {
    id: 'tt-likes-5k',
    name: '5,000 Likes TikTok',
    price: 50.00,
    provider_id: 2563,
    provider_quantity: 5000,
    type: 'tiktok',
    service_type: 'likes', // <--- Diferente tipo
    icon: 'heart'
  },
  {
    id: 'tt-likes-10k',
    name: '10,000 Likes TikTok',
    price: 90.00,
    provider_id: 2563,
    provider_quantity: 10000,
    type: 'tiktok',
    service_type: 'likes', // <--- Diferente tipo
    icon: 'heart'
  },
  {
    id: 'tt-likes-20k',
    name: '20,000 Likes TikTok',
    price: 160.00,
    provider_id: 2563,
    provider_quantity: 20000,
    type: 'tiktok',
    service_type: 'likes', // <--- Diferente tipo
    icon: 'heart'
  },
  {
    id: 'tt-likes-50k',
    name: '50,000 Likes TikTok',
    price: 350.00,
    provider_id: 2563,
    provider_quantity: 50000,
    type: 'tiktok',
    service_type: 'likes', // <--- Diferente tipo
    icon: 'heart'
  },
  {
    id: 'tt-views-100',
    name: '100 Vistas Video',
    price: 4.00,
    provider_id: 5791,
    provider_quantity: 100,
    type: 'tiktok',
    service_type: 'views', // <--- Diferente tipo
    icon: 'eye'
  },
  {
    id: 'tt-views-500',
    name: '500 Vistas Video',
    price: 9.00,
    provider_id: 5791,
    provider_quantity: 500,
    type: 'tiktok',
    service_type: 'views', // <--- Diferente tipo
    icon: 'eye'
  },
  {
    id: 'tt-views-1k',
    name: '1,000 Vistas Video',
    price: 14.00,
    provider_id: 5791,
    provider_quantity: 1000,
    type: 'tiktok',
    service_type: 'views', // <--- Diferente tipo
    icon: 'eye',
    popular: true,
    label: 'Más Vendido'
  },
  {
    id: 'tt-views-5k',
    name: '5,000 Vistas Video',
    price: 30.00,
    provider_id: 5791,
    provider_quantity: 5000,
    type: 'tiktok',
    service_type: 'views', // <--- Diferente tipo
    icon: 'eye'
  },
  {
    id: 'tt-views-10k',
    name: '10,000 Vistas Video',
    price: 50.00,
    provider_id: 5791,
    provider_quantity: 10000,
    type: 'tiktok',
    service_type: 'views', // <--- Diferente tipo
    icon: 'eye'
  },
  {
    id: 'tt-views-20k',
    name: '20,000 Vistas Video',
    price: 90.00,
    provider_id: 5791,
    provider_quantity: 20000,
    type: 'tiktok',
    service_type: 'views', // <--- Diferente tipo
    icon: 'eye'
  },
  {
    id: 'tt-views-50k',
    name: '50,000 Vistas Video',
    price: 170.00,
    provider_id: 5791,
    provider_quantity: 50000,
    type: 'tiktok',
    service_type: 'views', // <--- Diferente tipo
    icon: 'eye'
  },
  {
    id: 'tt-views-100k',
    name: '100,000 Vistas Video',
    price: 320.00,
    provider_id: 5791,
    provider_quantity: 100000,
    type: 'tiktok',
    service_type: 'views', // <--- Diferente tipo
    icon: 'eye'
  },

  // =========================================
  // INSTAGRAM
  // =========================================
  {
    id: 'ig-followers-100',
    name: '100 Seguidores Instagram',
    price: 3.50,
    provider_id: 0, 
    provider_quantity: 100,
    type: 'instagram',
    service_type: 'followers',
    icon: 'instagram'
  },
  {
    id: 'ig-followers-500',
    name: '500 Seguidores Instagram',
    price: 9.00,
    provider_id: 0,
    provider_quantity: 500,
    type: 'instagram',
    service_type: 'followers',
    icon: 'instagram'
  },
  {
    id: 'ig-followers-1k',
    name: '1,000 Seguidores Instagram',
    price: 15.00,
    provider_id: 0,
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
    price: 65.00,
    provider_id: 0,
    provider_quantity: 5000,
    type: 'instagram',
    service_type: 'followers',
    icon: 'instagram',
    label: 'Pack Marca'
  },
  // Extras Instagram
  {
    id: 'ig-likes-1k',
    name: '1,000 Likes Reales',
    price: 5.00,
    provider_id: 0,
    provider_quantity: 1000,
    type: 'instagram',
    service_type: 'likes',
    icon: 'heart'
  },
  {
    id: 'ig-views-5k',
    name: '5,000 Vistas Reels',
    price: 8.00,
    provider_id: 0,
    provider_quantity: 5000,
    type: 'instagram',
    service_type: 'views',
    icon: 'eye'
  },

  // =========================================
  // KICK
  // =========================================
  {
    id: 'kick-followers-10',
    name: '10 Seguidores Kick',
    price: 1.00,
    provider_id: 7266,
    provider_quantity: 10,
    type: 'kick',
    service_type: 'followers',
    icon: 'gamepad-2'
  },
  {
    id: 'kick-followers-100',
    name: '100 Seguidores Kick',
    price: 5.00,
    provider_id: 0,
    provider_quantity: 100,
    type: 'kick',
    service_type: 'followers',
    icon: 'gamepad-2'
  },
  {
    id: 'kick-followers-500',
    name: '500 Seguidores Kick',
    price: 15.00,
    provider_id: 0,
    provider_quantity: 500,
    type: 'kick',
    service_type: 'followers',
    icon: 'gamepad-2'
  },
  {
    id: 'kick-followers-1k',
    name: '1,000 Seguidores Kick',
    price: 25.00,
    provider_id: 0,
    provider_quantity: 1000,
    type: 'kick',
    service_type: 'followers',
    icon: 'gamepad-2',
    popular: true,
    label: 'Afiliado Rápido'
  },
  {
    id: 'kick-viewers-100-15',
    name: '100 Viewers (15 minutos)',
    price: 1.00,
    provider_id: 3768,
    provider_quantity: 100,
    type: 'kick',
    service_type: 'streaming', // <--- Tipo especial para En Vivo
    icon: 'users',
    label: 'En Vivo'
  },
  {
    id: 'kick-viewers-100',
    name: '100 Viewers (1 Hora)',
    price: 35.00,
    provider_id: 3771,
    provider_quantity: 100,
    type: 'kick',
    service_type: 'streaming', // <--- Tipo especial para En Vivo
    icon: 'users',
    label: 'En Vivo'
  },
  {
    id: 'kick-viewers-500',
    name: '500 Viewers (1 Hora)',
    price: 135.00,
    provider_id: 3771,
    provider_quantity: 500,
    type: 'kick',
    service_type: 'streaming', // <--- Tipo especial para En Vivo
    icon: 'users',
    label: 'En Vivo'
  },
  {
    id: 'kick-viewers-1000',
    name: '1000 Viewers (1 Hora)',
    price: 200.00,
    provider_id: 3771,
    provider_quantity: 1000,
    type: 'kick',
    service_type: 'streaming', // <--- Tipo especial para En Vivo
    icon: 'users',
    label: 'En Vivo'
  },
  {
    id: 'kick-viewers-1000-2',
    name: '1000 Viewers (2 Horas)',
    price: 300.00,
    provider_id: 3772,
    provider_quantity: 1000,
    type: 'kick',
    service_type: 'streaming', // <--- Tipo especial para En Vivo
    icon: 'users',
    label: 'En Vivo'
  },
  {
    id: 'kick-viewers-1000-3',
    name: '1000 Viewers (3 Horas)',
    price: 450.00,
    provider_id: 3773,
    provider_quantity: 1000,
    type: 'kick',
    service_type: 'streaming', // <--- Tipo especial para En Vivo
    icon: 'users',
    label: 'En Vivo'
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
  }
];

export const CATEGORIES = [
  { id: 'tiktok', label: 'TikTok', color: 'from-black to-gray-800' },
  { id: 'instagram', label: 'Instagram', color: 'from-pink-500 to-purple-500' },
  { id: 'youtube', label: 'YouTube', color: 'from-red-500 to-red-700' },
  { id: 'facebook', label: 'Facebook', color: 'from-blue-500 to-blue-700' },
  { id: 'kick', label: 'Kick', color: 'from-green-400 to-green-600' },
];