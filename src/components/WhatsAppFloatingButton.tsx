import React, { useState } from 'react';
import { MessageCircle, X, Sparkles } from 'lucide-react';
import { siteConfig, generateWhatsAppLink } from '../config/site';

export const WhatsAppFloatingButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
      
      {/* Dynamic contextual tooltip */}
      {showTooltip && (
        <div className="relative p-3 rounded-2xl bg-[#14161a] border border-[#d4af37]/35 shadow-2xl max-w-xs text-xs text-[#ede8df] animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-1.5 right-1.5 p-1 text-[#888] hover:text-white"
            aria-label="Cerrar aviso"
          >
            <X className="w-3 h-3" />
          </button>
          
          <div className="flex items-center gap-1.5 font-bold text-[#d4af37] mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Asesoramiento Dealbo Parfum</span>
          </div>
          
          <p className="text-[11px] text-[#b8b09f] leading-tight">
            ¿Dudas con una fragancia o entrega en Jardín América / Posadas? ¡Escribinos!
          </p>
        </div>
      )}

      {/* Main WhatsApp Floating Action Button */}
      <a
        id="btn-whatsapp-floating"
        href={generateWhatsAppLink("¡Hola Dealbo Parfum! Quiero hacer una consulta sobre el catálogo y entregas.")}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#25D366] to-[#128C7E] text-white flex items-center justify-center shadow-[0_8px_25px_rgba(37,211,102,0.4)] hover:shadow-[0_12px_35px_rgba(37,211,102,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer group border-2 border-white/20"
        title="Contactar por WhatsApp a Dealbo Parfum"
        aria-label="WhatsApp Dealbo Parfum"
      >
        <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />
      </a>

    </div>
  );
};
