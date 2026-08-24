import React from 'react';
import { 
  Instagram, 
  MessageCircle, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Download, 
  Clock,
  Heart,
  Info,
  Flame,
  CheckCircle2,
  Droplets
} from 'lucide-react';
import { siteConfig, generateWhatsAppLink } from '../config/site';

interface FooterProps {
  onOpenExport: () => void;
  onOpenAdmin: () => void;
  onOpenQuiz: () => void;
  onScrollToCatalog: () => void;
  onScrollToDelivery: () => void;
  onScrollToTrust: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenExport,
  onOpenAdmin,
  onOpenQuiz,
  onScrollToCatalog,
  onScrollToDelivery,
  onScrollToTrust
}) => {
  return (
    <footer className="bg-[#08090b] border-t border-[#d4af37]/20 text-[#a8a192] pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand & Slogan Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[#d4af37] text-lg font-serif">✦</span>
              <span className="text-2xl font-display font-black tracking-[0.25em] text-white uppercase">
                DEALBO
              </span>
              <span className="text-sm font-sans tracking-[0.3em] font-light text-[#d4af37] uppercase">
                PARFUM
              </span>
            </div>

            <p className="text-base font-serif italic text-[#f5ebd7] font-medium tracking-wide">
              “NO TE VAYAS SIN OLER BIEN”
            </p>

            <p className="text-xs sm:text-sm text-[#8c8577] max-w-sm leading-relaxed font-light">
              Selección exclusiva de perfumes de alta concentración y estela duradera. Asesoramiento personalizado y entregas rápidas en Jardín América y Posadas, Misiones.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-[#14151a] hover:bg-[#d4af37] hover:text-black border border-white/10 text-white transition-all cursor-pointer"
                title="Instagram @dealbo.parfum"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href={generateWhatsAppLink("Hola Dealbo Parfum, quiero hacer una consulta.")}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-[#14151a] hover:bg-[#25D366] hover:text-black border border-white/10 text-[#25D366] transition-all cursor-pointer"
                title="WhatsApp Oficial"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              <a
                href={siteConfig.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl bg-[#14151a] hover:border-[#d4af37] border border-white/10 text-white text-xs font-semibold transition-all"
              >
                TikTok
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-display font-bold uppercase tracking-widest text-[#d4af37]">
              NAVEGACIÓN
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onScrollToCatalog}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Catálogo de Perfumes
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenQuiz}
                  className="hover:text-[#d4af37] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-[#d4af37]" />
                  <span>Test de Fragancias</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onScrollToDelivery}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Envíos en Misiones
                </button>
              </li>
              <li>
                <button
                  onClick={onScrollToTrust}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  ¿Por qué elegir Dealbo?
                </button>
              </li>
            </ul>
          </div>

          {/* Locations & Coverage Column */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-display font-bold uppercase tracking-widest text-[#d4af37]">
              LOCALIDADES MISIONES
            </h4>
            <div className="space-y-2.5 text-xs text-[#8c8577]">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-sans">Jardín América</strong>
                  <span>Entregas locales directas y puntos de encuentro.</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-sans">Posadas</strong>
                  <span>Envíos a domicilio y zonas céntricas.</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#25D366] pt-1">
                <Clock className="w-3 h-3" />
                <span>Atención y pedidos 24/7 en línea</span>
              </div>
            </div>
          </div>

          {/* Actions & Utilities Column */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-display font-bold uppercase tracking-widest text-[#d4af37]">
              HERRAMIENTAS
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenExport}
                  className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-[#d4af37]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Instalar / PDF</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-white transition-colors cursor-pointer text-[#777]"
                >
                  Panel de Gestión Stock
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Legal Clarification Disclaimer & Recommendations Card */}
        <div className="bg-gradient-to-r from-[#121318] via-[#17181f] to-[#121318] border border-[#d4af37]/25 rounded-2xl p-5 sm:p-7 shadow-xl space-y-5">
          
          {/* Main Legal Disclaimer */}
          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#d4af37] shrink-0 mt-0.5">
              <Info className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <h5 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#ede5d4] flex items-center gap-2">
                Aclaración Importante sobre Nuestros Perfumes
              </h5>
              <p className="text-xs sm:text-sm text-[#beb7a6] leading-relaxed">
                <strong className="text-[#e8cb6b] font-semibold">Estos perfumes son inspiraciones olfativas de alta calidad basadas en fragancias reales de diseñador y nicho.</strong> No comercializamos productos originales de las marcas registradas mencionadas. Los nombres, marcas y referencias olfativas se utilizan con un fin exclusivamente orientativo y descriptivo para que el cliente pueda reconocer la familia y el estilo aromático de cada fragancia.
              </p>
            </div>
          </div>

          <div className="h-px bg-white/10 w-full" />

          {/* Expert Recommendations & Best Practices */}
          <div>
            <h6 className="text-xs font-bold uppercase tracking-widest text-[#d4af37] mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              Recomendaciones del Especialista para Maximizar tu Perfume
            </h6>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              
              <div className="p-3 rounded-xl bg-[#0e0f13] border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-[#e5c76c] font-semibold">
                  <Droplets className="w-4 h-4 text-[#d4af37]" />
                  <span>Puntos de Pulso</span>
                </div>
                <p className="text-[#9e9788] text-[11px] leading-relaxed">
                  Aplicá en cuello, muñecas y detrás de las orejas. El calor corporal activa la estela.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#0e0f13] border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-[#e5c76c] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
                  <span>Piel Hidratada</span>
                </div>
                <p className="text-[#9e9788] text-[11px] leading-relaxed">
                  Una piel bien humectada (con crema neutra) retiene las moléculas aromáticas hasta 3 veces más tiempo.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#0e0f13] border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-[#e5c76c] font-semibold">
                  <Flame className="w-4 h-4 text-[#d4af37]" />
                  <span>No Frotar las Muñecas</span>
                </div>
                <p className="text-[#9e9788] text-[11px] leading-relaxed">
                  Evitá frotar después de rociar para no romper las delicadas notas de salida y conservar el aroma puro.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#0e0f13] border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-[#e5c76c] font-semibold">
                  <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                  <span>Cuidado y Guardado</span>
                </div>
                <p className="text-[#9e9788] text-[11px] leading-relaxed">
                  Guardá tus frascos lejos de la luz solar directa y la humedad para preservar su máxima concentración.
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Copyright & Guarantee */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6e685d]">
          <p>© {new Date().getFullYear()} DEALBO PARFUM. Todos los derechos reservados. “No te vayas sin oler bien”.</p>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Hecho con dedicación en Misiones, Argentina</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
