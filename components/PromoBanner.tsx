'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { PROMO_CONFIG } from '@/lib/products';

// Calculates time remaining until end of current month
function getTimeRemaining() {
  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  const diff = endOfMonth.getTime() - now.getTime();

  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, expired: true };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    expired: false,
  };
}

const STORAGE_KEY = 'promo-banner-dismissed';

// Get current month name in Spanish
function getMonthName() {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return months[new Date().getMonth()];
}

export function PromoBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining());

  useEffect(() => {
    // Update countdown every minute
    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining());
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  if (!PROMO_CONFIG.isActive || dismissed || timeLeft.expired) return null;

  return (
    <div className="relative z-[51] bg-[#ccff00] text-black border-b-2 border-black">
      <div className="container mx-auto flex items-center justify-center gap-3 px-4 py-2 text-center text-sm font-black uppercase tracking-wider">
        
        {/* Message */}
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5">
          <span>
            {PROMO_CONFIG.title.includes('{mes}') ? PROMO_CONFIG.title.replace('{mes}', getMonthName()) : PROMO_CONFIG.title}
          </span>
          <span>
            Menciona <strong className="rounded bg-black px-2 py-0.5 text-xs text-[#ccff00]">{PROMO_CONFIG.code}</strong> {PROMO_CONFIG.description}
          </span>
        </div>

        {/* Timer */}
        {PROMO_CONFIG.showTimer && (
          <div className="hidden sm:flex items-center gap-1 bg-black px-3 py-1 text-xs text-[#ccff00]">
            <span className="animate-promo-pulse">⏰</span>
            <span>{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m</span>
          </div>
        )}

        {/* Close button */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-black hover:bg-black hover:text-[#ccff00] transition-colors"
          aria-label="Cerrar banner de promoción"
        >
          <X size={16} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
