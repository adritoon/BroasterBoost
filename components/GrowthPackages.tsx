'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Package, Sparkles, Check, Crown, Rocket, Sprout, Globe } from 'lucide-react';
import { Product } from '@/lib/products';

// =============================================
// DATOS DE PAQUETES
// =============================================

type PackagePlatform = 'tiktok' | 'instagram' | 'youtube' | 'facebook' | 'multi';
type PackageTier = 'starter' | 'growth' | 'premium';

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
    price: 59.90,
    originalPrice: 75,
    savingsPercent: 20,
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
    price: 249.90,
    originalPrice: 350,
    savingsPercent: 29,
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
    price: 449.90,
    originalPrice: 680,
    savingsPercent: 34,
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
    price: 249.90,
    originalPrice: 350,
    savingsPercent: 29,
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
  { id: 'tiktok', label: 'TikTok', color: 'from-black to-gray-700' },
  { id: 'instagram', label: 'Instagram', color: 'from-pink-500 to-purple-500' },
  { id: 'youtube', label: 'YouTube', color: 'from-red-500 to-red-700' },
  { id: 'facebook', label: 'Facebook', color: 'from-blue-500 to-blue-700' },
  { id: 'multi', label: '🌐 Multi', color: 'from-indigo-500 to-purple-600' },
];

const TIER_CONFIG: Record<PackageTier, { icon: any; gradient: string; border: string }> = {
  starter: {
    icon: Sprout,
    gradient: 'from-emerald-500/20 to-teal-500/10',
    border: 'border-emerald-500/30',
  },
  growth: {
    icon: Rocket,
    gradient: 'from-blue-500/20 to-purple-500/10',
    border: 'border-blue-500/30',
  },
  premium: {
    icon: Crown,
    gradient: 'from-amber-500/20 to-orange-500/10',
    border: 'border-amber-500/30',
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
    <section className="relative py-20 overflow-hidden" id="paquetes">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-6xl px-4 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/20 px-4 py-1.5 mb-4"
          >
            <Package size={14} className="text-purple-400" />
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">
              Paquetes para Creadores
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-white mb-3"
          >
            Paquetes de{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              Crecimiento
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 max-w-lg mx-auto text-sm sm:text-base"
          >
            Todo en un solo pago. Envíanos el link de la publicación que quieras boostear y lo activamos.
          </motion.p>
        </div>

        {/* Platform Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {PLATFORM_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActivePlatform(tab.id);
                setExpandedPackage(null);
              }}
              className={`relative rounded-full px-5 py-2 text-sm font-medium transition-all ${
                activePlatform === tab.id
                  ? 'text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {activePlatform === tab.id && (
                <motion.div
                  layoutId="activePackTab"
                  className={`absolute inset-0 z-0 rounded-full bg-gradient-to-r ${tab.color}`}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
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
              const tierConfig = TIER_CONFIG[pkg.tier];
              const TierIcon = tierConfig.icon;
              const isExpanded = expandedPackage === pkg.id;

              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative group rounded-2xl border bg-gradient-to-br ${tierConfig.gradient} backdrop-blur-sm p-6 transition-all duration-300 ${
                    pkg.highlight
                      ? `${tierConfig.border} ring-1 ring-purple-500/20 shadow-lg shadow-purple-500/5`
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Highlight badge */}
                  {pkg.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider shadow-lg">
                        <Sparkles size={10} />
                        Más Popular
                      </div>
                    </div>
                  )}

                  {/* Tier icon + name */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-white/10`}>
                          <TierIcon size={16} className="text-white" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            {pkg.tier === 'starter' ? 'Despegue' : pkg.tier === 'growth' ? 'Crecimiento' : 'Premium'}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-white">{pkg.name}</h3>
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
                      className={`w-full rounded-xl font-bold py-3 transition-all text-sm ${
                        pkg.highlight
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/20'
                          : 'bg-white/10 text-white hover:bg-white/15 hover:scale-[1.02] active:scale-[0.98]'
                      }`}
                    >
                      Elegir Plan
                    </button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-3"
                    >
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                          Enlace de tu perfil
                        </label>
                        <input
                          type="text"
                          placeholder="https://tiktok.com/@tu_perfil"
                          value={packageLinks[pkg.id] || ''}
                          onChange={(e) =>
                            setPackageLinks({ ...packageLinks, [pkg.id]: e.target.value })
                          }
                          className="w-full rounded-lg bg-slate-950 border border-slate-700 py-2.5 px-3 text-sm text-white placeholder:text-slate-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                          autoFocus
                        />
                      </div>

                      <p className="text-[10px] text-slate-500 leading-relaxed">
                        📲 Envíanos el link de cualquier publicación (nueva o antigua) por WhatsApp y activamos tu boost. Tú decides cuáles boostear.
                      </p>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setExpandedPackage(null)}
                          className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => handlePayment(pkg)}
                          className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#752384] text-white font-bold py-2.5 hover:bg-[#8e2aa0] hover:scale-[1.02] active:scale-[0.98] transition-all text-sm shadow-lg shadow-[#752384]/20"
                        >
                          <MessageCircle size={16} />
                          Yapear y Activar
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
            className="fixed top-20 left-1/2 z-[100] flex w-[90%] max-w-sm items-center gap-3 rounded-2xl bg-red-500/90 p-4 text-white shadow-2xl backdrop-blur-md border border-red-400"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20">
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
