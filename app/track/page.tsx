import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function TrackPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-500/20">
        <CheckCircle className="h-12 w-12 text-green-500" />
      </div>
      
      <h1 className="text-4xl font-extrabold text-white mb-4">¡Pago Exitoso!</h1>
      
      <p className="text-lg text-slate-300 max-w-md mb-8">
        Gracias por tu compra. Tu pedido ha sido enviado al sistema automáticamente y verás los resultados en breves minutos.
      </p>

      <div className="bg-slate-900 border border-white/10 p-6 rounded-xl max-w-md w-full mb-8">
        <h3 className="text-white font-bold mb-2">¿Qué sigue?</h3>
        <ul className="text-sm text-slate-400 text-left space-y-2 list-disc pl-5">
          <li>No pongas tu cuenta en privado.</li>
          <li>La entrega suele iniciar en 10-30 minutos.</li>
          <li>Si compraste likes/vistas, llegarán gradualmente.</li>
        </ul>
      </div>

      <Link 
        href="/"
        className="rounded-full bg-white px-8 py-3 font-bold text-slate-950 transition hover:bg-slate-200"
      >
        Volver a la Tienda
      </Link>
    </main>
  );
}