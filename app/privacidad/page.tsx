export default function Privacidad() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-20 text-slate-300">
      <div className="mx-auto max-w-4xl space-y-8">
        
        {/* ENCABEZADO */}
        <div className="border-b border-white/10 pb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Política de Privacidad</h1>
          <p className="text-sm text-slate-500">Última actualización: Enero 2026</p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed md:text-base">
          
          <p className="text-slate-400">
            En <strong>SocialBoost Perú</strong>, nos tomamos muy en serio tu privacidad. Esta política describe cómo recopilamos, 
            usamos y protegemos tu información personal cuando utilizas nuestro sitio web y servicios. 
            Al utilizar nuestros servicios, aceptas las prácticas descritas aquí.
          </p>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 text-pink-500">1. Información que recopilamos</h2>
            <p className="mb-2">Para procesar tus pedidos, solo recopilamos la información estrictamente necesaria:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li><strong>Datos Públicos:</strong> Enlaces a perfiles de redes sociales (URL), nombres de usuario (@usuario) y enlaces a publicaciones multimedia.</li>
              <li><strong>Datos de Contacto:</strong> Número de teléfono (para soporte vía WhatsApp) y correo electrónico (opcional, para recibos).</li>
              <li><strong>Datos Técnicos:</strong> Dirección IP, tipo de navegador y datos de uso para prevención de fraude y análisis de seguridad.</li>
            </ul>
            <div className="mt-4 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg text-emerald-200 text-sm font-medium">
              🔒 IMPORTANTE: <strong>NUNCA te pediremos tu contraseña</strong> de Instagram, TikTok, Facebook ni ninguna otra red social. Si alguien te la pide en nuestro nombre, es una estafa.
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 text-pink-500">2. Uso de la Información</h2>
            <p>Utilizamos tus datos exclusivamente para los siguientes fines:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
              <li><strong>Procesamiento de Pedidos:</strong> Enviar los seguidores/likes a la URL proporcionada.</li>
              <li><strong>Soporte al Cliente:</strong> Contactarte vía WhatsApp si hay un problema con tu enlace (ej: perfil privado).</li>
              <li><strong>Seguridad:</strong> Detectar y bloquear transacciones fraudulentas o intentos de estafa.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 text-pink-500">3. Pagos y Datos Financieros</h2>
            <p>
              <strong>SocialBoost Perú NO almacena ni tiene acceso a los datos de tu tarjeta de crédito o débito.</strong>
            </p>
            <p className="mt-2">
              Todas las transacciones son procesadas a través de pasarelas de pago externas y seguras:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
              <li><strong>Mercado Pago:</strong> Procesa los pagos con tarjeta con encriptación de grado bancario.</li>
              <li><strong>Yape / Plin:</strong> Las transferencias se realizan directamente desde tu aplicación bancaria. Nosotros solo verificamos el número de operación y la captura de pantalla para confirmar el pago.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 text-pink-500">4. Cookies y Tecnologías de Rastreo</h2>
            <p>
              Utilizamos cookies esenciales y herramientas de análisis (como Vercel Analytics) para entender cómo interactúan los usuarios con nuestra tienda y mejorar la velocidad de carga. No utilizamos cookies para vender tus datos a terceros anunciantes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 text-pink-500">5. Confidencialidad y Terceros</h2>
            <p>
              Respetamos tu anonimato. <strong>No vendemos, alquilamos ni compartimos tu información personal con terceros</strong>, excepto en los siguientes casos estrictamente necesarios:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
              <li><strong>Proveedores de Servicio:</strong> Compartimos únicamente la URL pública y la cantidad solicitada con nuestros proveedores técnicos mayoristas para ejecutar la entrega de los seguidores/likes.</li>
              <li><strong>Cumplimiento Legal:</strong> Si una autoridad judicial peruana lo requiere mediante orden oficial.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 text-pink-500">6. Tus Derechos</h2>
            <p>
              Conforme a la normativa vigente, tienes derecho a solicitar la eliminación de tus datos de nuestros registros internos una vez completado el servicio. Para ello, puedes contactarnos directamente a través de nuestro botón de WhatsApp.
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