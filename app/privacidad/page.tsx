export default function Privacidad() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-20 text-slate-300">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold text-white mb-8">Política de Privacidad</h1>
        
        <p>Tu privacidad es seria para nosotros. Esta política describe cómo usamos tu información.</p>

        <section>
          <h2 className="text-xl font-bold text-white mb-2">Datos que recopilamos</h2>
          <p>Solo recopilamos la información necesaria para procesar tu pedido: tu enlace público de perfil/video y tu correo electrónico (si lo proporcionas). <strong>Nunca pediremos tu contraseña.</strong></p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-2">Seguridad</h2>
          <p>Los pagos son procesados por Mercado Pago y Yape de forma segura. Nosotros no almacenamos datos de tu tarjeta de crédito.</p>
        </section>
        
        <a href="/" className="inline-block mt-8 text-pink-500 hover:text-pink-400 font-bold">← Volver al Inicio</a>
      </div>
    </main>
  );
}