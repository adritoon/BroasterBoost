import { MousePointerClick, Link, Zap } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: MousePointerClick,
      color: "text-pink-500",
      bg: "bg-pink-500/10",
      title: "1. Elige tu Pack",
      desc: "Selecciona cuántos seguidores o likes necesitas para despegar."
    },
    {
      icon: Link,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      title: "2. Pega tu Link",
      desc: "Ingresa el enlace de tu perfil o video. No pedimos contraseña."
    },
    {
      icon: Zap,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      title: "3. Recibe la Magia",
      desc: "Paga seguro con Yape/Tarjeta y mira cómo suben tus números."
    }
  ];

  return (
    <section className="container mx-auto px-4 py-20 border-t border-white/5">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">¿Cómo funciona?</h2>
        <p className="text-slate-400">Impulsa tu cuenta en 3 pasos sencillos</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3 relative">
        {/* Línea conectora (solo visible en desktop) */}
        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 -z-10" />

        {steps.map((step, idx) => (
          <div key={idx} className="relative flex flex-col items-center text-center group">
            <div className={`w-24 h-24 rounded-2xl ${step.bg} flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300 border border-white/5`}>
              <step.icon size={40} className={step.color} />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
            <p className="text-sm text-slate-400 max-w-xs">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}