'use client';

import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { getCurrentPromo, FlashPromo } from '@/lib/products';

// Format remaining time into a readable string
function formatTime(ms: number): { display: string; isUrgent: boolean; seconds: number } {
  if (ms <= 0) return { display: '0:00', isUrgent: true, seconds: 0 };

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const isUrgent = totalSeconds < 300; // Less than 5 minutes

  if (hours > 0) {
    return {
      display: `${hours}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`,
      isUrgent,
      seconds: totalSeconds,
    };
  }
  return {
    display: `${minutes}:${seconds.toString().padStart(2, '0')}`,
    isUrgent,
    seconds: totalSeconds,
  };
}

export function PromoBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [dismissedPromoId, setDismissedPromoId] = useState<string | null>(null);
  const [promoState, setPromoState] = useState<{
    promo: FlashPromo;
    remainingMs: number;
    totalMs: number;
  } | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const updatePromo = useCallback(() => {
    const result = getCurrentPromo();
    if (!result) {
      setPromoState(null);
      return;
    }

    setPromoState(prev => {
      // If the promo changed, trigger transition animation
      if (prev && prev.promo.id !== result.promo.id) {
        setIsTransitioning(true);
        setDismissed(false); // Re-show banner for new promo
        setDismissedPromoId(null);
        setTimeout(() => setIsTransitioning(false), 300);
      }
      return result;
    });
  }, []);

  useEffect(() => {
    updatePromo(); // Initial
    const interval = setInterval(updatePromo, 1000); // Update every second
    return () => clearInterval(interval);
  }, [updatePromo]);

  // Don't render if no promo, dismissed, or expired
  if (!promoState) return null;
  if (dismissed && dismissedPromoId === promoState.promo.id) return null;
  if (promoState.remainingMs <= 0) return null;

  const { promo, remainingMs, totalMs } = promoState;
  const { display: timeDisplay, isUrgent } = formatTime(remainingMs);
  const progressPercent = ((totalMs - remainingMs) / totalMs) * 100;

  return (
    <div
      className={`relative z-[51] ${promo.bgColor} ${promo.textColor} border-b-2 border-black overflow-hidden transition-all duration-300 ${isTransitioning ? 'opacity-0 -translate-y-full' : 'opacity-100 translate-y-0'}`}
    >
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-[3px] bg-black/20 w-full">
        <div
          className="h-full bg-black/40 transition-[width] duration-1000 ease-linear"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="container mx-auto flex items-center justify-center gap-3 px-4 py-2 text-center text-sm font-black uppercase tracking-wider">
        
        {/* Main message */}
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5">
          <span className={isUrgent ? 'animate-promo-urgent' : ''}>
            {isUrgent ? '🔥 ¡ÚLTIMOS MINUTOS!' : promo.title}
          </span>
          <span>
            Código <strong className={`rounded px-2 py-0.5 text-xs ${promo.accentColor}`}>{promo.code}</strong> {promo.description}
          </span>
        </div>

        {/* Timer */}
        <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 text-xs font-black ${promo.accentColor} ${isUrgent ? 'animate-promo-urgent' : ''}`}>
          <span className="animate-promo-pulse">{isUrgent ? '🔥' : '⏰'}</span>
          <span className="tabular-nums">{timeDisplay}</span>
        </div>

        {/* Mobile timer (compact) */}
        <div className={`sm:hidden flex items-center gap-1 px-2 py-0.5 text-[10px] font-black ${promo.accentColor} ${isUrgent ? 'animate-promo-urgent' : ''}`}>
          <span className="tabular-nums">{timeDisplay}</span>
        </div>

        {/* Close button */}
        <button
          onClick={() => {
            setDismissed(true);
            setDismissedPromoId(promo.id);
          }}
          className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 ${promo.textColor} hover:bg-black/20 transition-colors`}
          aria-label="Cerrar banner de promoción"
        >
          <X size={16} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
