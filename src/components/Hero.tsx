import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, MapPin, Clock, MessageCircle } from 'lucide-react';
import { siteConfig, generateWhatsAppLink } from '../config/site';

interface HeroProps {
  onExploreCatalog: () => void;
  onQuickBuy: () => void;
  onOpenQuiz: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreCatalog,
  onQuickBuy,
  onOpenQuiz
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0a0b0d] via-[#101216] to-[#0c0d0f] pt-8 pb-16 md:pt-14 md:pb-24 border-b border-[#d4af37]/15">
      {/* Background ambient gold/dark orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#d4af37]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -top-24 right-10 w-96 h-96 bg-[#c5a059]/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Brand Copy, Slogan & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top Badge: Locations & 24/7 Stock */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#17181c] border border-[#d4af37]/30 text-[#e4dac4] text-xs shadow-inner">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-medium tracking-wide">
                Envíos en Jardín América & Posadas • Stock Activo
              </span>
            </div>

            {/* Brand Title & Central Slogan */}
            <div className="space-y-3">
              <p className="text-xs sm:text-sm font-display tracking-[0.4em] uppercase text-[#d4af37] font-semibold">
                ALTA PERFUMERÍA SELECCIONADA
              </p>
              
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-display font-black text-white tracking-tight uppercase leading-[1.05]">
                DEALBO <span className="gold-gradient-text">PARFUM</span>
              </h1>
              
              <div className="pt-2">
                <h2 className="text-xl sm:text-3xl md:text-4xl font-serif italic text-[#f5ebd7] font-normal tracking-wide">
                  “NO TE VAYAS SIN OLER BIEN”
                </h2>
              </div>
            </div>

            {/* Secondary Description */}
            <p className="text-base sm:text-lg text-[#b8b09f] max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
              Perfumes seleccionados para que encuentres una fragancia que realmente vaya con vos. 
              Calidad, distinción y presencia inolvidable en cada aplicación.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 sm:gap-4">
              {/* Primary CTA 1: Ver Perfumes */}
              <button
                id="hero-btn-ver-perfumes"
                onClick={onExploreCatalog}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c76c] to-[#aa821c] text-[#0a0a0a] font-bold text-sm tracking-wider uppercase shadow-[0_10px_25px_rgba(212,175,55,0.3)] hover:shadow-[0_15px_35px_rgba(212,175,55,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 group"
              >
                <span>VER PERFUMES</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Primary CTA 2: Comprar Ahora */}
              <button
                id="hero-btn-comprar-ahora"
                onClick={onQuickBuy}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#18191d] hover:bg-[#22242a] text-[#f7f2e7] font-semibold text-sm tracking-wider uppercase border border-[#d4af37]/40 hover:border-[#d4af37] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>COMPRAR AHORA</span>
              </button>

              {/* Secondary WhatsApp direct button */}
              <a
                href={generateWhatsAppLink("¡Hola Dealbo Parfum! Quiero consultar por el catálogo disponible y asesoramiento.")}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-[#18191d] hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40 hover:border-[#25D366] transition-all flex items-center justify-center"
                title="Consultar por WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>

            {/* Micro Highlights Badges */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-white/5 text-left">
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.02]">
                <MapPin className="w-4 h-4 text-[#d4af37] shrink-0" />
                <div>
                  <p className="text-[11px] font-bold text-[#ede8df] uppercase">Jardín América & Posadas</p>
                  <p className="text-[10px] text-[#8e8779]">Entregas locales</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.02]">
                <Clock className="w-4 h-4 text-[#d4af37] shrink-0" />
                <div>
                  <p className="text-[11px] font-bold text-[#ede8df] uppercase">Stock 24/7</p>
                  <p className="text-[10px] text-[#8e8779]">Disponibilidad en línea</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.02] col-span-2 sm:col-span-1">
                <ShieldCheck className="w-4 h-4 text-[#d4af37] shrink-0" />
                <div>
                  <p className="text-[11px] font-bold text-[#ede8df] uppercase">Fragancias Seleccionadas</p>
                  <p className="text-[10px] text-[#8e8779]">Máxima fijación y estela</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Luxury Bottle Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer decorative gold ring */}
              <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-tr from-[#d4af37]/30 via-transparent to-[#d4af37]/10 blur-sm -z-10" />

              <div className="relative rounded-2xl overflow-hidden border border-[#d4af37]/30 bg-[#121316] shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop"
                  alt="DEALBO PARFUM - Alta Perfumería"
                  className="w-full h-[420px] sm:h-[500px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />

                {/* Gradient overlay for luxury contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-black/20" />

                {/* Floating Highlight Card on top of image */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl backdrop-blur-md bg-[#0e1013]/85 border border-[#d4af37]/30 shadow-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] tracking-widest font-semibold uppercase text-[#d4af37]">
                      COLECCIÓN DESTACADA
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      🟢 EN STOCK
                    </span>
                  </div>
                  
                  <p className="text-base font-serif font-bold text-white tracking-wide">
                    Fragancias con Personalidad & Estela Duradera
                  </p>
                  
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-[#a09a8c]">
                      Asesoramiento personalizado sin cargo
                    </span>
                    <button
                      onClick={onOpenQuiz}
                      className="text-xs font-semibold text-[#d4af37] hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Descubrir</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
