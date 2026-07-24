export default function Privacidad() {
  return (
    <main className="min-h-screen bg-[#050505] px-4 py-20 text-slate-300 font-sans">
      <div className="mx-auto max-w-4xl space-y-8">
        
        {/* ENCABEZADO */}
        <div className="border-b-2 border-[#333] pb-6">
          <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tight">Política de Privacidad</h1>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Última actualización: Enero 2026</p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed md:text-base">
          
          <p className="text-slate-400 font-medium">
            En <strong>SocialBoost Perú</strong>, nos tomamos muy en serio tu privacidad. Esta política describe cómo recopilamos, 
            usamos y protegemos tu información personal cuando utilizas nuestro sitio web y servicios. 
            Al utilizar nuestros servicios, aceptas las prácticas descritas aquí.
          </p>

          <section className="bg-[#111] border-2 border-[#333] p-6 shadow-[8px_8px_0px_#ccff00]">
            <h2 className="text-xl font-black text-[#ccff00] mb-3 uppercase tracking-wider">1. Información que recopilamos</h2>
            <p className="mb-2 font-medium">Para procesar tus pedidos, solo recopilamos la información estrictamente necesaria:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li><strong>Datos Públicos:</strong> Enlaces a perfiles de redes sociales (URL), nombres de usuario (@usuario) y enlaces a publicaciones multimedia.</li>
              <li><strong>Datos de Contacto:</strong> Número de teléfono (para soporte vía WhatsApp) y correo electrónico (opcional, para recibos).</li>
              <li><strong>Datos Técnicos:</strong> Dirección IP, tipo de navegador y datos de uso para prevención de fraude y análisis de seguridad.</li>
            </ul>
            <div className="mt-4 bg-[#ccff00] border-2 border-black p-3 text-black text-sm font-black uppercase tracking-widest shadow-[4px_4px_0px_white]">
              🔒 IMPORTANTE: <strong>NUNCA te pediremos tu contraseña</strong> de Instagram, TikTok, Facebook ni ninguna otra red social. Si alguien te la pide en nuestro nombre, es una estafa.
            </div>
          </section>

          <section className="bg-[#111] border-2 border-[#333] p-6 shadow-[8px_8px_0px_#ccff00]">
            <h2 className="text-xl font-black text-[#ccff00] mb-3 uppercase tracking-wider">2. Uso de la Información</h2>
            <p className="font-medium">Utilizamos tus datos exclusivamente para los siguientes fines:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
              <li><strong>Procesamiento de Pedidos:</strong> Enviar los seguidores/likes a la URL proporcionada.</li>
              <li><strong>Soporte al Cliente:</strong> Contactarte vía WhatsApp si hay un problema con tu enlace (ej: perfil privado).</li>
              <li><strong>Seguridad:</strong> Detectar y bloquear transacciones fraudulentas o intentos de estafa.</li>
            </ul>
          </section>

          <section className="bg-[#111] border-2 border-[#333] p-6 shadow-[8px_8px_0px_#ccff00]">
            <h2 className="text-xl font-black text-[#ccff00] mb-3 uppercase tracking-wider">3. Pagos y Datos Financieros</h2>
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

          <section className="bg-[#111] border-2 border-[#333] p-6 shadow-[8px_8px_0px_#ccff00]">
            <h2 className="text-xl font-black text-[#ccff00] mb-3 uppercase tracking-wider">4. Cookies y Tecnologías de Rastreo</h2>
            <p>
              Utilizamos cookies esenciales y herramientas de análisis (como Vercel Analytics) para entender cómo interactúan los usuarios con nuestra tienda y mejorar la velocidad de carga. No utilizamos cookies para vender tus datos a terceros anunciantes.
            </p>
          </section>

          <section className="bg-[#111] border-2 border-[#333] p-6 shadow-[8px_8px_0px_#ccff00]">
            <h2 className="text-xl font-black text-[#ccff00] mb-3 uppercase tracking-wider">5. Confidencialidad y Terceros</h2>
            <p>
              Respetamos tu anonimato. <strong>No vendemos, alquilamos ni compartimos tu información personal con terceros</strong>, excepto en los siguientes casos estrictamente necesarios:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
              <li><strong>Proveedores de Servicio:</strong> Compartimos únicamente la URL pública y la cantidad solicitada con nuestros proveedores técnicos mayoristas para ejecutar la entrega de los seguidores/likes.</li>
              <li><strong>Cumplimiento Legal:</strong> Si una autoridad judicial peruana lo requiere mediante orden oficial.</li>
            </ul>
          </section>

          <section className="bg-[#111] border-2 border-[#333] p-6 shadow-[8px_8px_0px_#ccff00]">
            <h2 className="text-xl font-black text-[#ccff00] mb-3 uppercase tracking-wider">6. Tus Derechos</h2>
            <p>
              Conforme a la normativa vigente, tienes derecho a solicitar la eliminación de tus datos de nuestros registros internos una vez completado el servicio. Para ello, puedes contactarnos directamente a través de nuestro botón de WhatsApp.
            </p>
          </section>

        </div>
        
        <div className="pt-8 border-t-2 border-[#333]">
          <a href="/" className="inline-flex items-center gap-2 bg-[#ccff00] text-black border-2 border-black px-6 py-3 font-black uppercase tracking-widest shadow-[4px_4px_0px_white] hover:-translate-y-1 transition-transform">
            <span>←</span> Volver a la Tienda
          </a>
        </div>
      </div>
    </main>
  );
}