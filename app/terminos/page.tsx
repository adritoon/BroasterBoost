export default function Terminos() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-20 text-slate-300">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="border-b border-white/10 pb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Términos y Condiciones de Uso</h1>
          <p className="text-sm text-slate-500">Última actualización: Enero 2026</p>
        </div>
        
        <div className="space-y-6 text-sm leading-relaxed md:text-base">
          
          <section>
            <h2 className="text-xl font-bold text-white mb-3 text-pink-500">1. Aceptación del Servicio</h2>
            <p>
              Al realizar una compra en <strong>SocialBoost Perú</strong>, usted confirma que ha leído, entendido y aceptado estos términos. 
              Somos un servicio de intermediación de marketing digital. Usted acepta que al comprar seguidores, likes o vistas, 
              lo hace bajo su propia responsabilidad y conocimiento de las normas de las redes sociales involucradas.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 text-pink-500">2. Política de Perfiles Privados (IMPORTANTE)</h2>
            <p className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg text-red-200">
              <strong>Es responsabilidad exclusiva del cliente mantener su perfil en modo "PÚBLICO"</strong> durante todo el proceso de entrega.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
              <li>Si su cuenta está en modo "Privado" al momento del pedido, el sistema marcará la orden como completada y <strong>NO se realizará reembolso</strong>.</li>
              <li>No cambie su nombre de usuario ni ponga la cuenta en privado mientras el pedido está en proceso. Esto cancelará la entrega sin derecho a devolución.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 text-pink-500">3. Garantía y Reposición (Refill)</h2>
            <p>
              Ofrecemos una garantía de reposición de <strong>30 días</strong> para la mayoría de nuestros servicios, salvo que se especifique lo contrario (ej: servicios etiquetados como "Sin Garantía" o "Sin Refill").
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
              <li>Si sus seguidores caen dentro del periodo de garantía, debe contactarnos por WhatsApp con su ID de pedido para solicitar la reposición.</li>
              <li>La garantía se anula si el usuario compra seguidores en otro proveedor simultáneamente (ya que no podemos distinguir cuáles se perdieron).</li>
              <li>La garantía se anula si el usuario cambia su nombre de perfil (@usuario).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 text-pink-500">4. Pagos, Reembolsos y Disputas</h2>
            <p>
              Debido a la naturaleza digital e intangible de nuestros productos:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
              <li><strong>No ofrecemos reembolsos de dinero</strong> una vez que el pedido ha sido procesado o enviado. Solo ofrecemos crédito en la tienda o reposición del servicio.</li>
              <li>Si el enlace proporcionado es incorrecto o inválido, no podemos revertir el proceso ni devolver el dinero.</li>
              <li><strong>Política Anti-Fraude:</strong> Cualquier intento de disputa no autorizada o contracargo (chargeback) a través de MercadoPago o su banco resultará en la <strong>suspensión permanente</strong> de su acceso a la tienda, la anulación de todos los seguidores/likes enviados y el reporte de sus datos a listas negras de comercio electrónico.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 text-pink-500">5. Descargo de Responsabilidad</h2>
            <p>
              SocialBoost Perú no está afiliado, asociado ni respaldado por Instagram, Facebook, TikTok, YouTube, Spotify, Kick ni sus socios.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
              <li>No nos hacemos responsables por suspensiones, eliminaciones de cuenta o penalizaciones aplicadas por las redes sociales. Usted utiliza el servicio bajo su propio riesgo.</li>
              <li>Aunque utilizamos métodos seguros, los algoritmos de las redes sociales cambian constantemente y escapan a nuestro control.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 text-pink-500">6. Tiempos de Entrega</h2>
            <p>
              Los términos "Inmediato" o "Rápido" se refieren al inicio del procesamiento. La entrega total puede variar según la cantidad comprada y la carga del servidor.
              Pedidos grandes (ej: 10k seguidores) pueden tardar varios días en completarse para mantener la seguridad de la cuenta.
            </p>
          </section>

        </div>
        
        <div className="pt-8 border-t border-white/10">
          <a href="/" className="inline-flex items-center gap-2 text-pink-500 hover:text-pink-400 font-bold transition-colors">
            <span>←</span> Volver a la Tienda
          </a>
        </div>
      </div>
    </main>
  );
}