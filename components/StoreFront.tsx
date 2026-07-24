'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { 
  Instagram, Music, Headphones, Bookmark, Play, Facebook, Youtube, Gamepad2, Heart, Eye, 
  MessageCircle, Share2, Users, Swords, Clock, ThumbsUp, ShoppingCart, Link as LinkIcon,
  Minus, Plus, Repeat 
} from 'lucide-react';
import { PRODUCTS, CATEGORIES, Product, ProductType, ServiceType, MAINTENANCE_SUBCATEGORIES, getYouTubeCommentPrice, serviceLabels, getSeoMetadataForService } from '@/lib/products';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { FAQSection } from '@/components/FAQSection';
import { HowItWorks } from '@/components/HowItWorks';
import { SeoContent } from '@/components/SeoContent';
import { PremiumServices } from '@/components/PremiumServices';
import { GrowthPackages } from '@/components/GrowthPackages';
import { CustomPackBuilder } from '@/components/CustomPackBuilder';
import { CustomQuantityCard } from '@/components/CustomQuantityCard';
import { PromoBanner } from '@/components/PromoBanner';
import Image from 'next/image';

// --- CONFIGURACIÓN ---
if (process.env.NEXT_PUBLIC_MP_PUBLIC_KEY) {
  initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY, { locale: 'es-PE' });
}

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '51999999999';

const iconMap: Record<string, any> = {
  instagram: Instagram, music: Music, plays: Play, listeners: Headphones, saves: Bookmark, facebook: Facebook, youtube: Youtube,
  'gamepad-2': Gamepad2, heart: Heart, eye: Eye, 'message-circle': MessageCircle,
  'share-2': Share2, users: Users, sword: Swords, clock: Clock, 'thumbs-up': ThumbsUp,
  repeat: Repeat
};

export function StoreFront({ initialCategory = 'tiktok', initialService = 'followers' }: { initialCategory?: ProductType, initialService?: ServiceType }) {
  // --- ESTADOS ---
  const [activeCategory, setActiveCategory] = useState<ProductType>(initialCategory);
  const [activeService, setActiveService] = useState<ServiceType>(initialService);
  
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [targetLink, setTargetLink] = useState('');
  const [isPublicConfirmed, setIsPublicConfirmed] = useState(false);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // --- ESTADOS PARA COMENTARIOS PERSONALIZADOS ---
  const [customQuantity, setCustomQuantity] = useState(5);
  const [customQuantityInput, setCustomQuantityInput] = useState('5');
  const [customComments, setCustomComments] = useState<string[]>(['', '', '', '', '']);
  const [manualTotalPrice, setManualTotalPrice] = useState<number | null>(null);

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 4000);
  };

  // --- FUNCIÓN PUENTE PARA COMPONENTES HIJOS ---
  const handleOpenModalFromChild = (product: Product, link: string) => {
    setTargetLink(link); // Guardamos el link en el estado general
    setManualProduct(product); // Guardamos el producto
    setShowYapeModal(true); // Abrimos el modal
  };

  const [showYapeModal, setShowYapeModal] = useState(false);
  const [manualProduct, setManualProduct] = useState<Product | null>(null);

  // --- LÓGICA DE FILTROS ---
  const productsByCategory = PRODUCTS.filter(p => p.type === activeCategory);
  const rawServices = Array.from(new Set(productsByCategory.map(p => p.service_type)));
  // Agregar pestaña "Arma tu Pack" si hay 2+ tipos de servicio combinables
  const builderEligible = rawServices.filter(s => !['streaming_chat', 'pkbattle'].includes(s));
  const availableServices = builderEligible.length >= 2
    ? [...rawServices, 'custom_pack' as ServiceType]
    : rawServices;
  const finalProducts = productsByCategory.filter(p => p.service_type === activeService);

  const handleCategoryChange = (cat: ProductType) => {
    setActiveCategory(cat);
    setSelectedProductId(null);
    setPreferenceId(null);
    setTargetLink('');
    setCustomQuantity(5);
    setCustomQuantityInput('5');
    setCustomComments(['', '', '', '', '']);
    const firstService = PRODUCTS.find(p => p.type === cat)?.service_type || 'followers';
    setActiveService(firstService);
    
    // Sincronizar URL silenciosamente con el nombre original en inglés
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `/${cat}/${firstService}`);
    }
  };

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const isValidCategory = CATEGORIES.some(c => c.id === hash);
      const isMaintenance = CATEGORIES.find(c => c.id === hash)?.status === 'maintenance';
      if (isValidCategory && !isMaintenance) {
        handleCategoryChange(hash as ProductType);
      }
    } else {
      const params = new URLSearchParams(window.location.search);
      const categoryParam = params.get('categoria') || params.get('category');
      if (categoryParam) {
        const isValidCategory = CATEGORIES.some(c => c.id === categoryParam);
        const isMaintenance = CATEGORIES.find(c => c.id === categoryParam)?.status === 'maintenance';
        if (isValidCategory && !isMaintenance) {
          handleCategoryChange(categoryParam as ProductType);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Actualizar el título de la página dinámicamente al navegar por pestañas
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const capitalize = (s: string) => {
        if (!s) return '';
        return s.charAt(0).toUpperCase() + s.slice(1);
      };
      const networkName = capitalize(activeCategory);
      const { titleServiceName } = getSeoMetadataForService(activeService);
      document.title = `Comprar ${titleServiceName} para ${networkName} en Perú | SocialBoost`;
    }
  }, [activeCategory, activeService]);

  const handleSelectProduct = (id: string) => {
    if (selectedProductId === id) return;
    setSelectedProductId(id);
    setPreferenceId(null);
    setTargetLink('');
    setIsPublicConfirmed(false);
    setCustomQuantity(5);
    setCustomQuantityInput('5');
    setCustomComments(['', '', '', '', '']);
  };

  // --- HELPERS PARA CANTIDAD PERSONALIZADA ---
  const handleQuantityChange = (newQty: number, product: Product) => {
    const min = product.minQuantity || 5;
    const max = product.maxQuantity || 100;
    const clamped = Math.max(min, Math.min(max, newQty));
    setCustomQuantity(clamped);
    setCustomQuantityInput(String(clamped));
    // Ajustar array de comentarios
    setCustomComments(prev => {
      if (clamped > prev.length) {
        return [...prev, ...Array(clamped - prev.length).fill('')];
      }
      return prev.slice(0, clamped);
    });
  };

  // Permite escribir libremente sin clampear (para poder escribir "10", "50", etc.)
  const handleQuantityInputChange = (value: string) => {
    // Solo permitir dígitos
    const cleaned = value.replace(/\D/g, '');
    setCustomQuantityInput(cleaned);
  };

  // Al salir del campo, clampear al rango válido
  const handleQuantityInputBlur = (product: Product) => {
    const parsed = parseInt(customQuantityInput);
    const min = product.minQuantity || 5;
    const max = product.maxQuantity || 100;
    if (isNaN(parsed) || parsed < min) {
      handleQuantityChange(min, product);
    } else if (parsed > max) {
      handleQuantityChange(max, product);
    } else {
      handleQuantityChange(parsed, product);
    }
  };

  const updateComment = (index: number, value: string) => {
    setCustomComments(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  // --- LÓGICA MERCADO PAGO ---
  const handleCreatePayment = async (product: Product) => {
    if (!targetLink || targetLink.length < 3) {
      showError("Por favor ingresa un enlace válido (ej: usuario o link del video).");
      return;
    }
    if (!isPublicConfirmed) {
      showError("Por favor, confirma que tu perfil es público y el enlace es correcto marcando la casilla correspondiente.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          productId: product.id,
          targetLink: targetLink 
        }),
      });
      const data = await response.json();
      if (data.preferenceId) setPreferenceId(data.preferenceId);
    } catch (error) {
      console.error(error);
      showError("Error al conectar con Mercado Pago");
    } finally {
      setLoading(false);
    }
  };

  


  // --- LÓGICA YAPE MANUAL ---
  const handleManualPayment = (product: Product) => {
    if (!targetLink || targetLink.length < 3) {
      showError("Por favor ingresa tu enlace primero.");
      return;
    }
    if (!isPublicConfirmed) {
      showError("Por favor, confirma que tu perfil es público y el enlace es correcto marcando la casilla correspondiente.");
      return;
    }
    // Validar comentarios si es producto con comentarios personalizados
    if (product.requiresComments) {
      const filledComments = customComments.filter(c => c.trim().length > 0);
      if (filledComments.length < customQuantity) {
        showError(`Por favor escribe los ${customQuantity} comentarios. Faltan ${customQuantity - filledComments.length}.`);
        return;
      }
      // Guardar el precio calculado para el modal
      const { total } = getYouTubeCommentPrice(customQuantity);
      setManualTotalPrice(total);
    } else {
      setManualTotalPrice(null);
    }
    setManualProduct(product);
    setShowYapeModal(true);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#ccff00] selection:text-black relative overflow-hidden">
      
      {/* NEO-BRUTALIST GRID BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '32px 32px' }} aria-hidden="true" />

      {/* BANNER DE PROMOCIÓN — fixed at very top */}
      <div className="relative z-[51]">
        <PromoBanner />
      </div>

      {/* HEADER - Solid dark, no glassmorphism */}
      <header className="sticky top-0 z-50 w-full border-b border-[#222] bg-[#050505]">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-[#ccff00]" />
            <span className="text-xl font-bold tracking-tight text-white uppercase">SocialBoost Perú</span>
          </div>
        </div>
      </header>

      {/* HERO SECTION - Direct, Bold, High Contrast */}
      <section className="relative pt-24 pb-16 px-4 text-center">
        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Main heading */}
          <h1 className="animate-fade-in-up text-5xl font-black tracking-tighter sm:text-7xl lg:text-8xl uppercase leading-none" style={{animationDelay: '100ms'}}>
            Más Seguidores.
            <br />
            <span className="text-[#ccff00]">Resultados Reales.</span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in-up mt-8 text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto font-medium" style={{animationDelay: '200ms'}}>
            Servicios reales para TikTok, Instagram y YouTube desde S/ 2. 
            Entrega inmediata. <span className="text-white">Sin pedir contraseñas.</span>
          </p>

          {/* CTAs - Solid blocks, no gradients */}
          <div className="animate-fade-in-up mt-10 flex flex-col sm:flex-row items-center justify-center gap-4" style={{animationDelay: '300ms'}}>
            <button
              onClick={() => {
                document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto bg-[#ccff00] text-black px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-[#b3e600] active:scale-95 transition-transform"
            >
              Ver Servicios
            </button>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola,%20quiero%20información%20sobre%20los%20servicios%20de%20SocialBoost.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-[#111] border border-[#333] text-white px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-[#222] active:scale-95 transition-transform"
            >
              Contactar
            </a>
          </div>

          {/* Trust Badges - Text only, clean layout */}
          <div className="animate-fade-in-up mt-10 sm:mt-16 flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs sm:text-sm font-bold text-zinc-500 uppercase tracking-widest" style={{animationDelay: '400ms'}}>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-[#ccff00]"></span>
              Entrega Inmediata
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-[#ccff00]"></span>
              Garantía 30 días
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-[#ccff00]"></span>
              Privacidad Total
            </div>
          </div>

          {/* Payment logos — Minimal */}
          <div className="animate-fade-in-up mt-8 sm:mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row" style={{animationDelay: '500ms'}}>
            <span className="text-[10px] sm:text-xs font-bold text-zinc-600 uppercase tracking-widest">
              Métodos de Pago
            </span>
            <div className="flex items-center gap-6 transition-all duration-300">
              <Image src="/yapelogo.png" alt="Yape" width={35} height={35} className="h-7 w-auto object-contain" />
              <Image src="/plinlogo.png" alt="Plin" width={35} height={35} className="h-7 w-auto object-contain" />
              <Image src="/visalogo.png" alt="Visa" width={40} height={40} className="h-5 w-auto object-contain" />
              <Image src="/mastercardlogo.png" alt="Mastercard" width={40} height={40} className="h-5 w-auto object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section id="catalogo" className="container mx-auto px-4 pb-6 scroll-mt-20 relative z-10">
        {/* CORRECCIÓN SEO: Título invisible para mantener orden H1 -> H2 */}
        <h2 className="sr-only">Selecciona una Red Social</h2> 
        
        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => {
            const isCatUnavailable = cat.status === 'maintenance';
            return (
              <button
                key={cat.id}
                onClick={() => !isCatUnavailable && handleCategoryChange(cat.id as ProductType)}
                disabled={isCatUnavailable}
                className={cn(
                  "relative px-6 py-2 text-sm font-black uppercase tracking-wider transition-all border-2",
                  isCatUnavailable ? "opacity-50 grayscale cursor-not-allowed border-zinc-700 bg-[#111]" : 
                  activeCategory === cat.id ? `${cat.color} border-current` : "text-zinc-500 border-[#333] bg-[#111] hover:text-white hover:border-zinc-500"
                )}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {cat.label}
                  {isCatUnavailable && <span className="ml-1 text-xs">⚙️</span>}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* SUB-FILTROS (SERVICIOS) */}
      <section className="container mx-auto px-4 pb-12 relative z-10">
        <div className="flex justify-center">
          <div className="flex flex-wrap justify-center gap-2 bg-[#050505] p-2 border-2 border-[#333]">
            {availableServices.map((service) => {
              const activeCategoryObj = CATEGORIES.find(c => c.id === activeCategory);
              const isServiceUnavailable = MAINTENANCE_SUBCATEGORIES.some(
                m => m.type === activeCategory && m.service_type === service
              );
              return (
              <button
                key={service}
                onClick={() => {
                  setActiveService(service);
                  setSelectedProductId(null);
                  if (typeof window !== 'undefined') {
                    window.history.replaceState(null, '', `/${activeCategory}/${service}`);
                  }
                }}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase tracking-wider transition-colors border-2",
                  isServiceUnavailable && "opacity-75 grayscale border-[#333] bg-[#111]",
                  activeService === service 
                    ? (activeCategoryObj ? `${activeCategoryObj.color} border-current` : "bg-white text-black border-white") 
                    : "text-zinc-500 border-transparent hover:text-white hover:border-[#555] bg-[#111]" 
                )}
              >
                {serviceLabels[service]}
                {isServiceUnavailable && <span className="text-[10px]">⚙️</span>}
              </button>
            )})}
          </div>
        </div>
      </section>


      {/* GRID PRODUCTOS */}
      <section className="container mx-auto max-w-6xl px-4 pb-24 relative z-10">
        {/* CORRECCIÓN SEO: Otro título invisible para estructura */}
        <h2 className="sr-only">Catálogo de Servicios</h2>

        {/* AVISO CHAT: Solo visible en servicios En Vivo + Chat */}
        {activeService === 'streaming_chat' && (
          <div className="mb-6 flex items-start gap-3 rounded-xl bg-amber-500/10 border border-amber-500/20 p-4">
            <span className="text-lg mt-0.5">⚠️</span>
            <p className="text-sm text-amber-200/90 leading-relaxed">
              <strong className="text-amber-400">Importante:</strong> El chat de tu stream <strong>no debe estar en modo "Solo seguidores"</strong> ni restringido. 
              Debe estar abierto para que los bots puedan comentar durante la transmisión.
            </p>
          </div>
        )}

        {activeService === 'custom_pack' ? (
          <CustomPackBuilder key={activeCategory} activeCategory={activeCategory} />
        ) : (
          <>
          <AnimatePresence mode='wait'>
            <motion.div 
              key={`${activeCategory}-${activeService}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15, transition: { duration: 0.15 } }}
              transition={{ duration: 0.2 }}
              className={cn("grid gap-4", finalProducts.length === 1 ? "max-w-md mx-auto" : "sm:grid-cols-2 lg:grid-cols-3")}
            >

            {finalProducts.map((product) => {
              const Icon = iconMap[product.icon] || Users;
              const isSelected = selectedProductId === product.id;
              const isUnavailable = product.status === 'out_of_stock' || product.status === 'maintenance';

              return (
                <motion.div
                  key={product.id}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    borderColor: isSelected ? '#ccff00' : 'rgba(255,255,255,0.1)' 
                  }}
                  className={cn(
                    "group relative overflow-hidden border-2 bg-[#111] p-6 transition-all flex flex-col h-full",
                    isSelected ? "border-[#ccff00]" : "hover:border-[#555] border-[#333]",
                    isUnavailable ? "opacity-90 grayscale-[20%] border-[#222]" : ""
                  )}
                >
                  {isUnavailable ? (
                    <div className={cn(
                      "absolute right-0 top-0 px-3 py-1 text-xs font-black uppercase tracking-widest text-white border-l-2 border-b-2",
                      product.status === 'out_of_stock' ? "bg-red-500 border-red-600" : "bg-zinc-600 border-zinc-700"
                    )}>
                      {product.status === 'out_of_stock' ? 'AGOTADO' : 'MANTENIMIENTO'}
                    </div>
                  ) : product.popular && (
                    <div className="absolute right-0 top-0 bg-[#ccff00] text-black border-l-2 border-b-2 border-black px-3 py-1 text-xs font-black uppercase tracking-widest shadow-[-2px_2px_0px_white]">POPULAR</div>
                  )}

                  {/* Encabezado Producto */}
                  <div className="flex justify-between items-start">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center bg-[#222] border-2 border-[#333]">
                      <Icon className="text-zinc-400" size={28} />
                    </div>
                    <div className="text-right">
                      {product.isCustomQuantity ? (
                        <>
                          <span className="text-sm text-slate-400">Desde</span>
                          <span className="text-2xl font-bold text-white ml-1">S/ {product.price.toFixed(2)}</span>
                          <span className="text-xs text-slate-400 block">por comentario</span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-white">S/ {product.price.toFixed(2)}</span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-white uppercase tracking-wider">{product.name}</h3>
                  
                  {/* --- NUEVA SECCIÓN DE INFO --- */}
                  {/* Solo se muestra si el producto tiene speed o guarantee definidos */}
                  {(product.speed || product.guarantee) && (
                    <div className="mb-4 flex flex-col gap-1 text-xs text-slate-400">
                      {product.speed && (
                        <span className="flex items-center gap-1.5">
                          {product.speed} 
                        </span>
                      )}
                      {product.guarantee && (
                        <span className="flex items-center gap-1.5 text-emerald-400/80">
                          {product.guarantee}
                        </span>
                      )}
                    </div>
                  )}
                  {/* ----------------------------- */}

                  {/* ZONA DE COMPRA */}
                  <div className="mt-auto pt-6">
                    {isUnavailable ? (
                      <button 
                        disabled
                        className="w-full bg-[#222] text-zinc-500 border-2 border-[#333] font-black uppercase tracking-widest py-3 cursor-not-allowed transition-all text-sm"
                      >
                         {product.status === 'out_of_stock' ? 'AGOTADO 🔴' : 'MANTENIMIENTO ⚙️'}
                      </button>
                    ) : !isSelected ? (
                      <button 
                        onClick={() => handleSelectProduct(product.id)}
                        className="w-full bg-white text-black font-black uppercase tracking-widest py-4 hover:-translate-y-1 active:translate-y-0 transition-transform text-sm border-2 border-black shadow-[4px_4px_0px_#ccff00]"
                      >
                        Comprar
                      </button>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                      >
                        <div className="relative">
                          <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                          <input 
                            type="text" 
                            placeholder={
                              product.service_type === 'comments'
                              ? "Pega el link del video/publicación"
                              : product.service_type === 'retweets'
                              ? "Pega el link del tweet"
                              : product.service_type === 'likes' || product.service_type === 'views' 
                              ? "Pega el link del video/foto" 
                              : "Pega el link del perfil"
                            }
                            value={targetLink}
                            onChange={(e) => setTargetLink(e.target.value)}
                            className="w-full bg-[#111] border-2 border-[#333] py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-zinc-600 focus:border-[#ccff00] focus:outline-none transition-colors"
                            autoFocus
                          />
                        </div>

                        {/* --- SELECTOR DE CANTIDAD + COMENTARIOS PERSONALIZADOS --- */}
                        {product.isCustomQuantity && product.requiresComments && (() => {
                          const { pricePerUnit, total } = getYouTubeCommentPrice(customQuantity);
                          return (
                            <div className="space-y-3">
                              {/* Selector de cantidad */}
                              <div className="bg-[#050505] p-4 border-2 border-[#333]">
                                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4 block">Cantidad de comentarios</label>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleQuantityChange(customQuantity - 1, product)}
                                    disabled={customQuantity <= (product.minQuantity || 5)}
                                    className="flex h-12 w-12 items-center justify-center bg-[#222] text-white border-2 border-[#333] hover:border-[#ccff00] hover:text-[#ccff00] disabled:opacity-30 disabled:cursor-not-allowed transition-all shrink-0"
                                  >
                                    <Minus size={16} />
                                  </button>
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    value={customQuantityInput}
                                    onChange={(e) => handleQuantityInputChange(e.target.value)}
                                    onBlur={() => handleQuantityInputBlur(product)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleQuantityInputBlur(product); }}
                                    className="flex-1 min-w-0 text-center bg-[#050505] border-2 border-[#333] py-2.5 text-xl font-black text-white focus:border-[#ccff00] focus:outline-none focus:text-[#ccff00]"
                                  />
                                  <button
                                    onClick={() => handleQuantityChange(customQuantity + 1, product)}
                                    disabled={customQuantity >= (product.maxQuantity || 100)}
                                    className="flex h-12 w-12 items-center justify-center bg-[#222] text-white border-2 border-[#333] hover:border-[#ccff00] hover:text-[#ccff00] disabled:opacity-30 disabled:cursor-not-allowed transition-all shrink-0"
                                  >
                                    <Plus size={16} />
                                  </button>
                                </div>

                                {/* Tabla de precios degresivos — clickeable */}
                                <div className="mt-3 grid grid-cols-4 gap-1 text-[10px]">
                                  {[
                                    { range: '5-9', price: 1.00, min: 5, max: 9 },
                                    { range: '10-24', price: 0.80, min: 10, max: 24 },
                                    { range: '25-49', price: 0.60, min: 25, max: 49 },
                                    { range: '50+', price: 0.50, min: 50, max: 100 },
                                  ].map(tier => (
                                    <button
                                      key={tier.range}
                                      type="button"
                                      onClick={() => handleQuantityChange(tier.min, product)}
                                      className={cn(
                                        "px-2 py-1 text-center border-2 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0",
                                        customQuantity >= tier.min && customQuantity <= tier.max
                                          ? "bg-[#ccff00] border-[#ccff00] text-black shadow-[2px_2px_0px_white]"
                                          : "bg-[#222] border-[#333] text-zinc-500 hover:text-white hover:border-zinc-500"
                                      )}
                                    >
                                      <div className="font-bold">{tier.range}</div>
                                      <div>S/{tier.price.toFixed(2)}/c.u.</div>
                                    </button>
                                  ))}
                                </div>

                                {/* Precio total */}
                                <div className="mt-3 flex items-baseline justify-between border-t-2 border-[#333] pt-3">
                                  <span className="text-xs text-slate-400">{customQuantity} comentarios × S/ {pricePerUnit.toFixed(2)}</span>
                                  <span className="text-xl font-bold text-white">S/ {total.toFixed(2)}</span>
                                </div>
                              </div>

                              {/* Campos individuales de comentarios */}
                              <div className="bg-[#050505] p-4 border-2 border-[#333]">
                                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4 block">
                                  📝 Escribe tus {customQuantity} comentarios
                                </label>
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                                  {customComments.map((comment, index) => (
                                    <div key={index} className="flex items-start gap-2">
                                      <span className="mt-2 text-xs font-bold text-slate-500 w-5 shrink-0 text-right">{index + 1}.</span>
                                      <input
                                        type="text"
                                        placeholder={`Comentario ${index + 1}...`}
                                        value={comment}
                                        onChange={(e) => updateComment(index, e.target.value)}
                                        className="flex-1 bg-[#111] border-2 border-[#333] py-2 px-3 text-sm font-bold text-white placeholder:text-zinc-600 focus:border-[#ccff00] focus:outline-none focus:text-[#ccff00] transition-colors"
                                      />
                                    </div>
                                  ))}
                                </div>
                                <p className="mt-2 text-[10px] text-slate-500">
                                  {customComments.filter(c => c.trim()).length}/{customQuantity} comentarios escritos
                                </p>
                              </div>
                            </div>
                          );
                        })()}

                        {/* CHECKBOX CONFIRMACIÓN */}
                        <label className="flex items-center gap-3 mt-2 cursor-pointer group">
                          <div className="relative flex items-center justify-center shrink-0">
                            <input 
                              type="checkbox" 
                              checked={isPublicConfirmed}
                              onChange={(e) => setIsPublicConfirmed(e.target.checked)}
                              className="peer h-5 w-5 shrink-0 appearance-none border-2 border-[#333] bg-[#111] checked:border-[#ccff00] checked:bg-[#ccff00] focus:outline-none transition-all"
                            />
                            <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors leading-tight">
                            Confirmo que he ingresado el <b>enlace completo</b> y que mi perfil/video está <b>PÚBLICO</b>.
                            <Link href="/guia" target="_blank" className="text-[#ccff00] hover:text-[#b3e600] underline decoration-[#ccff00]/30 underline-offset-2 ml-1 inline-flex" onClick={(e) => e.stopPropagation()}>
                              (¿Por qué?)
                            </Link>
                          </span>
                        </label>

                        {preferenceId ? (
                           <div className="wallet-container">
                             <Wallet initialization={{ preferenceId }} />
                           </div>
                        ) : product.yapeOnly ? (
                          <div className="space-y-2">
                             <div className="flex gap-2">
                               <button 
                                onClick={() => setSelectedProductId(null)}
                                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5"
                               >
                                 Cancelar
                               </button>
                               <button
                                 onClick={() => handleManualPayment(product)}
                                 className="flex-1 flex items-center justify-center gap-2 bg-[#752384] text-white font-black py-4 hover:-translate-y-1 active:translate-y-0 uppercase tracking-widest transition-transform text-sm shadow-[4px_4px_0px_white]"
                               >
                                 <MessageCircle size={18} />
                                 Yapear Directo (QR)
                               </button>
                             </div>
                             <p className="text-xs text-center text-slate-500">Solo pago manual vía Yape/Plin</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                             <div className="flex gap-2">
                               <button 
                                onClick={() => setSelectedProductId(null)}
                                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5"
                               >
                                 Cancelar
                               </button>
                               <button 
                                 onClick={() => handleCreatePayment(product)}
                                 disabled={loading}
                                 className="flex-1 border-2 border-[#333] bg-[#111] text-zinc-400 font-black uppercase tracking-widest py-3 hover:border-[#ccff00] hover:text-[#ccff00] transition-colors disabled:opacity-50 text-sm"
                               >
                                 {loading ? 'Cargando...' : 'Pago Web'}
                               </button>
                             </div>

                             <button
                               onClick={() => handleManualPayment(product)}
                               className="w-full bg-[#752384] text-white font-black uppercase tracking-widest py-3.5 hover:-translate-y-1 active:translate-y-0 transition-transform shadow-[4px_4px_0px_white] text-sm"
                             >
                               Yapear Directo (QR)
                             </button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>

                </motion.div>
              );
            })}
            </motion.div>
          </AnimatePresence>

            {/* Tarjeta de cantidad exacta — fuera del grid para evitar overflow */}
            <div className="mt-4">
              <CustomQuantityCard activeCategory={activeCategory} activeService={activeService} />
            </div>
          </>
        )}
      </section>

      {/* --- SECCIÓN: PAQUETES DE CRECIMIENTO --- */}
      <GrowthPackages onOpenYapeModal={handleOpenModalFromChild} />
      
      {/* --- SECCIÓN: PRODUCTOS PREMIUM (SOLO YAPE) --- */}
      <PremiumServices onOpenYapeModal={handleOpenModalFromChild} />

      <HowItWorks />

      <FAQSection />

      <SeoContent />

      {/* --- MODAL YAPE MANUAL --- */}
      <AnimatePresence>
        {showYapeModal && manualProduct && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="w-full max-w-md bg-[#111] border-2 border-[#333] p-6 shadow-[8px_8px_0px_#ccff00] relative"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-white uppercase tracking-wider">Yape Directo (Manual)</h3>
                <button 
                  onClick={() => setShowYapeModal(false)} 
                  className="text-zinc-500 hover:text-[#ccff00] bg-transparent p-1 transition-colors"
                  aria-label="Cerrar ventana modal" // <--- CORRECCIÓN ACCESIBILIDAD
                >
                  ✕
                </button>
              </div>

              <div className="bg-[#752384] p-4 mb-6 flex flex-col items-center border-2 border-black shadow-[4px_4px_0px_white]">
                <img src="/qr-yape.png" alt="QR Yape" className="w-48 h-48 object-contain" />
                <p className="mt-3 text-white font-black text-lg tracking-widest uppercase">Titular: Robert Sal*</p>
              </div>

              <div className="space-y-4">
                <div className="bg-[#050505] border-2 border-[#333] p-4 text-sm text-zinc-400 space-y-2 font-medium">
                  <p>1. Yapea <strong className="text-[#ccff00]">S/ {(manualTotalPrice ?? manualProduct.price).toFixed(2)}</strong> al QR.</p>
                  <p>2. Toma una captura de pantalla.</p>
                  <p>3. Envíala a nuestro WhatsApp para activar.</p>
                </div>

                <a 
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    manualProduct.requiresComments
                      ? `Hola! Acabo de yapear S/ ${(manualTotalPrice ?? manualProduct.price).toFixed(2)} por ${customQuantity} ${manualProduct.name}.\n\nAquí mi comprobante (adjunto foto).\n\nMi enlace es: ${targetLink}\n\n📝 Comentarios solicitados:\n${customComments.map((c, i) => `${i + 1}. ${c}`).join('\n')}`
                      : `Hola! Acabo de yapear S/ ${manualProduct.price} por el pack de ${manualProduct.name}.\n\nAquí mi comprobante (adjunto foto).\n\nMi enlace es: ${targetLink}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.history.replaceState(null, '', window.location.pathname + '?intent=yape');
                    }
                  }}
                  className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-black font-black uppercase tracking-widest py-4 hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_white]"
                >
                  <MessageCircle size={20} />
                  Enviar Comprobante
                </a>
                
                {/* CORRECCIÓN CONTRASTE: text-slate-500 -> text-slate-400 */}
                <p className="text-xs text-center text-slate-400">
                  *La activación manual puede tomar 15-30 minutos.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- FOOTER --- */}
      <footer className="mt-24 border-t-2 border-[#333] bg-[#050505] py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6 flex justify-center gap-2 items-center">
             <div className="h-6 w-6 bg-[#ccff00]" />
             <span className="text-xl font-black text-white uppercase tracking-wider">SocialBoost Perú</span>
          </div>
          
          {/* CORRECCIÓN CONTRASTE: text-slate-400 (ya estaba bien, pero aseguramos) */}
          <div className="mb-8 flex flex-wrap justify-center gap-6 text-sm text-slate-400">
            <Link href="/terminos" className="hover:text-white transition-colors">
              Términos y Condiciones
            </Link>
            <Link href="/privacidad" className="hover:text-white transition-colors">
              Política de Privacidad
            </Link>
            
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" className="hover:text-white transition-colors">
              Contacto
            </a>
          </div>

          {/* CORRECCIÓN CONTRASTE: text-slate-600 -> text-slate-500 */}
          <p className="text-xs text-slate-500">
            © 2026 SocialBoost Perú. Todos los derechos reservados. <br/>
            Este sitio no está afiliado con TikTok, Instagram, X/Twitter, Facebook, YouTube ni Twitch.
          </p>
        </div>
      </footer>

      {/* --- BOTÓN FLOTANTE DE WHATSAPP --- */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola,%20tengo%20una%20consulta%20sobre%20los%20servicios%20de%20SocialBoost.`}
        target="_blank"
        rel="noopener noreferrer"
        className="group fixed bottom-6 right-6 z-50 flex items-center justify-center bg-[#25D366] p-3 border-2 border-black shadow-[8px_8px_0px_black] transition-all hover:-translate-y-1 hover:shadow-[10px_10px_0px_black] active:translate-y-0 active:shadow-[4px_4px_0px_black]"
        aria-label="Contactar por WhatsApp"
      >
        <span className="absolute right-full mr-4 whitespace-nowrap bg-white text-black border-2 border-black px-4 py-2 text-sm font-black uppercase tracking-widest shadow-[4px_4px_0px_black] opacity-0 -translate-x-4 transition-all group-hover:opacity-100 group-hover:translate-x-0 pointer-events-none">
          ¡Escríbenos ahora!
        </span>
        <svg 
          viewBox="0 0 24 24" 
          width="32" 
          height="32" 
          fill="black"
          className="fill-black"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        </a>

      {/* TOAST ERROR */}
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

    </main>
  );
}