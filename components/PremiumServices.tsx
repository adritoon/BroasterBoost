// components/PremiumServices.tsx
import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
// Importa el tipo Product de donde lo tengas definido (ajusta la ruta si es necesario)
import { Product } from '@/lib/products';
import { motion, AnimatePresence } from 'framer-motion';

const PREMIUM_SERVICES = [
  {
    id: 'premium-verificacion',
    badge: 'Servicio Exclusivo',
    name: 'Bloqueo de SIM + Celular',
    description: 'Solo necesitamos el número de celular y el titular. Solo se puede bloquear números personales, no empresariales. Al ser un servicio especializado, el pago se realiza directamente por Yape.',
    price: 99.00,
    inputLabel: 'Número y titular',
    inputPlaceholder: '999456751, Alfredo Lopez Soto',
    isActive: true,
    isAvailable: true,
  },
  {
    id: 'premium-recuperacion',
    badge: 'Soporte VIP',
    name: 'Recuperación de Cuentas Banned',
    description: '¿Te banearon en TikTok o Instagram? Nuestro equipo técnico apela directamente con soporte. Paga solo por el intento. Pago manual vía Yape.',
    price: 150.00,
    inputLabel: 'Enlace del perfil baneado',
    inputPlaceholder: 'https://instagram.com/tu_perfil',
    isActive: false,
    isAvailable: false,
  }
  // Para agregar otro mañana, solo copias un bloque de estos y cambias el texto.
];

interface PremiumServicesProps {
  // Esta función es la llave maestra para conectarse con el page.tsx
  onOpenYapeModal: (product: Product, link: string) => void;
}

export function PremiumServices({ onOpenYapeModal }: PremiumServicesProps) {
  // El estado de los links se queda aquí, porque solo le importa a este componente
  const [premiumLinks, setPremiumLinks] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 4000);
  };

  const handlePayment = (service: any) => {
    const currentLink = premiumLinks[service.id];

    if (!currentLink || currentLink.length < 3) {
      showError("Por favor ingresa un enlace o usuario válido.");
      return;
    }

    // Convertimos el servicio premium al formato que espera tu modal
    const productForModal: Product = {
      id: service.id,
      name: service.name,
      price: service.price,
      provider_id: 0,
      provider_quantity: 1,
      type: 'instagram', // Filler necesario
      service_type: 'followers', // Filler necesario
      icon: 'star',
    };

    // Llamamos a la función que nos pasaron desde el padre (page.tsx)
    onOpenYapeModal(productForModal, currentLink);
  };

  return (
    <section className="container mx-auto max-w-5xl px-4 pb-24 space-y-8">
      {PREMIUM_SERVICES.filter(s => s.isActive !== false).map((service) => (
        <div 
          key={service.id}
          className={`relative overflow-hidden p-8 transition-all border-2 bg-[#111] ${
            service.isAvailable === false ? 'border-[#333] opacity-90' : 'border-[#ccff00]'
          }`}
        >

          <div className="relative flex flex-col md:flex-row gap-10 items-center justify-between">
            
            {/* Lado Izquierdo: Textos */}
            <div className="flex-1 space-y-5 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                {service.badge && (
                  <span className="inline-block bg-[#ccff00] text-black px-3 py-1 text-xs font-black uppercase tracking-widest mb-2">
                    {service.badge}
                  </span>
                )}
                {service.isAvailable === false && (
                  <span className="inline-block bg-[#333] px-3 py-1 text-xs font-bold text-white uppercase tracking-widest">
                    Agotado
                  </span>
                )}
              </div>

              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                {service.name}
              </h2>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto md:mx-0">
                {service.description}
              </p>
              <div className={`text-4xl font-black ${service.isAvailable === false ? 'text-zinc-500' : 'text-white'}`}>
                S/ {service.price.toFixed(2)}
              </div>
            </div>

            {/* Lado Derecho: Inputs y Botón */}
            <div className="w-full md:w-96 bg-[#111] p-6 border border-[#333]">
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wider">
                    {service.inputLabel || "Enlace o Nombre de Usuario"}
                  </label>
                  <input
                    type="text"
                    placeholder={service.inputPlaceholder || "https://..."}
                    value={premiumLinks[service.id] || ''}
                    onChange={(e) => setPremiumLinks({...premiumLinks, [service.id]: e.target.value})}
                    disabled={service.isAvailable === false}
                    className={`w-full py-3 px-4 text-sm transition-colors border-2 ${
                      service.isAvailable === false 
                      ? 'bg-[#111] border-[#333] text-zinc-600 cursor-not-allowed' 
                      : 'bg-[#050505] border-[#333] text-white placeholder:text-zinc-600 focus:border-[#ccff00] focus:outline-none'
                    }`}
                  />
                </div>
                <button
                  onClick={() => handlePayment(service)}
                  disabled={service.isAvailable === false}
                  className={`w-full flex items-center justify-center gap-2 font-black py-4 transition-all border-2 ${
                    service.isAvailable === false
                    ? 'bg-[#111] text-[#333] border-[#333] cursor-not-allowed'
                    : 'bg-[#ccff00] text-black border-[#ccff00] hover:bg-transparent hover:text-[#ccff00]'
                  }`}
                >
                  {service.isAvailable === false ? (
                    'No Disponible'
                  ) : (
                    <>
                      <MessageCircle size={20} />
                      Yapear y Contactar
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      ))}

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
    </section>
  );
}