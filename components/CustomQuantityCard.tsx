'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, Minus, Plus, Link as LinkIcon, MessageCircle, X, TrendingDown
} from 'lucide-react';
import {
  Product, ProductType, ServiceType, PRODUCTS,
  getInterpolatedPrice, CUSTOM_QTY_ELIGIBLE
} from '@/lib/products';
import { cn } from '@/lib/utils';

// =============================================
// CONSTANTES
// =============================================

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '51999999999';
const ABSOLUTE_MAX = 100_000;

const PLATFORM_NAMES: Record<ProductType, string> = {
  tiktok: 'TikTok', instagram: 'Instagram', twitter: 'X/Twitter',
  youtube: 'YouTube', facebook: 'Facebook', spotify: 'Spotify',
  kick: 'Kick', twitch: 'Twitch',
};

const SERVICE_NAMES: Record<string, string> = {
  followers: 'Seguidores', likes: 'Likes', views: 'Vistas',
  viewsShorts: 'Vistas Shorts', reactions: 'Reacciones', retweets: 'Retweets',
  shares: 'Compartidos', watchtime: 'Watchtime', plays: 'Plays',
  listeners: 'Oyentes', saves: 'Guardados',
};

const PROFILE_SERVICES: ServiceType[] = ['followers', 'listeners'];

// =============================================
// COMPONENTE
// =============================================

interface CustomQuantityCardProps {
  activeCategory: ProductType;
  activeService: ServiceType;
}

export function CustomQuantityCard({ activeCategory, activeService }: CustomQuantityCardProps) {
  // --- ¿Es elegible? ---
  const isEligible = CUSTOM_QTY_ELIGIBLE.includes(activeService);

  // --- Productos del tier actual (para calcular interpolación) ---
  const tierProducts = useMemo(() =>
    PRODUCTS.filter(p =>
      p.type === activeCategory &&
      p.service_type === activeService &&
      !p.isCustomQuantity &&
      p.status !== 'out_of_stock' &&
      p.status !== 'maintenance'
    ).sort((a, b) => a.provider_quantity - b.provider_quantity),
    [activeCategory, activeService]
  );

  const minQty = tierProducts.length > 0 ? tierProducts[0].provider_quantity : 50;
  const maxTierQty = tierProducts.length > 0 ? tierProducts[tierProducts.length - 1].provider_quantity : 10000;
  const maxQty = Math.min(ABSOLUTE_MAX, maxTierQty * 2); // Hasta 2x del tier más alto, max 100K

  // --- Estado ---
  const [isExpanded, setIsExpanded] = useState(false);
  const [quantity, setQuantity] = useState(minQty);
  const [quantityInput, setQuantityInput] = useState(String(minQty));
  const [targetLink, setTargetLink] = useState('');
  const [isPublicConfirmed, setIsPublicConfirmed] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isEligible || tierProducts.length < 2) return null;

  const platformName = PLATFORM_NAMES[activeCategory];
  const serviceName = SERVICE_NAMES[activeService] || activeService;
  const needsProfileLink = PROFILE_SERVICES.includes(activeService);

  // --- Precio calculado ---
  const { total, pricePerUnit } = getInterpolatedPrice(tierProducts, quantity);

  // --- Handlers ---
  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 4000);
  };

  const handleQtyChange = (newQty: number) => {
    const clamped = Math.max(minQty, Math.min(maxQty, newQty));
    setQuantity(clamped);
    setQuantityInput(String(clamped));
  };

  const handleInputBlur = () => {
    const parsed = parseInt(quantityInput);
    if (isNaN(parsed) || parsed < minQty) handleQtyChange(minQty);
    else if (parsed > maxQty) handleQtyChange(maxQty);
    else handleQtyChange(parsed);
  };

  const handleCheckout = () => {
    if (!targetLink || targetLink.length < 3) {
      showError('Ingresa un enlace válido.');
      return;
    }
    if (!isPublicConfirmed) {
      showError('Confirma que tu perfil es público y el enlace es correcto.');
      return;
    }
    setShowCheckout(true);
  };

  const whatsAppMsg = `Hola! Acabo de yapear S/ ${total.toFixed(2)} por ${quantity.toLocaleString()} ${serviceName} ${platformName} (Cantidad Personalizada).\n\nAquí mi comprobante (adjunto foto).\n\nMi enlace es: ${targetLink}`;

  // Incrementos rápidos basados en el rango
  const step = quantity >= 10000 ? 1000 : quantity >= 1000 ? 100 : quantity >= 100 ? 50 : 10;

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          'border-2 border-dashed transition-all overflow-hidden max-w-xl mx-auto w-full',
          isExpanded
            ? 'border-[#ccff00] bg-[#111]'
            : 'border-[#333] bg-transparent hover:border-zinc-500 hover:bg-[#111]'
        )}
      >
        {/* Header / Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 sm:p-5 flex items-center gap-3 text-left"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center bg-[#ccff00] border-2 border-black shadow-[2px_2px_0px_black]">
            <Target className="text-black" size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-bold text-white">🎯 Cantidad Exacta</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Elige exactamente cuántos {serviceName.toLowerCase()} quieres
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-black bg-[#ccff00] border-2 border-black px-2 py-1 uppercase tracking-widest shadow-[2px_2px_0px_black]">
              Solo Yape
            </span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              className="text-slate-400"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </motion.div>
          </div>
        </button>

        {/* Contenido expandible */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-4 sm:px-5 pb-5 space-y-4">
                {/* Selector de cantidad */}
                <div className="bg-[#050505] p-4 border-2 border-[#333]">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4 block">
                    ¿Cuántos {serviceName.toLowerCase()} quieres?
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQtyChange(quantity - step)}
                      disabled={quantity <= minQty}
                      className="flex h-12 w-12 items-center justify-center bg-[#222] text-white border-2 border-[#333] hover:border-[#ccff00] hover:text-[#ccff00] disabled:opacity-30 disabled:cursor-not-allowed transition-all shrink-0"
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={quantityInput}
                      onChange={e => setQuantityInput(e.target.value.replace(/\D/g, ''))}
                      onBlur={handleInputBlur}
                      onKeyDown={e => { if (e.key === 'Enter') handleInputBlur(); }}
                      className="flex-1 min-w-0 text-center bg-[#050505] border-2 border-[#333] py-2.5 text-xl font-black text-white focus:border-[#ccff00] focus:outline-none focus:text-[#ccff00]"
                    />
                    <button
                      onClick={() => handleQtyChange(quantity + step)}
                      disabled={quantity >= maxQty}
                      className="flex h-12 w-12 items-center justify-center bg-[#222] text-white border-2 border-[#333] hover:border-[#ccff00] hover:text-[#ccff00] disabled:opacity-30 disabled:cursor-not-allowed transition-all shrink-0"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="mt-2 flex justify-between text-[10px] text-slate-500">
                    <span>Mín: {minQty.toLocaleString()}</span>
                    <span>Máx: {maxQty.toLocaleString()}</span>
                  </div>

                  {/* Botones rápidos (deduplicados por cantidad) */}
                  <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                    {tierProducts
                      .filter((p, i, arr) => arr.findIndex(x => x.provider_quantity === p.provider_quantity) === i)
                      .slice(0, 6)
                      .map(p => (
                      <button
                        key={p.id}
                        onClick={() => handleQtyChange(p.provider_quantity)}
                        className={cn(
                          'px-3 py-1 text-xs font-black uppercase tracking-widest border-2 transition-all hover:-translate-y-0.5 active:translate-y-0',
                          quantity === p.provider_quantity
                            ? 'bg-[#ccff00] border-[#ccff00] text-black shadow-[2px_2px_0px_white]'
                            : 'bg-[#222] border-[#333] text-zinc-500 hover:text-white hover:border-zinc-500'
                        )}
                      >
                        {p.provider_quantity >= 1000
                          ? `${(p.provider_quantity / 1000).toFixed(p.provider_quantity % 1000 === 0 ? 0 : 1)}K`
                          : p.provider_quantity.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Precio calculado */}
                <div className="bg-[#050505] p-4 border-2 border-[#333]">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-black uppercase tracking-widest text-zinc-500">Precio total</span>
                    <span className="text-3xl font-black text-[#ccff00]">
                      S/ {total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1.5">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <TrendingDown size={12} />
                      S/ {pricePerUnit.toFixed(4)}/unidad
                    </span>
                    <span className="text-[10px] text-slate-600">
                      {quantity.toLocaleString()} {serviceName.toLowerCase()}
                    </span>
                  </div>
                </div>

                {/* Link + Confirmación */}
                <div className="space-y-3">
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder={needsProfileLink ? `Link de tu perfil ${platformName}` : `Link del video/publicación`}
                      value={targetLink}
                      onChange={e => setTargetLink(e.target.value)}
                      className="w-full bg-[#111] border-2 border-[#333] py-3 pl-10 pr-4 text-sm font-bold text-white placeholder:text-zinc-600 focus:border-[#ccff00] focus:outline-none focus:text-[#ccff00]"
                    />
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center shrink-0">
                      <input
                        type="checkbox"
                        checked={isPublicConfirmed}
                        onChange={e => setIsPublicConfirmed(e.target.checked)}
                        className="peer h-5 w-5 shrink-0 appearance-none border-2 border-[#333] bg-[#111] checked:border-[#ccff00] checked:bg-[#ccff00] focus:outline-none transition-all"
                      />
                      <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors leading-tight">
                      Confirmo que el enlace es <b>correcto</b> y mi perfil/contenido está <b>PÚBLICO</b>.
                    </span>
                  </label>
                </div>

                {/* Botón de pago */}
                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-2 bg-[#752384] text-white font-black py-4 hover:-translate-y-1 active:translate-y-0 uppercase tracking-widest transition-transform text-sm shadow-[4px_4px_0px_white]"
                >
                  <MessageCircle size={18} />
                  Yapear S/ {total.toFixed(2)}
                </button>
                <p className="text-xs text-center text-slate-500">Solo pago manual vía Yape/Plin</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ---- MODAL CHECKOUT ---- */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-md border-2 border-[#333] bg-[#111] p-6 shadow-[8px_8px_0px_#ccff00] relative"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white uppercase tracking-widest">🎯 Cantidad Personalizada</h3>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="text-slate-400 hover:text-white bg-[#222] p-1"
                  aria-label="Cerrar"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Resumen */}
              <div className="bg-[#050505] border-2 border-[#333] p-4 mb-4 space-y-2 text-sm font-bold text-zinc-500 uppercase tracking-widest">
                <div className="flex justify-between">
                  <span className="text-zinc-500">{quantity.toLocaleString()} {serviceName} {platformName}</span>
                  <span className="text-white font-black">S/ {total.toFixed(2)}</span>
                </div>
              </div>

              {/* QR */}
              <div className="bg-[#752384] p-4 mb-5 flex flex-col items-center">
                <img src="/qr-yape.png" alt="QR Yape" className="w-48 h-48 object-contain" />
                <p className="mt-3 text-white font-bold text-lg uppercase tracking-widest">Titular: Robert Sal*</p>
              </div>

              <div className="space-y-4">
                <div className="bg-[#050505] p-4 border-2 border-[#333] text-sm text-zinc-400 space-y-1 font-bold">
                  <p>1. Yapea <strong>S/ {total.toFixed(2)}</strong> al QR.</p>
                  <p>2. Toma una captura de pantalla.</p>
                  <p>3. Envíala a nuestro WhatsApp para activar.</p>
                </div>

                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsAppMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-black font-black uppercase tracking-widest py-4 hover:-translate-y-1 active:translate-y-0 transition-transform shadow-[4px_4px_0px_white] text-sm"
                >
                  <MessageCircle size={20} />
                  Enviar Comprobante
                </a>

                <p className="text-xs text-center text-slate-400">
                  *La activación manual puede tomar 15-30 minutos.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- ERROR TOAST ---- */}
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
    </>
  );
}
