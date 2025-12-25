'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, MapPin } from 'lucide-react';
import { PRODUCTS } from '@/lib/products'; // <--- 1. IMPORTAMOS TUS PRODUCTOS REALES

const CITIES = [
  'Lima', 'Arequipa', 'Trujillo', 'Chiclayo', 'Piura', 'Cusco', 'Iquitos', 
  'Huancayo', 'Tacna', 'Juliaca', 'Ica', 'Cajamarca', 'Pucallpa', 'Sullana', 
  'Ayacucho', 'Chincha', 'Huánuco', 'Tarapoto', 'Puno', 'Chimbote'
];

const TIMES = ['Hace un momento', 'Hace 2 min', 'Hace 5 min', 'Hace 12 min', 'Hace 28 min', 'Hace 45 min'];

export function SalesNotification() {
  const [visible, setVisible] = useState(false);
  const [notification, setNotification] = useState({ city: '', item: '', time: '' });

  const generateSale = () => {
    const city = CITIES[Math.floor(Math.random() * CITIES.length)];
    
    // 2. ELEGIMOS UN PRODUCTO REAL DE TU LISTA
    const randomProduct = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
    const item = randomProduct.name; // Usamos el nombre real (ej: "1,000 Seguidores TikTok")
    
    const time = TIMES[Math.floor(Math.random() * TIMES.length)];

    return { city, item, time };
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const showRandomNotification = () => {
      setVisible(false);
      // Intervalo aleatorio entre 15 y 45 segundos
      const randomDelay = Math.floor(Math.random() * (45000 - 15000) + 15000);

      timeoutId = setTimeout(() => {
        setNotification(generateSale());
        setVisible(true);

        setTimeout(() => {
          setVisible(false);
          showRandomNotification();
        }, 6000); // Se muestra por 6 segundos

      }, randomDelay);
    };

    // Primera aparición a los 5 segundos
    const startTimeout = setTimeout(() => {
      setNotification(generateSale());
      setVisible(true);
      setTimeout(() => {
        setVisible(false);
        showRandomNotification();
      }, 6000);
    }, 5000);

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: -20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-4 left-4 z-50 max-w-[320px] md:bottom-6 md:left-6"
        >
          {/* Tarjeta Oscura y Minimalista */}
          <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-slate-950/90 p-4 shadow-2xl backdrop-blur-md ring-1 ring-white/5">
            
            {/* Ícono de Mapa/Ubicación */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
               <MapPin className="text-white h-5 w-5" />
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-100">
                Un cliente de {notification.city}
              </span>
              
              {/* Nombre del producto real */}
              <span className="text-xs text-slate-300 line-clamp-1">
                compró <span className="text-green-400 font-medium">{notification.item}</span>
              </span>
              
              <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-500">
                <ShieldCheck size={10} className="text-blue-400" />
                <span>Anónimo & Verificado • {notification.time}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}