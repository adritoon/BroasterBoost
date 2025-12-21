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
    id: 'tt-followers-50',
    name: '50 Seguidores TikTok',
    price: 2.00,
    provider_id: 0,
    provider_quantity: 50,
    type: 'tiktok',
    service_type: 'followers', // <--- Agregado
    icon: 'users'
  },
  {
    id: 'tt-followers-100',
    name: '100 Seguidores TikTok',
    price: 4.00,
    provider_id: 0,
    provider_quantity: 100,
    type: 'tiktok',
    service_type: 'followers', // <--- Agregado
    icon: 'users'
  },
  {
    id: 'tt-followers-1k',
    name: '1,000 Seguidores TikTok',
    price: 35.00,
    provider_id: 0,
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
    price: 135.00,
    provider_id: 0,
    provider_quantity: 5000,
    type: 'tiktok',
    service_type: 'followers', // <--- Agregado
    icon: 'users'
  },
  {
    id: 'tt-followers-10k',
    name: '10,000 Seguidores TikTok',
    price: 245.00,
    provider_id: 0,
    provider_quantity: 10000,
    type: 'tiktok',
    service_type: 'followers', // <--- Agregado
    icon: 'users',
    label: 'Pack Influencer'
  },
  // Extras TikTok
  {
    id: 'tt-likes-1k',
    name: '1,000 Likes TikTok',
    price: 9.00,
    provider_id: 0,
    provider_quantity: 1000,
    type: 'tiktok',
    service_type: 'likes', // <--- Diferente tipo
    icon: 'heart'
  },
  {
    id: 'tt-views-10k',
    name: '10,000 Vistas Video',
    price: 5.00,
    provider_id: 0,
    provider_quantity: 10000,
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
    id: 'kick-viewers-100',
    name: '100 Viewers (1 Hora)',
    price: 35.00,
    provider_id: 0,
    provider_quantity: 100,
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