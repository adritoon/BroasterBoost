'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

// DATA DE PREGUNTAS
const FAQS = [
  {
    question: "¿Necesitan mi contraseña para entregar el pedido?",
    answer: "¡NO! Nunca te pediremos tu contraseña. Solo necesitamos el enlace a tu perfil o publicación. Si alguien te pide contraseña, es una estafa."
  },
  {
    question: "¿Cuánto demora en llegar mi pedido?",
    answer: "Depende del servicio. La mayoría (Likes, Vistas) inician de inmediato o entre 0 a 15 minutos. Sin embargo, los pedidos grandes o servicios 'Elite' se entregan de forma GRADUAL (goteo) para simular un crecimiento orgánico. Esto es vital para que la red social no detecte actividad inusual y tu cuenta esté 100% segura."
  },
  {
    question: "¿Los seguidores se borran con el tiempo?",
    answer: "Ofrecemos servicios de alta calidad con garantía de reposición. Si notas una bajada en los primeros 30 días, contáctanos y repondremos los seguidores gratis."
  },
  {
    question: "¿Es seguro pagar con Tarjeta o Yape?",
    answer: "Totalmente. Usamos Mercado Pago para tarjetas (con protección antifraude) y para Yape/Plin el trato es directo con nuestra cuenta verificada, sin intermediarios riesgosos."
  },
  {
    question: "¿Qué hago si puse mal el link?",
    answer: "Escríbenos inmediatamente al botón de WhatsApp flotante con tu comprobante. Si el sistema aún no ha procesado el pedido, podemos corregir el enlace manualmente al instante."
  }
];

export function FAQSection() {
  return (
    <section className="container mx-auto max-w-4xl px-4 py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 uppercase tracking-tight">Preguntas Frecuentes</h2>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">Todo lo que necesitas saber</p>
      </div>
      <div className="space-y-4">
        {FAQS.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </section>
  );
}

// Sub-componente interno para cada ítem
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-2 border-[#333] bg-[#111] transition-colors hover:border-[#555]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-5 text-left font-black text-white transition-colors hover:bg-[#222] uppercase tracking-wider text-sm"
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <ChevronDown 
          className={`ml-4 h-6 w-6 text-zinc-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#ccff00]' : ''}`} 
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t-2 border-[#333] p-5 text-sm leading-relaxed text-zinc-400 font-medium bg-[#0a0a0a]">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}