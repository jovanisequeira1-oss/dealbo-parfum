import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Sparkles, 
  Clock, 
  Wind, 
  Layers, 
  CheckCircle2, 
  MessageCircle, 
  Share2, 
  Heart,
  Calendar,
  AlertCircle,
  Plus,
  Minus
} from 'lucide-react';
import { Perfume } from '../types';
import { formatPrice, generateWhatsAppLink, getPublicStoreUrl } from '../config/site';

interface ProductDetailModalProps {
  perfume: Perfume | null;
  onClose: () => void;
  onAddToCart: (perfume: Perfume, quantity?: number) => void;
  onToggleFavorite: (id: string) => void;
  isFavorite: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  perfume,
  onClose,
  onAddToCart,
  onToggleFavorite,
  isFavorite
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [copied, setCopied] = useState(false);

  if (!perfume) return null;

  const handleShare = () => {
    const publicUrl = `${getPublicStoreUrl()}/#perfume-${perfume.id}`;
    const text = `${perfume.name} de ${perfume.brand} en DEALBO PARFUM - “NO TE VAYAS SIN OLER BIEN”`;
    if (navigator.share) {
      navigator.share({
        title: `${perfume.name} | DEALBO PARFUM`,
        text: text,
        url: publicUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDirectWhatsApp = () => {
    const msg = `¡Hola Dealbo Parfum! Quiero consultar disponibilidad y comprar el perfume:\n*${perfume.name}* - ${perfume.brand}\n• Tamaño: ${perfume.volumeMl} ml\n• Precio: ${formatPrice(perfume.price)}\n• Cantidad: ${quantity}\n¿Cómo coordinamos la entrega en Jardín América o Posadas?`;
    window.open(generateWhatsAppLink(msg), '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div 
        className="relative w-full max-w-4xl rounded-3xl bg-[#0f1014] border border-[#d4af37]/35 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden z-10 my-auto text-[#ede8df]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 text-[#ded7c8] hover:text-white hover:bg-black/90 border border-white/10 transition-all cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[90vh] overflow-y-auto">
          
          {/* Left Column: Big Visual Image & Badges */}
          <div className="md:col-span-5 bg-[#14151a] relative min-h-[320px] md:min-h-[500px] flex items-center justify-center overflow-hidden">
            <img
              src={perfume.image}
              alt={`${perfume.name} - ${perfume.brand}`}
              className="w-full h-full object-cover object-center max-h-[500px]"
            />
            
            {/* Gradient shadow */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f1014] via-transparent to-black/20" />

            {/* Badges on image */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {perfume.inStock ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase bg-[#092b15]/90 text-emerald-300 border border-emerald-500/50 backdrop-blur-md shadow-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  🟢 EN STOCK ({perfume.stockQuantity} disp.)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase bg-[#300f12]/90 text-red-300 border border-red-500/50 backdrop-blur-md shadow-md">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  🔴 SIN STOCK
                </span>
              )}

              {perfume.isBestSeller && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold uppercase bg-[#d4af37]/25 text-[#f5ebd2] border border-[#d4af37]/50 backdrop-blur-md">
                  <Sparkles className="w-3 h-3 text-[#d4af37]" />
                  MÁS VENDIDO
                </span>
              )}
            </div>

            {/* Favorite & Share buttons on image */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <button
                onClick={() => onToggleFavorite(perfume.id)}
                className={`p-2.5 rounded-full backdrop-blur-md border transition-all flex items-center gap-1.5 text-xs font-medium ${
                  isFavorite 
                    ? 'bg-rose-950/80 text-rose-300 border-rose-500/50' 
                    : 'bg-black/60 text-white/80 border-white/10 hover:text-rose-300'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-400 text-rose-400' : ''}`} />
                <span>{isFavorite ? 'En Favoritos' : 'Favorito'}</span>
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 rounded-full bg-black/60 text-white/80 hover:text-white border border-white/10 backdrop-blur-md text-xs flex items-center gap-1.5"
              >
                <Share2 className="w-4 h-4 text-[#d4af37]" />
                <span>{copied ? '¡Copiado!' : 'Compartir'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Full Specifications, Feelings & Purchase */}
          <div className="md:col-span-7 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            
            {/* Header info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-display tracking-[0.25em] uppercase text-[#d4af37] font-semibold">
                  {perfume.brand}
                </span>
                <span className="text-xs text-[#a09a8c] uppercase tracking-wider bg-white/5 px-2.5 py-0.5 rounded-full">
                  {perfume.gender.toUpperCase()} • {perfume.concentration}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
                {perfume.name}
              </h2>

              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl sm:text-3xl font-display font-black text-white">
                  {formatPrice(perfume.price)}
                </span>
                {perfume.originalPrice && (
                  <span className="text-sm text-[#7a7468] line-through">
                    {formatPrice(perfume.originalPrice)}
                  </span>
                )}
                <span className="text-xs text-[#a8a191] ml-auto">
                  Frasco {perfume.volumeMl} ml
                </span>
              </div>
            </div>

            {/* Main Description */}
            <p className="text-sm text-[#bbb3a3] leading-relaxed font-light">
              {perfume.description}
            </p>

            {/* Highlight Box: ¿A QUÉ HUELE? */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#17181c] to-[#121316] border border-[#d4af37]/25 space-y-1.5 shadow-inner">
              <div className="flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-[#d4af37]">
                <Sparkles className="w-4 h-4" />
                <span>¿A QUÉ HUELE?</span>
              </div>
              <p className="text-xs sm:text-sm text-[#ded8cb] italic font-serif leading-relaxed">
                “{perfume.feelsLike}”
              </p>
            </div>

            {/* Olfactory Notes Breakdown */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-display font-semibold tracking-widest text-[#9e9788] uppercase flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#d4af37]" />
                PIRÁMIDE OLFATIVA
              </h4>

              <div className="grid grid-cols-3 gap-2 text-xs">
                {/* Salida */}
                <div className="p-2.5 rounded-xl bg-[#14161a] border border-white/5 space-y-1">
                  <span className="text-[10px] text-[#d4af37] font-semibold uppercase block">
                    Salida (Primeros 15m)
                  </span>
                  <p className="text-[11px] text-[#cfc7b6] font-medium leading-tight">
                    {perfume.olfactoryNotes.top.join(', ')}
                  </p>
                </div>

                {/* Corazón */}
                <div className="p-2.5 rounded-xl bg-[#14161a] border border-white/5 space-y-1">
                  <span className="text-[10px] text-[#d4af37] font-semibold uppercase block">
                    Corazón (2 - 5h)
                  </span>
                  <p className="text-[11px] text-[#cfc7b6] font-medium leading-tight">
                    {perfume.olfactoryNotes.heart.join(', ')}
                  </p>
                </div>

                {/* Fondo */}
                <div className="p-2.5 rounded-xl bg-[#14161a] border border-white/5 space-y-1">
                  <span className="text-[10px] text-[#d4af37] font-semibold uppercase block">
                    Fondo (Fijación)
                  </span>
                  <p className="text-[11px] text-[#cfc7b6] font-medium leading-tight">
                    {perfume.olfactoryNotes.base.join(', ')}
                  </p>
                </div>
              </div>
            </div>

            {/* Technical Specs: Duración & Proyección */}
            <div className="grid grid-cols-2 gap-3 text-xs border-y border-white/10 py-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#d4af37] shrink-0" />
                <div>
                  <span className="text-[10px] text-[#888] uppercase block">Duración en Piel</span>
                  <span className="font-semibold text-white">{perfume.longevity}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-[#d4af37] shrink-0" />
                <div>
                  <span className="text-[10px] text-[#888] uppercase block">Estela y Proyección</span>
                  <span className="font-semibold text-white">{perfume.projection}</span>
                </div>
              </div>
            </div>

            {/* Highlight: PERFECTO PARA */}
            <div className="space-y-2">
              <h4 className="text-xs font-display font-semibold tracking-widest text-[#9e9788] uppercase">
                PERFECTO PARA:
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {perfume.perfectFor.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-[#1b1c21] border border-[#d4af37]/20 text-[#ede7d8]"
                  >
                    <CheckCircle2 className="w-3 h-3 text-[#d4af37]" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions & Quantity */}
            <div className="pt-4 space-y-3">
              
              {perfume.inStock ? (
                <div className="flex items-center gap-3">
                  {/* Quantity Selector */}
                  <div className="flex items-center rounded-xl bg-[#16171c] border border-white/15 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 text-[#aaa] hover:text-white rounded-lg transition-colors cursor-pointer"
                      aria-label="Disminuir cantidad"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-sm font-bold text-white min-w-[2rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(perfume.stockQuantity, quantity + 1))}
                      className="p-2 text-[#aaa] hover:text-white rounded-lg transition-colors cursor-pointer"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    id="btn-add-to-cart-modal"
                    onClick={() => {
                      onAddToCart(perfume, quantity);
                      onClose();
                    }}
                    className="flex-1 py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c76c] to-[#aa821c] text-[#0a0a0a] font-bold text-xs sm:text-sm tracking-wider uppercase shadow-[0_4px_20px_rgba(212,175,55,0.35)] hover:shadow-[0_6px_25px_rgba(212,175,55,0.5)] hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>AGREGAR AL CARRITO • {formatPrice(perfume.price * quantity)}</span>
                  </button>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Actualmente sin stock. Podés consultar por WhatsApp para encargar o avisarte cuando reingrese.</span>
                </div>
              )}

              {/* Direct WhatsApp Ordering / Consultation */}
              <button
                onClick={handleDirectWhatsApp}
                className="w-full py-3 px-4 rounded-xl bg-[#17181d] hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40 hover:border-[#25D366] text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Consultar o pedir directamente por WhatsApp</span>
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
