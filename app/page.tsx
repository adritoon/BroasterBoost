'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { 
  Instagram, Music, Headphones, Bookmark, Play, Facebook, Youtube, Gamepad2, Heart, Eye, 
  MessageCircle, Share2, Users, Clock, ThumbsUp, ShoppingCart, Link as LinkIcon 
} from 'lucide-react';
import { PRODUCTS, CATEGORIES, Product, ProductType, ServiceType } from '@/lib/products';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { FAQSection } from '@/components/FAQSection';

// --- CONFIGURACIÓN ---
if (process.env.NEXT_PUBLIC_MP_PUBLIC_KEY) {
  initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY, { locale: 'es-PE' });
}

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '51999999999';

const iconMap: Record<string, any> = {
  instagram: Instagram, music: Music, plays: Play, listeners: Headphones, saves: Bookmark, facebook: Facebook, youtube: Youtube,
  'gamepad-2': Gamepad2, heart: Heart, eye: Eye, 'message-circle': MessageCircle,
  'share-2': Share2, users: Users, clock: Clock, 'thumbs-up': ThumbsUp
};

const serviceLabels: Record<ServiceType, string> = {
  followers: 'Seguidores',
  likes: 'Likes',
  views: 'Vistas',
  comments: 'Comentarios',
  shares: 'Compartidos',
  streaming: 'En Vivo',
  plays: 'Plays',
  listeners: 'Oyentes Mensuales',
  saves: 'Guardados'
};

export default function Home() {
  // --- ESTADOS ---
  const [activeCategory, setActiveCategory] = useState<ProductType>('tiktok');
  const [activeService, setActiveService] = useState<ServiceType>('followers');
  
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [targetLink, setTargetLink] = useState('');
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [showYapeModal, setShowYapeModal] = useState(false);
  const [manualProduct, setManualProduct] = useState<Product | null>(null);

  // --- LÓGICA DE FILTROS ---
  const productsByCategory = PRODUCTS.filter(p => p.type === activeCategory);
  const availableServices = Array.from(new Set(productsByCategory.map(p => p.service_type)));
  const finalProducts = productsByCategory.filter(p => p.service_type === activeService);

  const handleCategoryChange = (cat: ProductType) => {
    setActiveCategory(cat);
    setSelectedProductId(null);
    setPreferenceId(null);
    setTargetLink('');
    const firstService = PRODUCTS.find(p => p.type === cat)?.service_type || 'followers';
    setActiveService(firstService);
  };

  const handleSelectProduct = (id: string) => {
    if (selectedProductId === id) return;
    setSelectedProductId(id);
    setPreferenceId(null);
    setTargetLink('');
  };

  // --- LÓGICA MERCADO PAGO ---
  const handleCreatePayment = async (product: Product) => {
    if (!targetLink || targetLink.length < 3) {
      alert("Por favor ingresa un enlace válido (ej: usuario o link del video).");
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
      alert("Error al conectar con Mercado Pago");
    } finally {
      setLoading(false);
    }
  };

  // --- LÓGICA YAPE MANUAL ---
  const handleManualPayment = (product: Product) => {
    if (!targetLink || targetLink.length < 3) {
      alert("Por favor ingresa tu enlace primero.");
      return;
    }
    setManualProduct(product);
    setShowYapeModal(true);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-pink-500/30">
      
      {/* HEADER */}
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-pink-500 to-purple-600" />
            <span className="text-xl font-bold tracking-tight">SocialBoost.pe</span>
          </div>
          {/*<button 
            className="rounded-full bg-white/10 p-2 transition hover:bg-white/20"
            aria-label="Ver carrito de compras" // <--- CORRECCIÓN ACCESIBILIDAD
          >
            <ShoppingCart className="h-5 w-5" />
          </button>*/}
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-32 pb-8 px-4 text-center">
        <h1 className="mx-auto max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
          Domina las <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Redes Sociales</span>
        </h1>
      </section>

      {/* CATEGORÍAS */}
      <section className="container mx-auto px-4 pb-6">
        {/* CORRECCIÓN SEO: Título invisible para mantener orden H1 -> H2 */}
        <h2 className="sr-only">Selecciona una Red Social</h2> 
        
        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id as ProductType)}
              className={cn(
                "relative rounded-full px-6 py-2 text-sm font-medium transition-all",
                activeCategory === cat.id ? "text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              {activeCategory === cat.id && (
                <motion.div layoutId="activeTab" className={`absolute inset-0 z-0 rounded-full bg-gradient-to-r ${cat.color}`} />
              )}
              <span className="relative z-10 flex items-center gap-2">{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* SUB-FILTROS (SERVICIOS) */}
      <section className="container mx-auto px-4 pb-12">
        <div className="flex justify-center">
          <div className="inline-flex rounded-xl bg-white/5 p-1 border border-white/10">
            {availableServices.map((service) => (
              <button
                key={service}
                onClick={() => {
                  setActiveService(service);
                  setSelectedProductId(null);
                }}
                className={cn(
                  "rounded-lg px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors",
                  activeService === service 
                    ? "bg-slate-800 text-white shadow-sm" 
                    // CORRECCIÓN CONTRASTE: text-slate-500 -> text-slate-400
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5" 
                )}
              >
                {serviceLabels[service]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* GRID PRODUCTOS */}
      <section className="container mx-auto max-w-6xl px-4 pb-24">
        {/* CORRECCIÓN SEO: Otro título invisible para estructura */}
        <h2 className="sr-only">Catálogo de Servicios</h2>

        <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode='popLayout'>
            {finalProducts.map((product) => {
              const Icon = iconMap[product.icon] || Users;
              const isSelected = selectedProductId === product.id;

              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    borderColor: isSelected ? 'rgba(236, 72, 153, 0.5)' : 'rgba(255,255,255,0.1)' 
                  }}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border bg-white/5 p-6 transition-all",
                    isSelected ? "bg-white/10 ring-1 ring-pink-500/50" : "hover:bg-white/10 border-white/10"
                  )}
                >
                  {/* Badge Popular */}
                  {product.popular && (
                    <div className="absolute right-0 top-0 rounded-bl-xl bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-1 text-xs font-bold text-white">POPULAR</div>
                  )}

                  {/* Encabezado Producto */}
                  <div className="flex justify-between items-start">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 shadow-inner">
                      <Icon className="text-slate-200" size={24} />
                    </div>
                    <div className="text-right">
                        <span className="text-2xl font-bold text-white">S/ {product.price.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* H3 es correcto aquí porque está dentro de una sección con H2 (aunque sea invisible) */}
                  <h3 className="text-lg font-bold text-slate-100">{product.name}</h3>
                  
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
                  <div className="mt-6">
                    {!isSelected ? (
                      <button 
                        onClick={() => handleSelectProduct(product.id)}
                        className="w-full rounded-xl bg-white text-slate-950 font-bold py-3 hover:scale-[1.02] active:scale-[0.98] transition-all"
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
                              product.service_type === 'likes' || product.service_type === 'views' 
                              ? "Pega el link del video/foto" 
                              : "Pega el link del perfil"
                            }
                            value={targetLink}
                            onChange={(e) => setTargetLink(e.target.value)}
                            className="w-full rounded-lg bg-slate-950 border border-slate-700 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                            autoFocus
                          />
                        </div>

                        {preferenceId ? (
                           <div className="wallet-container">
                             <Wallet initialization={{ preferenceId }} />
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
                                className="flex-1 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-2.5 hover:opacity-90 disabled:opacity-50 text-sm"
                               >
                                 {loading ? 'Cargando...' : 'Pago Web'}
                               </button>
                             </div>

                             <button
                               onClick={() => handleManualPayment(product)}
                               className="w-full rounded-lg border border-pink-500/30 text-pink-400 font-bold py-2 hover:bg-pink-500/10 transition-colors text-sm"
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
          </AnimatePresence>
        </motion.div>
      </section>

      <FAQSection />

      {/* --- MODAL YAPE MANUAL --- */}
      <AnimatePresence>
        {showYapeModal && manualProduct && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl relative"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Yape Directo (Manual)</h3>
                <button 
                  onClick={() => setShowYapeModal(false)} 
                  className="text-slate-400 hover:text-white bg-white/5 rounded-full p-1"
                  aria-label="Cerrar ventana modal" // <--- CORRECCIÓN ACCESIBILIDAD
                >
                  ✕
                </button>
              </div>

              <div className="bg-[#752384] p-4 rounded-xl mb-6 flex flex-col items-center">
                <img src="/qr-yape.png" alt="QR Yape" className="w-48 h-48 object-contain" />
                <p className="mt-3 text-white font-bold text-lg tracking-wide">Titular: Robert Sal*</p>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-800 p-3 rounded-lg text-sm text-slate-300 space-y-1">
                  <p>1. Yapea <strong>S/ {manualProduct.price.toFixed(2)}</strong> al QR.</p>
                  <p>2. Toma una captura de pantalla.</p>
                  <p>3. Envíala a nuestro WhatsApp para activar.</p>
                </div>

                <a 
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    `Hola! Acabo de yapear S/ ${manualProduct.price} por el pack de ${manualProduct.name}.\n\nAquí mi comprobante (adjunto foto).\n\nMi enlace es: ${targetLink}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#25D366] text-white font-bold py-3 hover:bg-[#20bd5a] transition-all"
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
      <footer className="mt-20 border-t border-white/10 bg-slate-900 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6 flex justify-center gap-2 items-center">
             <div className="h-6 w-6 rounded-md bg-gradient-to-tr from-pink-500 to-purple-600" />
             <span className="text-xl font-bold text-white">SocialBoost.pe</span>
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
            © 2025 SocialBoost Perú. Todos los derechos reservados. <br/>
            Este sitio no está afiliado con TikTok, Instagram, Facebook ni YouTube.
          </p>
        </div>
      </footer>

      {/* --- BOTÓN FLOTANTE DE WHATSAPP --- */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola,%20tengo%20una%20consulta%20sobre%20los%20servicios%20de%20SocialBoost.`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full bg-[#25D366] p-3 shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] transition-transform hover:scale-110 active:scale-95"
        aria-label="Contactar por WhatsApp"
      >
        <svg 
          viewBox="0 0 24 24" 
          width="32" 
          height="32" 
          fill="white"
          className="fill-white"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>

    </main>
  );
}