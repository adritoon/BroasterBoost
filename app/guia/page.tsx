import Link from 'next/link';
import { ArrowLeft, Unlock, ShieldCheck, Globe, AlertTriangle } from 'lucide-react';
import { SeoContent } from '@/components/SeoContent';

export default function GuiaPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-pink-500/30">
      
      {/* HEADER */}
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Volver a la tienda</span>
          </Link>
        </div>
      </header>

      {/* CONTENT */}
      <section className="pt-32 pb-24 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-4">
              ¿Por qué el enlace completo y el perfil <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Público</span>?
            </h1>
            <p className="text-slate-400 text-lg">
              Son requisitos técnicos indispensables para que podamos procesar tu pedido de forma automática y mantener tu cuenta 100% segura.
            </p>
          </div>

          <div className="space-y-6">

            {/* RAZON 0 - ENLACE COMPLETO */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="mt-1 rounded-xl bg-blue-500/20 p-3 text-blue-400">
                  <Globe className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">1. ¿Por qué el enlace completo y no solo el usuario?</h3>
                  <p className="text-slate-400 leading-relaxed mb-3">
                    Existen miles de cuentas con nombres de usuario similares. Poner solo tu usuario (ej. <i>@juanperez</i>) puede hacer que el sistema envíe los seguidores a otra persona. El <b>enlace completo</b> (ej. <i>https://instagram.com/juanperez</i>) es el identificador único de tu cuenta.
                  </p>
                  <p className="text-slate-400 leading-relaxed">
                    Además, para servicios como <b>Likes o Vistas</b>, el sistema no tiene forma de adivinar a qué video quieres enviar las interacciones si solo nos das tu nombre. Necesitamos el link exacto del video o foto.
                  </p>
                </div>
              </div>
            </div>
            
            {/* RAZON 1 */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="mt-1 rounded-xl bg-pink-500/20 p-3 text-pink-400">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">2. Máxima Seguridad (Sin Contraseñas)</h3>
                  <p className="text-slate-400 leading-relaxed">
                    A diferencia de servicios fraudulentos, nosotros <b>nunca te pediremos la contraseña</b> de tu cuenta. Al no tener tu contraseña, la única manera en la que nuestro sistema puede interactuar con tu perfil (para enviarte seguidores, likes o vistas) es si este es visible para todos.
                  </p>
                </div>
              </div>
            </div>

            {/* RAZON 2 */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="mt-1 rounded-xl bg-purple-500/20 p-3 text-purple-400">
                  <Globe className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">3. Conexión Global (Perfil Público)</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Nuestros servidores están distribuidos a nivel global para brindar un servicio rápido. Si tu cuenta es privada, la plataforma (TikTok, Instagram, etc.) bloqueará automáticamente a nuestros servidores mostrando un error de "Acceso Denegado", impidiendo la entrega.
                  </p>
                </div>
              </div>
            </div>

            {/* RAZON 3 */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="mt-1 rounded-xl bg-emerald-500/20 p-3 text-emerald-400">
                  <Unlock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">4. ¿Qué hago después?</h3>
                  <p className="text-slate-400 leading-relaxed mb-4">
                    Solo necesitas mantener tu perfil en estado <b>público</b> hasta que el pedido marque como "Completado". Una vez que hayas recibido todos tus seguidores o interacciones, <b>puedes volver a poner tu perfil en privado</b> si así lo deseas.
                  </p>
                  <div className="bg-black/30 rounded-lg p-4 border border-white/5">
                    <h4 className="font-bold text-slate-300 mb-2">Cómo poner tu perfil público:</h4>
                    <ul className="list-disc list-inside text-sm text-slate-400 space-y-2">
                      <li><b>Tiktok:</b> Perfil {'>'} Menú superior {'>'} Privacidad {'>'} Desactivar "Cuenta privada".</li>
                      <li><b>Instagram:</b> Perfil {'>'} Menú {'>'} Configuración y privacidad {'>'} Privacidad de la cuenta {'>'} Desactivar "Cuenta privada".</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* ADVERTENCIA FINAL */}
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="mt-1 rounded-xl bg-red-500/20 p-3 text-red-500">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">⚠️ Importante: Política de Reembolsos</h3>
                  <p className="text-red-200/80 leading-relaxed">
                    Tal como se especifica en nuestros <Link href="/terminos" target="_blank" className="font-bold underline hover:text-white transition-colors">Términos y Condiciones</Link>, si proporcionas un enlace incorrecto, pones solo tu nombre de usuario o tu cuenta se encuentra privada durante el proceso de envío, <b>el sistema generará un error de entrega y el pedido se perderá sin opción a reembolso.</b> Por favor, revisa bien tus datos antes de continuar.
                  </p>
                </div>
              </div>
            </div>

          </div>

          <div className="mt-12 text-center">
            <Link 
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-8 py-4 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-pink-500/25 active:scale-95"
            >
              Entendido, volver a comprar
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer minimalista */}
      <footer className="border-t border-white/10 bg-slate-900 py-8 text-center text-sm text-slate-500">
        <p>© 2026 SocialBoost Perú. Todos los derechos reservados.</p>
      </footer>
    </main>
  );
}
