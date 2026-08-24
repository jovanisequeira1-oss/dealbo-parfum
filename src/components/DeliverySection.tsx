import React from 'react';
import { MapPin, Truck, Clock, ShieldCheck, MessageCircle, ArrowRight } from 'lucide-react';
import { siteConfig, generateWhatsAppLink } from '../config/site';

export const DeliverySection: React.FC = () => {
  return (
    <section id="envios-misiones" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#d4af37]/15">
      <div className="relative rounded-3xl luxury-card p-6 sm:p-10 md:p-14 overflow-hidden border border-[#d4af37]/30 shadow-2xl">
        
        {/* Background Subtle Gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#181a1f] border border-[#d4af37]/40 text-[#d4af37] text-xs uppercase tracking-widest font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              COBERTURA DIRECTA EN MISIONES
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight uppercase">
              ENVÍOS EN <span className="gold-gradient-text">JARDÍN AMÉRICA</span> Y <span className="gold-gradient-text">POSADAS</span>
            </h2>

            <p className="text-sm sm:text-base text-[#b0a998] leading-relaxed font-light">
              Dealbo Parfum realiza entregas locales rápidas y coordinadas para que disfrutes de tu fragancia favorita sin demoras. Podés solicitar envío directo a tu domicilio o coordinar retiro en puntos estratégicos.
            </p>

            {/* Two Key Location Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              
              {/* Jardín América */}
              <div className="p-4 rounded-2xl bg-[#14151a] border border-[#d4af37]/25 space-y-2">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-display">JARDÍN AMÉRICA</span>
                </div>
                <p className="text-xs text-[#9c9586] leading-relaxed">
                  {siteConfig.deliveryJardinAmerica}
                </p>
                <span className="inline-block text-[10px] text-[#d4af37] font-semibold tracking-wider uppercase">
                  ✓ Entregas en el día o coordinadas
                </span>
              </div>

              {/* Posadas */}
              <div className="p-4 rounded-2xl bg-[#14151a] border border-[#d4af37]/25 space-y-2">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="font-display">POSADAS</span>
                </div>
                <p className="text-xs text-[#9c9586] leading-relaxed">
                  {siteConfig.deliveryPosadas}
                </p>
                <span className="inline-block text-[10px] text-[#d4af37] font-semibold tracking-wider uppercase">
                  ✓ Envíos a domicilio & puntos céntricos
                </span>
              </div>

            </div>

            {/* WhatsApp Direct Consult Button */}
            <div className="pt-2">
              <a
                href={generateWhatsAppLink("Hola Dealbo Parfum, quiero consultar cómo son los envíos a mi zona.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#18191f] hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40 hover:border-[#25D366] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Consultar costo y tiempo exacto de envío</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

          {/* Right Visual Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#d4af37]/30 bg-[#14161a] shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=800&auto=format&fit=crop"
                alt="Envíos Dealbo Parfum"
                className="w-full h-72 sm:h-80 object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0f13] via-transparent to-black/30" />
              
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#0f1115]/90 border border-[#d4af37]/30 backdrop-blur-md space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#d4af37]">
                  <Clock className="w-4 h-4" />
                  <span>STOCK DISPONIBLE 24/7 EN LÍNEA</span>
                </div>
                <p className="text-[11px] text-[#a59e90]">
                  Hacé tu pedido en cualquier momento del día y te contactamos de inmediato para la entrega.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
