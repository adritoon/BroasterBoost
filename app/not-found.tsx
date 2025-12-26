import Link from 'next/link';
import { Ghost, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center">
      
      {/* Icono animado flotando */}
      <div className="mb-6 animate-bounce">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/5 shadow-2xl ring-1 ring-white/10">
          <Ghost className="h-12 w-12 text-slate-400" />
        </div>
      </div>

      {/* Título Grande */}
      <h1 className="mb-2 text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
        404
      </h1>

      <h2 className="mb-6 text-2xl font-bold text-white">
        Esta página no existe
      </h2>

      <p className="mb-8 max-w-md text-slate-400">
        Parece que te has perdido en el algoritmo. La página que buscas fue eliminada o nunca existió.
      </p>

      {/* Botón de regreso */}
      <Link 
        href="/"
        className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-slate-950 transition-transform hover:scale-105 hover:bg-slate-200"
      >
        <Home size={20} />
        Volver a la Tienda
      </Link>
      
    </main>
  );
}