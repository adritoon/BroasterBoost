'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Zap } from 'lucide-react';
import { PRODUCTS } from '@/lib/products';

const TIMES = ['Hace un momento', 'Hace 2 min', 'Hace 5 min', 'Hace 12 min', 'Hace 28 min'];

// 1. FILTRO DE REDES ACTIVAS
const ALLOWED_NETWORKS = ['tiktok', 'youtube', 'instagram', 'kick', 'spotify', 'twitch'];

// 2. ESTILOS VISUALES
const PLATFORMS: Record<string, { label: string; color: string }> = {
  tiktok:    { label: 'TikTok',    color: 'bg-black text-white' },
  instagram: { label: 'Instagram', color: 'bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 text-white' },
  facebook:  { label: 'Facebook',  color: 'bg-blue-600 text-white' },
  youtube:   { label: 'YouTube',   color: 'bg-red-600 text-white' },
  kick:      { label: 'Kick',      color: 'bg-green-400 text-black' },
  spotify:   { label: 'Spotify',   color: 'bg-green-500 text-black' },
  twitch:    { label: 'Twitch',    color: 'bg-purple-600 text-white' },
};

const DEFAULT_STYLE = { label: 'SocialBoost', color: 'bg-slate-700 text-white' };

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
      if (PLATFORMS[typeKey]) return PLATFORMS[typeKey];
    }
    
    const nameLower = product.name ? product.name.toLowerCase() : '';
    if (nameLower.includes('tiktok')) return PLATFORMS['tiktok'];
    if (nameLower.includes('insta')) return PLATFORMS['instagram'];
    if (nameLower.includes('face')) return PLATFORMS['facebook'];
    if (nameLower.includes('tube')) return PLATFORMS['youtube'];
    if (nameLower.includes('kick')) return PLATFORMS['kick'];
    if (nameLower.includes('spotify')) return PLATFORMS['spotify'];

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
          className="fixed bottom-6 left-6 z-50 flex w-64 md:w-72 overflow-hidden border-2 border-black bg-[#ccff00] p-2.5 text-black shadow-[4px_4px_0px_white]"
        >
          <div className={`shrink-0 flex items-center justify-center h-8 w-8 border-2 border-black ${currentStyle.color}`}>
            <Zap size={14} strokeWidth={2.5} className="text-current" />
          </div>
          <div className="flex flex-col ml-3">
            <span className="text-[10px] font-black text-black tracking-widest">{currentStyle.label.toUpperCase()}</span>
            <span className="text-xs font-bold text-black line-clamp-1">{notification.item}</span>
            <div className="mt-0.5 flex items-center gap-1 text-[9px] text-zinc-600 font-bold">
              <ShieldCheck size={9} className="text-zinc-500" />
              <span>Compra verificada</span>
              <span className="mx-1">•</span>
              <span>{notification.time}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}