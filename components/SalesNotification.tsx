'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShoppingBag } from 'lucide-react';
import { PRODUCTS } from '@/lib/products';

const TIMES = ['Hace un momento', 'Hace 2 min', 'Hace 5 min', 'Hace 12 min', 'Hace 28 min'];

// 1. FILTRO DE REDES ACTIVAS
const ALLOWED_NETWORKS = ['tiktok', 'instagram', 'kick', 'spotify', 'twitch'];

// 2. ESTILOS VISUALES
const NETWORK_STYLES: Record<string, { label: string; color: string }> = {
  tiktok:    { label: 'TikTok',    color: 'from-black to-slate-800' },
  instagram: { label: 'Instagram', color: 'from-pink-600 via-red-500 to-yellow-500' },
  facebook:  { label: 'Facebook',  color: 'from-blue-600 to-blue-800' },
  youtube:   { label: 'YouTube',   color: 'from-red-600 to-red-700' },
  kick:      { label: 'Kick',      color: 'from-green-400 to-green-600' },
  spotify:   { label: 'Spotify',   color: 'from-green-500 to-emerald-600' },
  twitch:    { label: 'Twitch',    color: 'from-purple-600 to-indigo-700' },
};

const DEFAULT_STYLE = { label: 'SocialBoost', color: 'from-slate-700 to-slate-900' };

export function SalesNotification() {
  const [visible, setVisible] = useState(false);
  const [notification, setNotification] = useState({ 
    item: '', 
    time: '', 
    style: DEFAULT_STYLE 
  });

  const detectNetwork = (product: any) => {
    if (!product) return DEFAULT_STYLE;

    if (product.type) {
      const typeKey = product.type.toLowerCase().trim();
      if (NETWORK_STYLES[typeKey]) return NETWORK_STYLES[typeKey];
    }
    
    const nameLower = product.name ? product.name.toLowerCase() : '';
    if (nameLower.includes('tiktok')) return NETWORK_STYLES['tiktok'];
    if (nameLower.includes('insta')) return NETWORK_STYLES['instagram'];
    if (nameLower.includes('face')) return NETWORK_STYLES['facebook'];
    if (nameLower.includes('tube')) return NETWORK_STYLES['youtube'];
    if (nameLower.includes('kick')) return NETWORK_STYLES['kick'];
    if (nameLower.includes('spotify')) return NETWORK_STYLES['spotify'];

    return DEFAULT_STYLE;
  };

  const generateSale = () => {
    const validProducts = PRODUCTS.filter(p => {
      if (!p || !p.name) return false;
      const type = p.type ? p.type.toLowerCase() : '';
      return ALLOWED_NETWORKS.includes(type);
    });
    
    if (validProducts.length === 0) return null;

    const randomProduct = validProducts[Math.floor(Math.random() * validProducts.length)];
    const style = detectNetwork(randomProduct);
    
    return { 
      item: randomProduct.name, 
      time: TIMES[Math.floor(Math.random() * TIMES.length)],
      style: style || DEFAULT_STYLE
    };
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let hideTimeoutId: NodeJS.Timeout;

    const showRandomNotification = () => {
      // 1. Calculamos cuánto esperar antes de mostrar la siguiente (15s a 45s)
      const randomDelay = Math.floor(Math.random() * (45000 - 15000) + 15000);

      timeoutId = setTimeout(() => {
        const sale = generateSale();
        if (sale) {
          setNotification(sale);
          setVisible(true);
        }

        // 2. Programamos ocultarla Y LLAMAR A LA SIGUIENTE
        hideTimeoutId = setTimeout(() => {
          setVisible(false);
          showRandomNotification(); // <--- ¡AQUÍ ESTABA EL ERROR! Faltaba esta llamada
        }, 6000); // Se muestra por 6 segundos

      }, randomDelay);
    };

    // Primera ejecución al cargar la página (espera 5s)
    const startTimeout = setTimeout(() => {
      const sale = generateSale();
      if (sale) {
        setNotification(sale);
        setVisible(true);
      }
      
      hideTimeoutId = setTimeout(() => {
        setVisible(false);
        showRandomNotification(); // Arranca el bucle infinito
      }, 6000);
      
    }, 5000);

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(timeoutId);
      clearTimeout(hideTimeoutId);
    };
  }, []);

  const currentStyle = notification.style || DEFAULT_STYLE;
  const currentColor = currentStyle.color || DEFAULT_STYLE.color;
  const currentLabel = currentStyle.label || DEFAULT_STYLE.label;

  if (!notification.item) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: -20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-4 left-4 z-50 max-w-[320px] md:bottom-6 md:left-6"
        >
          <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-slate-950/90 p-4 shadow-2xl backdrop-blur-md ring-1 ring-white/5">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${currentColor} shadow-lg`}>
               <ShoppingBag className="text-white h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-100 flex items-center gap-1">
                Nuevo Pedido
                {currentLabel !== 'SocialBoost' && (
                  <>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-200">{currentLabel}</span>
                  </>
                )}
              </span>
              <span className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                <span className="text-white font-medium">{notification.item}</span>
              </span>
              <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-500">
                <ShieldCheck size={10} className="text-blue-400" />
                <span>Cliente Verificado • {notification.time}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}