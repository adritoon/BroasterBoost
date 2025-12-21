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

// Inicializar MP
if (process.env.NEXT_PUBLIC_MP_PUBLIC_KEY) {
  initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY, { locale: 'es-PE' });
}

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
  const [activeCategory, setActiveCategory] = useState<ProductType>('tiktok');
  const [activeService, setActiveService] = useState<ServiceType>('followers');
  
  // Estado para manejar el flujo de compra
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [targetLink, setTargetLink] = useState('');
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Filtros (Igual que antes)
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

  // Paso 1: Seleccionar producto -> Mostrar Input
  const handleSelectProduct = (id: string) => {
    if (selectedProductId === id) return; // Ya está seleccionado
    setSelectedProductId(id);
    setPreferenceId(null); // Resetear pago anterior
    setTargetLink('');
  };

  // Paso 2: Generar Pago con el Link
  const handleCreatePayment = async (product: Product) => {
    if (!targetLink || targetLink.length < 3) {
      alert("Por favor ingresa un enlace válido (ej: usuario o link del video).");
      return;
    }

    setLoading(true);
    // --- SIMULACIÓN (Borrar esto cuando tengas MP) ---
    console.log("Enviando al Backend:", {
      productId: product.id,
      targetLink: targetLink
    });
    setTimeout(() => {
      alert(`¡Simulación Exitosa! \nProducto: ${product.name}\nLink: ${targetLink}`);
      setLoading(false);
      // Aquí normalmente aparecería el botón de MP
    }, 1500);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          productId: product.id,
          targetLink: targetLink // <--- ¡AQUÍ ENVIAMOS EL LINK!
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

      {/* HERO & CATEGORÍAS (Igual) */}
      <section className="pt-32 pb-8 px-4 text-center">
        <h1 className="mx-auto max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
          Domina las <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Redes Sociales</span>
        </h1>
      </section>

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

      {/* SUB-FILTROS */}
      <section className="container mx-auto px-4 pb-12">
        <div className="flex justify-center">
          <div className="inline-flex rounded-xl bg-white/5 p-1 border border-white/10">
            {availableServices.map((service) => (
              <button
                key={service}
                onClick={() => {
                  setActiveService(service);
                  setSelectedProductId(null); // Cerrar cualquier input abierto
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
                  {/* Badge */}
                  {product.popular && (
                    <div className="absolute right-0 top-0 rounded-bl-xl bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-1 text-xs font-bold text-white">POPULAR</div>
                  )}

                  <div className="flex justify-between items-start">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 shadow-inner">
                      <Icon className="text-slate-200" size={24} />
                    </div>
                    <div className="text-right">
                       <span className="text-2xl font-bold text-white">S/ {product.price.toFixed(2)}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-100">{product.name}</h3>
                  
                  {/* ZONA INTERACTIVA */}
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
                      // 2. Formulario (Input + Botón Pagar)
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

                        {preferenceId ? (
                           <div className="wallet-container">
                             <Wallet initialization={{ preferenceId }} customization={{ texts:{ valueProp: 'smart_option'}}} />
                           </div>
                        ) : (
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
                              className="flex-1 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-2.5 hover:opacity-90 disabled:opacity-50"
                             >
                               {loading ? 'Cargando...' : 'Ir a Pagar'}
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

    </main>
  );
}