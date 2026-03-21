// components/PremiumServices.tsx
import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
// Importa el tipo Product de donde lo tengas definido (ajusta la ruta si es necesario)
import { Product } from '@/lib/products';

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

  const handlePayment = (service: any) => {
    const currentLink = premiumLinks[service.id];

    if (!currentLink || currentLink.length < 3) {
      alert("Por favor ingresa un enlace o usuario válido.");
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
          className={`relative overflow-hidden rounded-3xl border bg-gradient-to-br from-slate-900 to-slate-950 p-8 md:p-12 shadow-2xl transition-all ${
            service.isAvailable === false ? 'border-slate-800 opacity-90' : 'border-pink-500/30 shadow-pink-500/10'
          }`}
        >
          {/* Brillo decorativo */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-pink-500/10 blur-3xl pointer-events-none"></div>

          <div className="relative flex flex-col md:flex-row gap-10 items-center justify-between">
            
            {/* Lado Izquierdo: Textos */}
            <div className="flex-1 space-y-5 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <span className="inline-block rounded-full bg-pink-500/20 px-3 py-1 text-xs font-bold text-pink-400 border border-pink-500/30 uppercase tracking-widest">
                  {service.badge}
                </span>
                {service.isAvailable === false && (
                  <span className="inline-block rounded-full bg-red-500/20 px-3 py-1 text-xs font-bold text-red-400 border border-red-500/30 uppercase tracking-widest">
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
              <div className={`text-4xl font-black ${service.isAvailable === false ? 'text-slate-500' : 'text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500'}`}>
                S/ {service.price.toFixed(2)}
              </div>
            </div>

            {/* Lado Derecho: Inputs y Botón */}
            <div className="w-full md:w-96 rounded-2xl bg-white/5 p-6 border border-white/10 backdrop-blur-md">
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                    {service.inputLabel || "Enlace o Nombre de Usuario"}
                  </label>
                  <input
                    type="text"
                    placeholder={service.inputPlaceholder || "https://..."}
                    value={premiumLinks[service.id] || ''}
                    onChange={(e) => setPremiumLinks({...premiumLinks, [service.id]: e.target.value})}
                    disabled={service.isAvailable === false}
                    className={`w-full rounded-xl py-3.5 px-4 text-sm outline-none transition-all ${
                      service.isAvailable === false 
                      ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed' 
                      : 'bg-slate-950 border-slate-700 text-white placeholder:text-slate-600 focus:border-pink-500 focus:ring-1 focus:ring-pink-500'
                    }`}
                  />
                </div>
                <button
                  onClick={() => handlePayment(service)}
                  disabled={service.isAvailable === false}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl font-bold py-4 transition-all border shadow-lg ${
                    service.isAvailable === false
                    ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed shadow-none'
                    : 'bg-[#752384] text-white hover:bg-[#8e2aa0] hover:scale-[1.02] active:scale-[0.98] border-[#9b2eb0]/50 shadow-[#752384]/20'
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
    </section>
  );
}