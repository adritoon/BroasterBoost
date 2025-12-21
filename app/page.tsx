'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { 
  Instagram, Music, Facebook, Youtube, Gamepad2, Heart, Eye, 
  MessageCircle, Share2, Users, Clock, ThumbsUp, ShoppingCart, Link as LinkIcon 
} from 'lucide-react';
import { PRODUCTS, CATEGORIES, Product, ProductType, ServiceType } from '@/lib/products';
import { cn } from '@/lib/utils';

// 1. Inicializar Mercado Pago
// Asegúrate de que tu variable de entorno empiece con NEXT_PUBLIC_
if (process.env.NEXT_PUBLIC_MP_PUBLIC_KEY) {
  initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY, { locale: 'es-PE' });
}

// 2. Mapeo de Iconos y Etiquetas
const iconMap: Record<string, any> = {
  instagram: Instagram, music: Music, facebook: Facebook, youtube: Youtube,
  'gamepad-2': Gamepad2, heart: Heart, eye: Eye, 'message-circle': MessageCircle,
  'share-2': Share2, users: Users, clock: Clock, 'thumbs-up': ThumbsUp
};

const serviceLabels: Record<ServiceType, string> = {
  followers: 'Seguidores',
  likes: 'Likes',
  views: 'Vistas',
  comments: 'Comentarios',
  shares: 'Compartidos',
  streaming: 'En Vivo'
};

export default function Home() {
  // --- ESTADOS ---
  const [activeCategory, setActiveCategory] = useState<ProductType>('tiktok');
  const [activeService, setActiveService] = useState<ServiceType>('followers');
  
  // Estado para compra automática (Mercado Pago)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [targetLink, setTargetLink] = useState('');
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Estado para compra manual (Yape QR)
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

  // --- LÓGICA DE SELECCIÓN ---
  const handleSelectProduct = (id: string) => {
    if (selectedProductId === id) return;
    setSelectedProductId(id);
    setPreferenceId(null);
    setTargetLink('');
  };

  // --- LÓGICA MERCADO PAGO (Automático) ---
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

  // --- LÓGICA YAPE MANUAL (QR) ---
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
          <button className="rounded-full bg-white/10 p-2 transition hover:bg-white/20">
            <ShoppingCart className="h-5 w-5" />
          </button>
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
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
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

                  <h3 className="text-lg font-bold text-slate-100">{product.name}</h3>
                  
                  {/* ZONA DE COMPRA */}
                  <div className="mt-6">
                    {!isSelected ? (
                      // 1. Botón Inicial
                      <button 
                        onClick={() => handleSelectProduct(product.id)}
                        className="w-full rounded-xl bg-white text-slate-950 font-bold py-3 hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                        Comprar
                      </button>
                    ) : (
                      // 2. Formulario de Datos + Botones
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
                              : "Usuario (sin @) o Link Perfil"
                            }
                            value={targetLink}
                            onChange={(e) => setTargetLink(e.target.value)}
                            className="w-full rounded-lg bg-slate-950 border border-slate-700 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-slate-600 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                            autoFocus
                          />
                        </div>

                        {/* Si ya tenemos ID de pago, mostrar Wallet de MP */}
                        {preferenceId ? (
                           <div className="wallet-container">
                             {/* Usamos la versión simple para evitar errores de TypeScript */}
                             <Wallet initialization={{ preferenceId }} />
                           </div>
                        ) : (
                          // Si no, mostrar botones de selección de pago
                          <div className="space-y-2">
                             
                             {/* Fila 1: Cancelar + Botón Mercado Pago */}
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

                             {/* Fila 2: Botón Manual Yape (Ocupa todo el ancho) */}
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
              {/* Header del Modal */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Yape Directo (Manual)</h3>
                <button 
                  onClick={() => setShowYapeModal(false)} 
                  className="text-slate-400 hover:text-white bg-white/5 rounded-full p-1"
                >
                  ✕
                </button>
              </div>

              {/* Zona QR */}
              <div className="bg-[#752384] p-4 rounded-xl mb-6 flex flex-col items-center">
                {/* --- CONFIGURACIÓN: DESCOMENTAR CUANDO TENGAS LA FOTO --- */}
                <img src="/qr-yape.png" alt="QR Yape" className="w-48 h-48 object-contain" />
                
                {/* Placeholder (Bórralo cuando pongas la imagen real) */}
                {/* <div className="w-48 h-48 bg-purple-100 flex items-center justify-center text-purple-600 font-bold border-2 border-dashed border-purple-300 text-center text-sm p-4">
                   SUBE UNA FOTO LLAMADA "qr-yape.png" A TU CARPETA PUBLIC
                </div> */}
                
                <p className="mt-3 text-white font-bold text-lg tracking-wide">Titular: Robert Sal*</p>
              </div>

              {/* Instrucciones y Botón WhatsApp */}
              <div className="space-y-4">
                <div className="bg-slate-800 p-3 rounded-lg text-sm text-slate-300 space-y-1">
                  <p>1. Yapea <strong>S/ {manualProduct.price.toFixed(2)}</strong> al QR.</p>
                  <p>2. Toma una captura de pantalla.</p>
                  <p>3. Envíala a nuestro WhatsApp para activar.</p>
                </div>

                {/* --- CONFIGURACIÓN: PON TU NÚMERO AQUÍ --- */}
                <a 
                  href={`https://wa.me/51971409482?text=${encodeURIComponent(
                    `Hola! Acabo de yapear S/ ${manualProduct.price} por el pack de ${manualProduct.name}.\n\nAquí mi comprobante (adjunto foto).\n\nMi enlace es: ${targetLink}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#25D366] text-white font-bold py-3 hover:bg-[#20bd5a] transition-all"
                >
                  <MessageCircle size={20} />
                  Enviar Comprobante
                </a>
                
                <p className="text-xs text-center text-slate-500">
                  *La activación manual puede tomar 15-30 minutos.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}