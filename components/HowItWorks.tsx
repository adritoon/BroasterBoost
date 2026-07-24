import { MousePointerClick, Link, Zap } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: MousePointerClick,
      color: "text-[#ccff00]",
      bg: "bg-[#111]",
      title: "1. Elige tu Pack",
      desc: "Selecciona cuántos seguidores o likes necesitas para despegar."
    },
    {
      icon: Link,
      color: "text-white",
      bg: "bg-[#111]",
      title: "2. Pega tu Link",
      desc: "Ingresa el enlace de tu perfil o video. Cero contraseñas."
    },
    {
      icon: Zap,
      color: "text-black",
      bg: "bg-[#ccff00]",
      title: "3. Recibe la Magia",
      desc: "Paga seguro con Yape o Tarjeta y mira cómo suben tus números."
    }
  ];

  return (
    <section className="container mx-auto px-4 py-24 border-t-2 border-[#333]">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 uppercase tracking-tight">¿Cómo funciona?</h2>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">Impulsa tu cuenta en 3 pasos directos</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 relative">
        {/* Línea conectora (solo visible en desktop) */}
        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-1 bg-[#333] -z-10" />

        {steps.map((step, idx) => (
          <div key={idx} className="relative flex flex-col items-center text-center group">
            <div className={`w-24 h-24 ${step.bg} flex items-center justify-center mb-6 transition-transform group-hover:-translate-y-2 duration-300 border-2 border-[#333]`}>
              <step.icon size={40} className={step.color} strokeWidth={2.5} />
            </div>
            
            <h3 className="text-xl font-black text-white mb-3 uppercase tracking-wider">{step.title}</h3>
            <p className="text-sm font-medium text-zinc-400 max-w-xs">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}