import React from 'react';
import { 
  Music, 
  Youtube, 
  Gamepad2, 
  Instagram, 
  Facebook, 
  Clock, 
  Users, 
  Zap 
} from 'lucide-react';

export function SeoContent() {
  return (
    <section className="container mx-auto px-4 py-16 border-t border-white/10">
      
      {/* TÍTULO PRINCIPAL SEO */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          Comprar Seguidores y Likes en Perú — #1 🇵🇪
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Catálogo completo de servicios para creadores de contenido, artistas, streamers y emprendedores. 
          Entrega automática, precios en Soles y pagos vía <b>Yape, Plin y Tarjeta</b>. Soporte 24/7 por WhatsApp.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">

        {/* --- 1. SPOTIFY (La Joya Oculta) --- */}
        <article className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-green-500/50 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-500/20 p-2 rounded-lg text-green-500">
              <Music size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Comprar Plays y Oyentes Spotify Perú</h3>
          </div>
          <p className="text-sm text-slate-400 mb-4 leading-relaxed">
            Impulsa tu carrera musical con nuestros servicios especializados. Ofrecemos 
            <b> Reproducciones (Plays) de Perú 🇵🇪</b> reales para posicionarte en el top local. 
            Aumenta tus <b>Oyentes Mensuales</b> para atraer a discográficas y compra 
            <b> Guardados (Saves)</b> para activar el algoritmo de recomendación.
          </p>
          <ul className="text-xs text-slate-500 space-y-1 list-disc pl-4">
            <li>Plays geolocalizados en Perú y Globales.</li>
            <li>Oyentes mensuales estables.</li>
            <li>Seguidores de artista para perfil verificado.</li>
          </ul>
        </article>

        {/* --- 2. KICK (Nicho Streamer) --- */}
        <article className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-green-400/50 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-400/20 p-2 rounded-lg text-green-400">
              <Gamepad2 size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Comprar Viewers y Seguidores Kick</h3>
          </div>
          <p className="text-sm text-slate-400 mb-4 leading-relaxed">
            Consigue el afiliado de Kick en tiempo récord. Proveemos <b>Viewers (Espectadores) estables</b> 
            con duraciones personalizadas: desde 15 minutos para pruebas hasta packs de 
            <b> 5 Horas para streams largos</b>. Seguidores reales para cumplir requisitos de monetización.
          </p>
          <ul className="text-xs text-slate-500 space-y-1 list-disc pl-4">
            <li>Bots de viewers indetectables (1h, 2h, 3h, 5h).</li>
            <li>Packs de 75 seguidores para afiliado.</li>
            <li>Estabilidad garantizada durante el directo.</li>
          </ul>
        </article>

        {/* --- 3. YOUTUBE (Monetización) --- */}
        <article className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-red-500/50 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-500/20 p-2 rounded-lg text-red-500">
              <Youtube size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Comprar Suscriptores y 4000 Horas YouTube</h3>
          </div>
          <p className="text-sm text-slate-400 mb-4 leading-relaxed">
            Todo lo que necesitas para monetizar tu canal. Vendemos las <b>4,000 Horas de Reproducción (Watchtime)</b> 
            y los 1,000 Suscriptores necesarios para el Partner. Además, impulsa tus videos cortos con 
            <b> Vistas para YouTube Shorts</b> de alta retención.
          </p>
          <ul className="text-xs text-slate-500 space-y-1 list-disc pl-4">
            <li>Suscriptores reales sin caídas (Non-drop).</li>
            <li>Horas de visualización para activar anuncios.</li>
            <li>Likes y Vistas para videos y Shorts.</li>
          </ul>
        </article>

        {/* --- 4. TIKTOK (Viralidad) --- */}
        <article className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-black/50 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-slate-800 p-2 rounded-lg text-white">
              {/* Icono custom de TikTok o genérico */}
              <Zap size={24} /> 
            </div>
            <h3 className="text-xl font-bold text-white">Comprar Seguidores y Likes TikTok Perú</h3>
          </div>
          <p className="text-sm text-slate-400 mb-4 leading-relaxed">
            Domina el algoritmo "Para Ti". Compra <b>Seguidores TikTok baratos</b> para habilitar los LIVEs 
            y el enlace en perfil. Packs de <b>10k Seguidores (Influencer)</b>, likes masivos y millones de vistas 
            para tus videos.
          </p>
          <ul className="text-xs text-slate-500 space-y-1 list-disc pl-4">
            <li>Habilita funciones de LIVE y Creator Fund.</li>
            <li>Vistas inmediatas para salir en tendencias.</li>
            <li>Precios desde S/ 3.00 con Yape.</li>
          </ul>
        </article>

        {/* --- 5. INSTAGRAM (Marca Personal) --- */}
        <article className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-pink-500/50 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-pink-500/20 p-2 rounded-lg text-pink-500">
              <Instagram size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Comprar Seguidores y Vistas Reels Instagram</h3>
          </div>
          <p className="text-sm text-slate-400 mb-4 leading-relaxed">
            Mejora tu presencia visual. Ofertas agresivas en <b>Vistas para Reels</b> (la forma más barata de crecer). 
            Seguidores de alta calidad y Likes para mejorar el engagement rate de tu cuenta.
          </p>
          <ul className="text-xs text-slate-500 space-y-1 list-disc pl-4">
            <li>Vistas Reels desde S/ 2.00 (Oferta).</li>
            <li>Seguidores con garantía de reposición.</li>
            <li>Likes automáticos para posts.</li>
          </ul>
        </article>

        {/* --- 6. FACEBOOK (Fanpages) --- */}
        <article className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-blue-600/50 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-600/20 p-2 rounded-lg text-blue-500">
              <Facebook size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Comprar Seguidores Facebook Fanpage Perú</h3>
          </div>
          <p className="text-sm text-slate-400 mb-4 leading-relaxed">
            Aumenta la credibilidad de tu negocio. <b>Seguidores para Páginas de Facebook</b> (Fanpages) 
            y Likes para publicaciones. Ideal para emprendedores peruanos que venden por redes sociales.
          </p>
        </article>
      </div>

      {/* --- SECCIÓN DE "ETIQUETAS" (SEO TÉCNICO) --- */}
      {/* Esto se ve como una nube de tags al final, Google lo ama para long-tail keywords */}
      <div className="border-t border-white/5 pt-8">
        <h4 className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">Búsquedas Frecuentes en Perú:</h4>
        <div className="flex flex-wrap gap-2 text-xs text-slate-600">
          {[
            // TikTok
            "Comprar seguidores TikTok Perú", "Seguidores TikTok baratos", "Likes TikTok con Yape",
            "Vistas TikTok Perú", "Viewers TikTok live Perú", "PK Battle TikTok comprar",
            "Seguidores TikTok reales", "Comprar seguidores TikTok con Yape",
            // Instagram
            "Comprar seguidores Instagram Perú", "Likes Instagram baratos",
            "Vistas Reels Instagram Perú", "Comprar likes Instagram con Yape",
            "Seguidores Instagram reales",
            // YouTube
            "Comprar suscriptores YouTube Perú", "4000 horas YouTube precio",
            "Watchtime YouTube comprar", "Vistas YouTube Shorts Perú",
            "Likes YouTube Perú", "Monetizar canal YouTube rápido",
            // Kick
            "Viewers Kick Perú", "Comprar seguidores Kick", "Afiliado Kick rápido",
            "Bot viewers Kick 24/7", "Boost Kick afiliado",
            // Facebook
            "Comprar seguidores Facebook Perú", "Likes Facebook Yape",
            "Seguidores Fanpage Perú", "Likes página Facebook",
            // Spotify
            "Comprar plays Spotify Perú", "Oyentes mensuales Spotify",
            "Guardados Spotify comprar", "Reproducciones Spotify Perú",
            "Seguidores artista Spotify",
            // Métodos de pago
            "Comprar seguidores con Yape", "Panel SMM Perú barato",
            "Comprar seguidores con Plin", "Panel SMM pagar con tarjeta",
            "Recargar seguidores con Plin",
            // Genéricos / Intención de búsqueda
            "Dónde comprar seguidores Perú", "Mejor página seguidores Perú",
            "SocialBoost Perú confiable", "Panel SMM Perú 2026",
            "Seguidores baratos Perú", "Boost redes sociales Perú",
            "Comprar seguidores reales Perú", "Crecer en redes sociales Perú",
            "Marketing redes sociales Perú"
          ].map((tag, i) => (
            <span key={i} className="bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
              {tag}
            </span>
          ))}
        </div>
      </div>

    </section>
  );
}