'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Package, Sparkles, Check, Crown, Rocket, Sprout, Globe } from 'lucide-react';
import { Product } from '@/lib/products';

// =============================================
// DATOS DE PAQUETES
// =============================================

type PackagePlatform = 'tiktok' | 'instagram' | 'youtube' | 'facebook' | 'multi';
type PackageTier = 'starter' | 'growth' | 'premium' | 'multi';

interface GrowthPackage {
  id: string;
  name: string;
  platform: PackagePlatform;
  tier: PackageTier;
  price: number;
  originalPrice: number;
  savingsPercent: number;
  posts: number;
  features: string[];
  description: string;
  highlight?: boolean;
}

const PACKAGES: GrowthPackage[] = [
  // =========================================
  // TIKTOK
  // =========================================
  {
    id: 'pack-tt-starter',
    name: 'Despegue TikTok',
    platform: 'tiktok',
    tier: 'starter',
    price: 129.90,
    originalPrice: 175,
    savingsPercent: 26,
    posts: 5,
    features: [
      '1,000 Seguidores',
      '200 Likes por post',
      '1,000 Vistas por post',
    ],
    description: 'Ideal para empezar a crecer en TikTok con impulso real.',
  },
  {
    id: 'pack-tt-growth',
    name: 'Influencer TikTok',
    platform: 'tiktok',
    tier: 'growth',
    price: 519.90,
    originalPrice: 690,
    savingsPercent: 25,
    posts: 10,
    features: [
      '5,000 Seguidores',
      '500 Likes por post',
      '5,000 Vistas por post',
    ],
    description: 'Para creadores activos que publican casi a diario.',
    highlight: true,
  },
  {
    id: 'pack-tt-premium',
    name: 'Viral TikTok',
    platform: 'tiktok',
    tier: 'premium',
    price: 929.90,
    originalPrice: 1250,
    savingsPercent: 26,
    posts: 15,
    features: [
      '10,000 Seguidores',
      '1,000 Likes por post',
      '10,000 Vistas por post',
    ],
    description: 'Crecimiento explosivo para creadores full-time.',
  },

  // =========================================
  // INSTAGRAM
  // =========================================
  {
    id: 'pack-ig-starter',
    name: 'Despegue Instagram',
    platform: 'instagram',
    tier: 'starter',
    price: 54.90,
    originalPrice: 70,
    savingsPercent: 22,
    posts: 5,
    features: [
      '1,000 Seguidores',
      '200 Likes por publicación',
    ],
    description: 'Perfecto para creadores de fotos y carousels que empiezan.',
  },
  {
    id: 'pack-ig-growth',
    name: 'Influencer Instagram',
    platform: 'instagram',
    tier: 'growth',
    price: 299.90,
    originalPrice: 400,
    savingsPercent: 25,
    posts: 10,
    features: [
      '5,000 Seguidores',
      '500 Likes por publicación',
      '5,000 Vistas por Reel',
    ],
    description: 'Likes para cualquier publicación + Vistas para tus Reels.',
    highlight: true,
  },
  {
    id: 'pack-ig-premium',
    name: 'Marca Instagram',
    platform: 'instagram',
    tier: 'premium',
    price: 549.90,
    originalPrice: 865,
    savingsPercent: 36,
    posts: 15,
    features: [
      '10,000 Seguidores',
      '1,000 Likes por publicación',
      '10,000 Vistas por Reel',
    ],
    description: 'Domina Instagram como una marca profesional.',
  },

  // =========================================
  // YOUTUBE
  // =========================================
  {
    id: 'pack-yt-starter',
    name: 'Despegue YouTube',
    platform: 'youtube',
    tier: 'starter',
    price: 69.90,
    originalPrice: 95,
    savingsPercent: 26,
    posts: 5,
    features: [
      '250 Suscriptores',
      '500 Views por video',
      '100 Likes por video',
    ],
    description: 'Da el primer paso hacia la monetización.',
  },
  {
    id: 'pack-yt-growth',
    name: 'YouTuber Pro',
    platform: 'youtube',
    tier: 'growth',
    price: 279.90,
    originalPrice: 400,
    savingsPercent: 30,
    posts: 10,
    features: [
      '1,000 Suscriptores',
      '1,000 Views por video',
      '200 Likes por video',
    ],
    description: 'Crecimiento constante para YouTubers activos.',
    highlight: true,
  },
  {
    id: 'pack-yt-premium',
    name: 'Monetización YouTube',
    platform: 'youtube',
    tier: 'premium',
    price: 399.90,
    originalPrice: 570,
    savingsPercent: 30,
    posts: 10,
    features: [
      '1,000 Suscriptores',
      '2,000 Views por video',
      '200 Likes por video',
      '100 Horas de Watchtime',
    ],
    description: 'Todo lo que necesitas para acercarte a los requisitos de Partner.',
  },

  // =========================================
  // FACEBOOK
  // =========================================
  {
    id: 'pack-fb-starter',
    name: 'Despegue Facebook',
    platform: 'facebook',
    tier: 'starter',
    price: 49.90,
    originalPrice: 65,
    savingsPercent: 23,
    posts: 5,
    features: [
      '500 Seguidores de Página',
      '200 Likes por post',
    ],
    description: 'Impulsa tu Fanpage desde cero.',
  },
  {
    id: 'pack-fb-growth',
    name: 'Fanpage Pro',
    platform: 'facebook',
    tier: 'growth',
    price: 179.90,
    originalPrice: 250,
    savingsPercent: 28,
    posts: 10,
    features: [
      '5,000 Seguidores de Página',
      '500 Likes por post',
    ],
    description: 'Haz crecer tu comunidad en Facebook con fuerza.',
    highlight: true,
  },

  // =========================================
  // MULTI-PLATAFORMA
  // =========================================
  {
    id: 'pack-multi-360',
    name: 'Creador 360',
    platform: 'multi',
    tier: 'growth',
    price: 289.90,
    originalPrice: 380,
    savingsPercent: 24,
    posts: 10,
    features: [
      '1,000 Seguidores TikTok',
      '1,000 Seguidores Instagram',
      '500 Likes por post (ambas)',
      '2,000 Vistas por post (ambas)',
    ],
    description: 'Crece en TikTok e Instagram al mismo tiempo. 5 posts por red.',
    highlight: true,
  },
];

const PLATFORM_TABS: { id: PackagePlatform; label: string; color: string }[] = [
  { id: 'tiktok', label: 'TikTok', color: 'bg-black text-white' },
  { id: 'instagram', label: 'Instagram', color: 'bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 text-white' },
  { id: 'youtube', label: 'YouTube', color: 'bg-red-600 text-white' },
  { id: 'facebook', label: 'Facebook', color: 'bg-blue-600 text-white' },
  { id: 'multi', label: '🌐 Multi', color: 'bg-[#ccff00] text-black border-2 border-black' },
];

const TIER_CONFIG: Record<PackageTier, { icon: any; gradient: string; border: string }> = {
  starter: {
    icon: Sprout,
    gradient: 'bg-[#111]',
    border: 'border-[#333]',
  },
  growth: {
    icon: Rocket,
    gradient: 'bg-[#111]',
    border: 'border-[#333]',
  },
  premium: {
    icon: Crown,
    gradient: 'bg-[#111]',
    border: 'border-[#ccff00]',
  },
  multi: {
    icon: Rocket,
    gradient: 'bg-[#111]',
    border: 'border-[#ccff00]',
  },
};

// =============================================
// COMPONENTE
// =============================================

interface GrowthPackagesProps {
  onOpenYapeModal: (product: Product, link: string) => void;
}

export function GrowthPackages({ onOpenYapeModal }: GrowthPackagesProps) {
  const [activePlatform, setActivePlatform] = useState<PackagePlatform>('tiktok');
  const [packageLinks, setPackageLinks] = useState<Record<string, string>>({});
  const [expandedPackage, setExpandedPackage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 4000);
  };

  const filteredPackages = PACKAGES.filter(p => p.platform === activePlatform);

  const handlePayment = (pkg: GrowthPackage) => {
    const link = packageLinks[pkg.id];
    if (!link || link.length < 3) {
      showError('Por favor ingresa el enlace de tu perfil.');
      return;
    }

    const productForModal: Product = {
      id: pkg.id,
      name: pkg.name,
      price: pkg.price,
      provider_id: 0,
      provider_quantity: 1,
      type: 'instagram',
      service_type: 'followers',
      icon: 'package',
    };

    onOpenYapeModal(productForModal, link);
  };

  return (
    <section className="relative py-24 overflow-hidden" id="paquetes">
      <div className="container mx-auto max-w-6xl px-4 relative z-10">
        {/* Header - Brutalist style */}
        <div className="text-center mb-16">
          <div className="inline-block border-2 border-[#333] px-4 py-1.5 mb-6">
            <span className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">
              Paquetes Todo-en-Uno
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 uppercase tracking-tight">
            Crecimiento <span className="text-[#ccff00]">Acelerado</span>
          </h2>

          <p className="text-zinc-400 max-w-lg mx-auto text-sm sm:text-base font-medium">
            Un solo pago. Resultados reales. Envíanos tu link y nosotros hacemos el resto.
          </p>
        </div>

        {/* Platform Tabs - Solid blocks */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {PLATFORM_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActivePlatform(tab.id);
                setExpandedPackage(null);
              }}
              className={`relative px-6 py-3 text-sm font-bold uppercase tracking-wider transition-colors border-2 ${
                activePlatform === tab.id
                  ? 'border-[#ccff00] bg-[#ccff00] text-black'
                  : 'border-[#333] bg-[#111] text-zinc-500 hover:text-white hover:border-zinc-500'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Package Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePlatform}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`grid gap-6 ${
              filteredPackages.length <= 2
                ? 'sm:grid-cols-2 max-w-3xl mx-auto'
                : 'sm:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {filteredPackages.map((pkg, index) => {
              const isExpanded = expandedPackage === pkg.id;

              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative group bg-[#0a0a0a] border-2 p-8 transition-colors ${
                    pkg.highlight
                      ? 'border-[#ccff00]'
                      : 'border-[#222] hover:border-[#444]'
                  }`}
                >
                  {/* Highlight badge - Solid block */}
                  {pkg.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 bg-[#ccff00] px-4 py-1">
                      <span className="text-[10px] font-black text-black uppercase tracking-widest">
                        Recomendado
                      </span>
                    </div>
                  )}

                  {/* Tier + name */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="mb-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                          {pkg.tier === 'starter' ? 'Nivel 1' : pkg.tier === 'growth' ? 'Nivel 2' : 'Nivel 3'}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-white uppercase tracking-tight">{pkg.name}</h3>
                    </div>

                    {/* Savings badge */}
                    <div className="flex flex-col items-end">
                      <span className="inline-flex items-center rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                        -{pkg.savingsPercent}%
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">{pkg.description}</p>

                  {/* Features list */}
                  <div className="space-y-2 mb-5">
                    {pkg.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-purple-500/20">
                          <Check size={10} className="text-purple-400" />
                        </div>
                        <span className="text-sm text-slate-300">{feature}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 pt-1">
                      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-700/50">
                        <Check size={8} className="text-slate-500" />
                      </div>
                      <span className="text-xs text-slate-500">
                        Válido para <strong className="text-slate-400">{pkg.posts} publicaciones</strong>
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-5">
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-black text-white">
                        S/ {pkg.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-slate-500 line-through">
                        S/ {pkg.originalPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1">
                      <span className="text-xs font-bold text-emerald-400">
                        🔥 Ahorras S/ {(pkg.originalPrice - pkg.price).toFixed(2)}
                      </span>
                      <span className="text-[10px] text-emerald-500/70">
                        vs compra individual
                      </span>
                    </div>
                  </div>

                  {/* CTA / Expanded */}
                  {!isExpanded ? (
                    <button
                      onClick={() => setExpandedPackage(pkg.id)}
                      className={`w-full py-4 text-sm font-black uppercase tracking-widest transition-transform hover:-translate-y-1 active:translate-y-0 ${
                        pkg.highlight
                          ? 'bg-[#ccff00] text-black shadow-[4px_4px_0px_white]'
                          : 'bg-[#222] text-white hover:bg-[#333]'
                      }`}
                    >
                      Elegir Plan
                    </button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-[10px] font-black text-zinc-500 mb-2 uppercase tracking-wider">
                          Enlace de tu perfil
                        </label>
                        <input
                          type="text"
                          placeholder="https://tiktok.com/@tu_perfil"
                          value={packageLinks[pkg.id] || ''}
                          onChange={(e) =>
                            setPackageLinks({ ...packageLinks, [pkg.id]: e.target.value })
                          }
                          className="w-full bg-[#111] border-2 border-[#333] py-3 px-4 text-sm text-white placeholder:text-zinc-600 focus:border-[#ccff00] focus:outline-none transition-colors rounded-none"
                          autoFocus
                        />
                      </div>

                      <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">
                        Envíanos el link de cualquier publicación (nueva o antigua) por WhatsApp y activamos tu boost. Tú decides cuáles boostear.
                      </p>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setExpandedPackage(null)}
                          className="px-4 py-3 text-sm font-black text-zinc-500 hover:text-white uppercase tracking-wider"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => handlePayment(pkg)}
                          className="flex-1 flex items-center justify-center gap-2 bg-[#752384] text-white font-black py-3 hover:-translate-y-1 active:translate-y-0 uppercase tracking-wider transition-transform text-sm shadow-[4px_4px_0px_white]"
                        >
                          Yapear
                        </button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs text-slate-500 mt-8 max-w-md mx-auto"
        >
          Todos los paquetes se procesan manualmente vía Yape. Los seguidores se entregan al activar.
          Likes y vistas se activan cuando nos envíes el link de la publicación.
        </motion.p>
      </div>

      {/* Error toast */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className="fixed top-20 left-1/2 z-[100] flex w-[90%] max-w-sm items-center gap-3 bg-[#ff0000] p-4 text-white shadow-[8px_8px_0px_black] border-2 border-black uppercase font-black tracking-widest"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-black/20 border-2 border-black">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <p className="text-sm font-medium leading-snug">{errorMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
