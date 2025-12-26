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
    <section className="container mx-auto max-w-3xl px-4 pb-24">
      <h2 className="mb-8 text-center text-3xl font-bold text-white">
        Preguntas Frecuentes
      </h2>
      
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
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-colors hover:border-pink-500/30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 text-left font-medium text-slate-200 transition-colors hover:bg-white/5"
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <ChevronDown 
          className={`ml-4 h-5 w-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-pink-500' : ''}`} 
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
            <div className="border-t border-white/10 p-4 text-sm leading-relaxed text-slate-400 bg-black/20">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}