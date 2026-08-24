import React from 'react';
import { Sparkles, HeartHandshake, MapPin, CheckCircle, ShieldCheck } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const pillars = [
    {
      icon: Sparkles,
      title: 'PERFUMES SELECCIONADOS',
      description: 'Fragancias elegidas minuciosamente pensando en máxima calidad, fijación prolongada y variedad de estilos olfativos.',
      highlight: 'Calidad Premium'
    },
    {
      icon: HeartHandshake,
      title: 'ATENCIÓN PERSONALIZADA',
      description: 'Te asesoramos paso a paso para que encuentres una fragancia que realmente vaya con tu personalidad y cada ocasión.',
      highlight: 'Asesoramiento 1 a 1'
    },
    {
      icon: MapPin,
      title: 'ENVÍOS LOCALES',
      description: 'Entregas coordinadas y rápidas en Jardín América y Posadas, con opciones a domicilio o puntos de retiro acordados.',
      highlight: 'Jardín América & Posadas'
    },
    {
      icon: CheckCircle,
      title: 'STOCK DISPONIBLE',
      description: 'Catálogo en línea siempre actualizado las 24 horas para consultar disponibilidad inmediata sin sorpresas.',
      highlight: 'Catálogo 24/7'
    }
  ];

  return (
    <section id="por-que-dealbo" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
      
      {/* Title */}
      <div className="text-center space-y-3 mb-12 sm:mb-16">
        <p className="text-xs font-display tracking-[0.35em] text-[#d4af37] uppercase font-semibold">
          NUESTRO COMPROMISO
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight uppercase">
          ¿POR QUÉ <span className="gold-gradient-text">DEALBO PARFUM</span>?
        </h2>
        <p className="text-sm sm:text-base text-[#a39c8c] max-w-xl mx-auto font-light">
          Construimos una experiencia de compra transparente, exclusiva y cercana para los amantes de las buenas fragancias en Misiones.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map((pillar, index) => {
          const Icon = pillar.icon;
          return (
            <div
              key={index}
              className="p-6 sm:p-7 rounded-2xl luxury-card luxury-card-hover border border-[#d4af37]/20 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#1a1b22] border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] group-hover:scale-110 group-hover:border-[#d4af37] transition-all duration-300 shadow-md">
                  <Icon className="w-6 h-6" />
                </div>

                <span className="text-[10px] font-display uppercase tracking-widest text-[#d4af37] block font-bold">
                  {pillar.highlight}
                </span>

                <h3 className="text-base font-serif font-bold text-white tracking-wide">
                  {pillar.title}
                </h3>

                <p className="text-xs text-[#9c9586] leading-relaxed font-light">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-[#777]">
                <span>Pilar 0{index + 1}</span>
                <span className="text-[#d4af37]">✦</span>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
