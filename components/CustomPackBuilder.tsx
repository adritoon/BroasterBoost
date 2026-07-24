'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Heart, Eye, MessageCircle, Repeat, ThumbsUp, Clock,
  Package, Link as LinkIcon, Minus, Plus, X, ChevronDown,
  Headphones, Bookmark, Play, Share2
} from 'lucide-react';
import {
  PRODUCTS, ProductType, ServiceType,
  getCustomCommentPrice, CUSTOM_PACK_DISCOUNT,
  BUILDER_EXCLUDED_SERVICES, PROFILE_LINK_SERVICES
} from '@/lib/products';
import { cn } from '@/lib/utils';

// =============================================
// CONSTANTES LOCALES
// =============================================

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '51999999999';

const SERVICE_ICON_MAP: Partial<Record<ServiceType, React.ComponentType<any>>> = {
  followers: Users,
  likes: Heart,
  views: Eye,
  viewsShorts: Eye,
  reactions: ThumbsUp,
  retweets: Repeat,
  comments: MessageCircle,
  shares: Share2,
  streaming: Users,
  watchtime: Clock,
  plays: Play,
  listeners: Headphones,
  saves: Bookmark,
};

const SERVICE_LABELS: Partial<Record<ServiceType, string>> = {
  followers: 'Seguidores',
  likes: 'Likes',
  views: 'Vistas',
  viewsShorts: 'Vistas Shorts',
  reactions: 'Reacciones',
  retweets: 'Retweets',
  comments: 'Comentarios',
  shares: 'Compartidos',
  streaming: 'Viewers En Vivo',
  watchtime: 'Watchtime',
  plays: 'Reproducciones',
  listeners: 'Oyentes Mensuales',
  saves: 'Guardados',
};

const PLATFORM_INFO: Record<ProductType, { name: string; profileLabel: string; postLabel: string }> = {
  tiktok: { name: 'TikTok', profileLabel: 'Link de tu perfil TikTok', postLabel: 'Link del video' },
  instagram: { name: 'Instagram', profileLabel: 'Link de tu perfil Instagram', postLabel: 'Link del post/reel' },
  twitter: { name: 'X/Twitter', profileLabel: 'Link de tu perfil X/Twitter', postLabel: 'Link del tweet' },
  youtube: { name: 'YouTube', profileLabel: 'Link de tu canal YouTube', postLabel: 'Link del video' },
  facebook: { name: 'Facebook', profileLabel: 'Link de tu página Facebook', postLabel: 'Link del post' },
  spotify: { name: 'Spotify', profileLabel: 'Link de tu perfil Spotify', postLabel: 'Link de la canción' },
  kick: { name: 'Kick', profileLabel: 'Link de tu canal Kick', postLabel: 'Link del stream' },
  twitch: { name: 'Twitch', profileLabel: 'Link de tu canal Twitch', postLabel: 'Link del stream' },
};

/** Quita el nombre de plataforma del nombre del producto para ahorrar espacio en dropdowns */
const cleanProductName = (name: string) =>
  name.replace(/\s+(TikTok|Instagram|X\/Twitter|YouTube|Facebook|Spotify|Kick|Twitch)/gi, '').trim();

// =============================================
// COMPONENTE
// =============================================

interface CustomPackBuilderProps {
  activeCategory: ProductType;
}

export function CustomPackBuilder({ activeCategory }: CustomPackBuilderProps) {
  // --- ESTADO ---
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [includeComments, setIncludeComments] = useState(false);
  const [commentQuantity, setCommentQuantity] = useState(5);
  const [commentQuantityInput, setCommentQuantityInput] = useState('5');
  const [commentTexts, setCommentTexts] = useState<string[]>(['', '', '', '', '']);
  const [profileLink, setProfileLink] = useState('');
  const [postLink, setPostLink] = useState('');
  const [isPublicConfirmed, setIsPublicConfirmed] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 4000);
  };

  const platform = PLATFORM_INFO[activeCategory];

  // --- PRODUCTOS AGRUPADOS POR SERVICIO ---
  const { serviceGroups, hasComments } = useMemo(() => {
    const products = PRODUCTS.filter(p =>
      p.type === activeCategory &&
      !BUILDER_EXCLUDED_SERVICES.includes(p.service_type) &&
      !p.isCustomQuantity &&
      p.status !== 'out_of_stock' &&
      p.status !== 'maintenance'
    );

    const groups: Record<string, typeof products> = {};
    products.forEach(p => {
      if (!groups[p.service_type]) groups[p.service_type] = [];
      groups[p.service_type].push(p);
    });
    // Ordenar por cantidad dentro de cada grupo
    Object.values(groups).forEach(arr => arr.sort((a, b) => a.provider_quantity - b.provider_quantity));

    const comments = PRODUCTS.some(p =>
      p.type === activeCategory &&
      p.service_type === 'comments' &&
      p.isCustomQuantity
    );

    return { serviceGroups: groups, hasComments: comments };
  }, [activeCategory]);

  const serviceTypes = Object.keys(serviceGroups) as ServiceType[];

  // --- CÁLCULOS ---
  const { subtotal, discount, total, selectedCount, selectedItems } = useMemo(() => {
    let sub = 0;
    let count = 0;
    const items: { name: string; price: number }[] = [];

    Object.entries(selections).forEach(([, productId]) => {
      if (productId) {
        const product = PRODUCTS.find(p => p.id === productId);
        if (product) {
          sub += product.price;
          count++;
          items.push({ name: product.name, price: product.price });
        }
      }
    });

    if (includeComments) {
      const { total: cTotal } = getCustomCommentPrice(commentQuantity);
      sub += cTotal;
      count++;
      items.push({ name: `${commentQuantity} Comentarios Personalizados`, price: cTotal });
    }

    const disc = count >= 2 ? parseFloat((sub * CUSTOM_PACK_DISCOUNT).toFixed(2)) : 0;
    return {
      subtotal: sub,
      discount: disc,
      total: parseFloat((sub - disc).toFixed(2)),
      selectedCount: count,
      selectedItems: items,
    };
  }, [selections, includeComments, commentQuantity]);

  // --- LINKS INTELIGENTES ---
  const selectedServiceTypes = useMemo(() => {
    const types: ServiceType[] = [];
    Object.entries(selections).forEach(([st, pid]) => {
      if (pid) types.push(st as ServiceType);
    });
    if (includeComments) types.push('comments');
    return types;
  }, [selections, includeComments]);

  const needsProfileLink = selectedServiceTypes.some(st => PROFILE_LINK_SERVICES.includes(st));
  const needsPostLink = selectedServiceTypes.some(st => !PROFILE_LINK_SERVICES.includes(st));

  // --- HANDLERS ---
  const handleSelectProduct = (serviceType: string, productId: string) => {
    setSelections(prev => {
      const next = { ...prev };
      if (productId) {
        next[serviceType] = productId;
      } else {
        delete next[serviceType];
      }
      return next;
    });
  };

  const handleCommentQtyChange = (newQty: number) => {
    const clamped = Math.max(5, Math.min(100, newQty));
    setCommentQuantity(clamped);
    setCommentQuantityInput(String(clamped));
    setCommentTexts(prev => {
      if (clamped > prev.length) return [...prev, ...Array(clamped - prev.length).fill('')];
      return prev.slice(0, clamped);
    });
  };

  const handleCommentInputBlur = () => {
    const parsed = parseInt(commentQuantityInput);
    if (isNaN(parsed) || parsed < 5) handleCommentQtyChange(5);
    else if (parsed > 100) handleCommentQtyChange(100);
    else handleCommentQtyChange(parsed);
  };

  const handleCheckout = () => {
    if (selectedCount === 0) {
      showError('Selecciona al menos un servicio para tu pack.');
      return;
    }
    if (needsProfileLink && (!profileLink || profileLink.length < 3)) {
      showError('Ingresa el link de tu perfil/canal.');
      return;
    }
    if (needsPostLink && (!postLink || postLink.length < 3)) {
      showError('Ingresa el link del video/publicación.');
      return;
    }
    if (!isPublicConfirmed) {
      showError('Confirma que tu perfil es público y los enlaces son correctos.');
      return;
    }
    if (includeComments) {
      const filled = commentTexts.filter(c => c.trim().length > 0);
      if (filled.length < commentQuantity) {
        showError(`Faltan ${commentQuantity - filled.length} comentarios por escribir.`);
        return;
      }
    }
    setShowCheckout(true);
  };

  const buildWhatsAppMessage = () => {
    const lines: string[] = [
      `🛒 Hola! Acabo de yapear S/ ${total.toFixed(2)} por mi Pack Personalizado ${platform.name}.`,
      '',
      '📦 Detalle del pack:',
      ...selectedItems.map(item => `• ${item.name} - S/ ${item.price.toFixed(2)}`),
      '',
      `💰 Subtotal: S/ ${subtotal.toFixed(2)}`,
    ];
    if (discount > 0) lines.push(`🏷️ Descuento Pack (-5%): -S/ ${discount.toFixed(2)}`);
    lines.push(`✅ Total pagado: S/ ${total.toFixed(2)}`, '');
    if (needsProfileLink) lines.push(`🔗 Link perfil: ${profileLink}`);
    if (needsPostLink) lines.push(`🔗 Link video/post: ${postLink}`);
    if (includeComments) {
      lines.push('', '📝 Comentarios solicitados:');
      commentTexts.forEach((c, i) => lines.push(`${i + 1}. ${c}`));
    }
    lines.push('', 'Aquí mi comprobante (adjunto foto).');
    return lines.join('\n');
  };

  // --- PRECIOS COMENTARIOS ---
  const { pricePerUnit: commentPPU, total: commentTotal } = getCustomCommentPrice(commentQuantity);

  // =============================================
  // RENDER
  // =============================================
  return (
    <div className="space-y-6">
      {/* ---- HEADER ---- */}
      <div className="bg-[#111] border-2 border-[#333] p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center bg-[#ccff00] shadow-[4px_4px_0px_white]">
            <Package className="text-black" size={24} strokeWidth={3} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-wider">Arma tu Pack {platform.name}</h3>
            <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest mt-1">
              Combina servicios y obtén{' '}
              <span className="text-[#ccff00]">5% de descuento</span>
            </p>
          </div>
        </div>
      </div>

      {/* ---- FILAS DE SERVICIOS ---- */}
      <div className="space-y-2.5">
        {serviceTypes.map(serviceType => {
          const products = serviceGroups[serviceType];
          const Icon = SERVICE_ICON_MAP[serviceType] || Package;
          const label = SERVICE_LABELS[serviceType] || serviceType;
          const selectedId = selections[serviceType];
          const selectedProduct = selectedId ? products.find(p => p.id === selectedId) : null;

          return (
            <div
              key={serviceType}
              className={`relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 transition-colors border-2 bg-[#111] ${
                  selectedId 
                  ? 'border-[#ccff00]' 
                  : 'border-[#333] hover:border-[#555]'
                }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#222] border-2 border-[#333]">
                  <Icon className="text-zinc-400" size={18} />
                </div>
                <span className="text-sm font-black text-white uppercase tracking-widest">{label}</span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === serviceType ? null : serviceType)}
                  className="flex-1 sm:w-[220px] bg-[#050505] border-2 border-[#333] py-2 px-3 text-sm font-bold text-white focus:border-[#ccff00] focus:outline-none flex justify-between items-center"
                >
                  <span className="truncate">
                    {selectedProduct ? `${cleanProductName(selectedProduct.name)} — S/ ${selectedProduct.price.toFixed(2)}` : 'No incluir'}
                  </span>
                  <ChevronDown size={16} className={`shrink-0 transition-transform ${openDropdown === serviceType ? 'rotate-180 text-[#ccff00]' : 'text-zinc-500'}`} />
                </button>

                <AnimatePresence>
                  {openDropdown === serviceType && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute top-[110%] left-0 right-0 sm:right-auto sm:w-[220px] bg-[#050505] border-2 border-[#333] z-50 max-h-60 overflow-y-auto custom-scrollbar shadow-[4px_4px_0px_#ccff00]"
                    >
                      <button
                        onClick={() => {
                          handleSelectProduct(serviceType, '');
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-3 py-2.5 text-sm font-bold hover:bg-[#222] transition-colors ${!selectedId ? 'text-[#ccff00] bg-[#111]' : 'text-zinc-400'}`}
                      >
                        No incluir
                      </button>
                      {products.map(p => (
                        <button
                          key={p.id}
                          onClick={() => {
                            handleSelectProduct(serviceType, p.id);
                            setOpenDropdown(null);
                          }}
                          className={`w-full text-left px-3 py-2.5 text-sm font-bold hover:bg-[#222] transition-colors truncate ${selectedId === p.id ? 'text-[#ccff00] bg-[#111]' : 'text-white'}`}
                        >
                          {cleanProductName(p.name)} — S/ {p.price.toFixed(2)}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {openDropdown && (
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setOpenDropdown(null)} 
                  />
                )}
                
                <div className={`text-xs font-bold uppercase tracking-widest shrink-0 ${
                    selectedId ? 'text-[#ccff00]' : 'text-zinc-500'
                  }`}>
                    {selectedProduct ? `S/ ${selectedProduct.price.toFixed(2)}` : 'S/ 0.00'}
                  </div>
              </div>
            </div>
          );
        })}

        {/* ---- COMENTARIOS (TOGGLE + EXPANDIBLE) ---- */}
        {hasComments && (
          <div
            className={`rounded-xl border-2 transition-all overflow-hidden bg-[#111] ${
              includeComments
                ? 'border-[#ccff00]'
                : 'border-[#333]'
            }`}
          >
            {/* Toggle */}
            <div className="flex items-center gap-3 p-3 sm:p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#222] border-2 border-[#333]">
                <MessageCircle className="text-zinc-400" size={18} />
              </div>
              <span className="text-sm font-black text-white uppercase tracking-widest flex-1">Comentarios Personalizados</span>
              <button
                onClick={() => setIncludeComments(!includeComments)}
                className={cn(
                  'relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200',
                  includeComments ? 'bg-[#ccff00]' : 'bg-slate-700'
                )}
              >
                <span
                  className={cn(
                    'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 mt-0.5',
                    includeComments ? 'translate-x-[22px]' : 'translate-x-0.5'
                  )}
                />
              </button>
              <div className={`text-xs font-bold uppercase tracking-widest ${
                  includeComments ? 'text-[#ccff00]' : 'text-zinc-500'
                }`}>
                  {includeComments ? `S/ ${commentTotal.toFixed(2)}` : 'S/ 0.00'}
                </div>
            </div>

            {/* Expandible: cantidad + campos */}
            <AnimatePresence>
              {includeComments && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-3 sm:px-4 pb-4 space-y-3">
                    {/* Selector de cantidad */}
                    <div className="bg-[#050505] p-4 border-2 border-[#333]">
                      <label className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4 block">
                        Cantidad de comentarios
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCommentQtyChange(commentQuantity - 1)}
                          disabled={commentQuantity <= 5}
                          className="flex h-12 w-12 items-center justify-center bg-[#222] text-white border-2 border-[#333] hover:border-[#ccff00] hover:text-[#ccff00] disabled:opacity-30 disabled:cursor-not-allowed transition-all shrink-0"
                        >
                          <Minus size={16} />
                        </button>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={commentQuantityInput}
                          onChange={e => setCommentQuantityInput(e.target.value.replace(/\D/g, ''))}
                          onBlur={handleCommentInputBlur}
                          onKeyDown={e => { if (e.key === 'Enter') handleCommentInputBlur(); }}
                          className="flex-1 min-w-0 text-center bg-[#050505] border-2 border-[#333] py-2.5 text-xl font-black text-white focus:border-[#ccff00] focus:outline-none focus:text-[#ccff00]"
                        />
                        <button
                          onClick={() => handleCommentQtyChange(commentQuantity + 1)}
                          disabled={commentQuantity >= 100}
                          className="flex h-12 w-12 items-center justify-center bg-[#222] text-white border-2 border-[#333] hover:border-[#ccff00] hover:text-[#ccff00] disabled:opacity-30 disabled:cursor-not-allowed transition-all shrink-0"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Tiers de precio */}
                      <div className="mt-2.5 grid grid-cols-4 gap-1 text-[10px]">
                        {[
                          { range: '5-9', price: 1.0, min: 5, max: 9 },
                          { range: '10-24', price: 0.8, min: 10, max: 24 },
                          { range: '25-49', price: 0.6, min: 25, max: 49 },
                          { range: '50+', price: 0.5, min: 50, max: 100 },
                        ].map(tier => (
                          <button
                            key={tier.range}
                            type="button"
                            onClick={() => handleCommentQtyChange(tier.min)}
                              className={cn(
                                'px-2 py-1 text-center border-2 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0',
                                commentQuantity >= tier.min && commentQuantity <= tier.max
                                  ? 'bg-[#ccff00] border-[#ccff00] text-black shadow-[2px_2px_0px_white]'
                                  : 'bg-[#222] border-[#333] text-zinc-500 hover:text-white hover:border-zinc-500'
                              )}
                          >
                            <div className="font-bold">{tier.range}</div>
                            <div>S/{tier.price.toFixed(2)}/c.u.</div>
                          </button>
                        ))}
                      </div>

                      {/* Precio total */}
                      <div className="mt-3 flex items-baseline justify-between border-t-2 border-[#333] pt-3">
                        <span className="text-xs text-slate-400">{commentQuantity} comentarios × S/ {commentPPU.toFixed(2)}</span>
                        <span className="text-xl font-bold text-white">S/ {commentTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Campos de texto */}
                    <div className="bg-[#050505] p-4 border-2 border-[#333]">
                      <label className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4 block">
                        📝 Escribe tus {commentQuantity} comentarios
                      </label>
                      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                        {commentTexts.map((text, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="mt-2 text-xs font-bold text-slate-500 w-5 shrink-0 text-right">
                              {i + 1}.
                            </span>
                            <input
                              type="text"
                              placeholder={`Comentario ${i + 1}...`}
                              value={text}
                              onChange={e => {
                                const updated = [...commentTexts];
                                updated[i] = e.target.value;
                                setCommentTexts(updated);
                              }}
                              className="flex-1 bg-[#111] border-2 border-[#333] py-2 px-3 text-sm font-bold text-white placeholder:text-zinc-600 focus:border-[#ccff00] focus:outline-none focus:text-[#ccff00] transition-colors"
                            />
                          </div>
                        ))}
                      </div>
                      <p className="mt-2 text-[10px] text-slate-500">
                        {commentTexts.filter(c => c.trim()).length}/{commentQuantity} escritos
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ---- LINKS + CONFIRMACIÓN ---- */}
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {needsProfileLink && (
            <div className="relative">
              <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder={platform.profileLabel}
                value={profileLink}
                onChange={e => setProfileLink(e.target.value)}
                className="w-full bg-[#111] border-2 border-[#333] py-3 pl-10 pr-4 text-sm font-bold text-white placeholder:text-zinc-600 focus:border-[#ccff00] focus:outline-none focus:text-[#ccff00]"
              />
            </div>
          )}
          {needsPostLink && (
            <div className="relative">
              <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder={platform.postLabel}
                value={postLink}
                onChange={e => setPostLink(e.target.value)}
                className="w-full bg-[#111] border-2 border-[#333] py-3 pl-10 pr-4 text-sm font-bold text-white placeholder:text-zinc-600 focus:border-[#ccff00] focus:outline-none focus:text-[#ccff00]"
              />
            </div>
          )}

          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center shrink-0">
              <input
                type="checkbox"
                checked={isPublicConfirmed}
                onChange={e => setIsPublicConfirmed(e.target.checked)}
                className="peer h-5 w-5 shrink-0 appearance-none border-2 border-[#333] bg-[#111] checked:border-[#ccff00] checked:bg-[#ccff00] focus:outline-none transition-all"
              />
              <svg
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors leading-tight">
              Confirmo que he ingresado los <b>enlaces correctos</b> y que mi perfil/contenido está{' '}
              <b>PÚBLICO</b>.
            </span>
          </label>
        </motion.div>
      )}

      {/* ---- RESUMEN + BOTÓN DE PAGO ---- */}
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#050505] border-2 border-[#333] p-5 space-y-4"
        >
          <div className="space-y-2">
            {selectedItems.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-zinc-500 font-bold uppercase tracking-widest truncate mr-2">{item.name}</span>
                <span className="text-white font-black shrink-0">S/ {item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-[#333] pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500 font-bold uppercase tracking-widest">Subtotal</span>
              <span className="text-white font-black">S/ {subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-[#ccff00] border-t-2 border-[#333] pt-2 mt-2 font-black uppercase tracking-widest text-xs">
                <span className="text-[#ccff00] flex items-center gap-1">🏷️ Descuento Pack (-5%)</span>
                <span className="text-[#ccff00] font-black">-S/ {discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline pt-2">
              <span className="text-sm font-black text-zinc-500 uppercase tracking-widest">Total a pagar</span>
              <span className="text-4xl font-black text-[#ccff00] tracking-tighter">
                S/ {total.toFixed(2)}
              </span>
            </div>
          </div>

          {selectedCount < 2 && (
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black text-center mt-2">
              💡 Agrega otro servicio para activar el 5% de descuento
            </p>
          )}

          <button
            onClick={handleCheckout}
            className="w-full flex items-center justify-center gap-2 bg-[#752384] text-white font-black py-4 hover:-translate-y-1 active:translate-y-0 uppercase tracking-widest transition-transform text-sm shadow-[4px_4px_0px_white]"
          >
            <MessageCircle size={18} />
            Yapear Directo (QR)
          </button>
          <p className="text-xs text-center text-slate-500">Solo pago manual vía Yape/Plin</p>
        </motion.div>
      )}

      {/* ---- ESTADO VACÍO ---- */}
      {selectedCount === 0 && (
        <div className="text-center py-10">
          <Package className="mx-auto text-slate-600 mb-3" size={44} />
          <p className="text-slate-400 text-sm font-medium">Selecciona servicios arriba para armar tu pack</p>
          <p className="text-slate-600 text-xs mt-1">Combina 2 o más servicios para obtener 5% de descuento</p>
        </div>
      )}

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
              className="w-full max-w-md border-2 border-[#333] bg-[#111] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white uppercase tracking-widest">🛒 Pack Personalizado</h3>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="text-slate-400 hover:text-white bg-[#222] p-1"
                  aria-label="Cerrar ventana modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* INFO DEL PACK (MODAL) */}
              <div className="bg-[#050505] border-2 border-[#333] p-4 mb-4 space-y-2 text-sm font-bold text-zinc-500 uppercase tracking-widest">
                {selectedItems.map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-slate-300 truncate mr-2">• {item.name}</span>
                    <span className="text-white shrink-0">S/ {item.price.toFixed(2)}</span>
                  </div>
                ))}
                {discount > 0 && (
                  <div className="flex justify-between text-[#ccff00] border-t-2 border-[#333] pt-2 mt-2">
                    <span>🏷️ Descuento (-5%)</span>
                    <span>-S/ {discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base border-t-2 border-[#333] pt-2 mt-2">
                  <span className="text-white">Total</span>
                  <span className="text-[#ccff00] font-black tracking-widest">S/ {total.toFixed(2)}</span>
                </div>
              </div>

              {/* QR */}
              <div className="bg-[#752384] p-4 mb-5 flex flex-col items-center">
                <img src="/qr-yape.png" alt="QR Yape" className="w-48 h-48 object-contain" />
                <p className="mt-3 text-white font-bold text-lg tracking-wide uppercase tracking-widest">Titular: Robert Sal*</p>
              </div>

              {/* Instrucciones */}
              <div className="space-y-4">
                <div className="bg-[#050505] p-4 border-2 border-[#333] text-sm text-zinc-400 space-y-1 font-bold">
                  <p>
                    1. Yapea <strong>S/ {total.toFixed(2)}</strong> al QR.
                  </p>
                  <p>2. Toma una captura de pantalla.</p>
                  <p>3. Envíala a nuestro WhatsApp para activar.</p>
                </div>

                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage())}`}
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

      {/* ---- TOAST ERROR ---- */}
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
    </div>
  );
}
