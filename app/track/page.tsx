import Link from 'next/link';
import { Check } from 'lucide-react';

export default function TrackPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#ccff00] selection:text-black relative flex flex-col items-center justify-center p-4">
      {/* NEO-BRUTALIST GRID BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '32px 32px' }} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-md bg-white text-black p-8 border-4 border-black shadow-[8px_8px_0px_#ccff00] flex flex-col items-center text-center">
        
        <div className="mb-6 flex h-20 w-20 items-center justify-center bg-[#ccff00] border-4 border-black shadow-[4px_4px_0px_black]">
          <Check className="h-10 w-10 text-black stroke-[4px]" />
        </div>
        
        <h1 className="text-4xl font-black uppercase tracking-tight mb-2">¡Pago Exitoso!</h1>
        
        <p className="text-base font-bold text-zinc-600 uppercase tracking-widest mb-8">
          Tu pedido está en el horno
        </p>

        <div className="bg-[#111] text-white border-2 border-black p-6 w-full mb-8 text-left">
          <h3 className="font-black text-[#ccff00] uppercase tracking-wider mb-4 border-b-2 border-[#333] pb-2">Próximos Pasos</h3>
          <ul className="text-sm font-bold uppercase space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-[#ccff00] mt-0.5">▶</span>
              <span className="text-zinc-300">Mantén tu cuenta pública, no la pongas en privado.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#ccff00] mt-0.5">▶</span>
              <span className="text-zinc-300">La entrega suele iniciar entre 10 y 30 minutos.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#ccff00] mt-0.5">▶</span>
              <span className="text-zinc-300">Likes o Vistas llegarán gradualmente para verse naturales.</span>
            </li>
          </ul>
        </div>

        <Link 
          href="/"
          className="w-full bg-[#ccff00] border-4 border-black px-6 py-4 text-sm font-black uppercase tracking-widest text-black shadow-[4px_4px_0px_black] hover:-translate-y-1 hover:shadow-[8px_8px_0px_black] transition-all active:translate-y-0 active:shadow-[0px_0px_0px_black]"
        >
          Volver a la Tienda
        </Link>
      </div>
    </main>
  );
}