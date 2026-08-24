import React from 'react';
import { ShoppingBag, Eye, Heart, Sparkles, MessageCircle } from 'lucide-react';
import { Perfume } from '../types';
import { formatPrice, generateWhatsAppLink } from '../config/site';

interface ProductCardProps {
  perfume: Perfume;
  onViewDetails: (perfume: Perfume) => void;
  onAddToCart: (perfume: Perfume) => void;
  onToggleFavorite: (id: string) => void;
  isFavorite: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  perfume,
  onViewDetails,
  onAddToCart,
  onToggleFavorite,
  isFavorite
}) => {
  const handleWhatsAppConsult = (e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = `Hola Dealbo Parfum, quiero consultar por el perfume ${perfume.name} de ${perfume.brand} (${perfume.volumeMl}ml - ${formatPrice(perfume.price)}). ¿Tienen disponibilidad?`;
    window.open(generateWhatsAppLink(msg), '_blank');
  };

  return (
    <div 
      id={`perfume-card-${perfume.id}`}
      className="group relative rounded-2xl luxury-card luxury-card-hover overflow-hidden flex flex-col justify-between border border-[#d4af37]/20 hover:border-[#d4af37]/50 transition-all duration-300"
    >
      {/* Top Image Container */}
      <div 
        onClick={() => onViewDetails(perfume)}
        className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#15161a] cursor-pointer"
      >
        <img
          src={perfume.image}
          alt={`${perfume.name} - ${perfume.brand}`}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
        />
        
        {/* Soft dark vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1013] via-transparent to-black/20 opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {/* Stock Status Badge */}
          {perfume.inStock ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#092b15]/90 text-emerald-300 border border-emerald-500/40 backdrop-blur-md shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              🟢 EN STOCK
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#300f12]/90 text-red-300 border border-red-500/40 backdrop-blur-md shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              🔴 SIN STOCK
            </span>
          )}

          {/* Best Seller / New Badge */}
          {perfume.isBestSeller && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#d4af37]/20 text-[#f7eecf] border border-[#d4af37]/40 backdrop-blur-md">
              <Sparkles className="w-2.5 h-2.5 text-[#d4af37]" />
              MÁS VENDIDO
            </span>
          )}

          {perfume.isNew && !perfume.isBestSeller && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-blue-500/20 text-blue-200 border border-blue-400/30 backdrop-blur-md">
              NUEVO
            </span>
          )}
        </div>

        {/* Action icons on top right */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(perfume.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md border transition-all ${
              isFavorite 
                ? 'bg-rose-950/80 text-rose-400 border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.3)]' 
                : 'bg-black/40 text-white/70 border-white/10 hover:text-rose-400 hover:bg-black/70'
            }`}
            title={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
            aria-label="Favorito"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-400 text-rose-400' : ''}`} />
          </button>
        </div>

        {/* Concentration and Volume pill */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
          <span className="text-[11px] font-medium tracking-wider uppercase text-[#d5cebf] bg-black/60 px-2.5 py-0.5 rounded-md backdrop-blur-md border border-white/10">
            {perfume.gender.toUpperCase()} • {perfume.volumeMl} ML
          </span>
          <span className="text-[10px] tracking-wider text-[#d4af37] bg-[#1a160d]/80 px-2 py-0.5 rounded-md border border-[#d4af37]/30">
            {perfume.concentration}
          </span>
        </div>
      </div>

      {/* Card Content & Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Brand Name */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-display tracking-[0.2em] uppercase text-[#a39c8c] font-semibold">
              {perfume.brand}
            </span>
            <span className="text-[10px] text-[#777] uppercase tracking-wider">
              {perfume.family.split(' ')[0]}
            </span>
          </div>

          {/* Perfume Name */}
          <h3 
            onClick={() => onViewDetails(perfume)}
            className="text-lg font-serif font-bold text-white group-hover:text-[#f3ecd8] transition-colors mt-1 cursor-pointer line-clamp-1"
            title={perfume.name}
          >
            {perfume.name}
          </h3>

          {/* Feels Like Scent Note Snippet */}
          <p className="text-xs text-[#9c9586] mt-1.5 line-clamp-2 leading-relaxed">
            {perfume.feelsLike}
          </p>

          {/* Olfactory Notes Pill Preview */}
          <div className="flex flex-wrap gap-1 mt-3">
            {perfume.olfactoryNotes.top.slice(0, 3).map((note, idx) => (
              <span 
                key={idx} 
                className="text-[10px] text-[#cfc7b4] bg-[#1d1f24] px-2 py-0.5 rounded-full border border-white/5"
              >
                {note}
              </span>
            ))}
            {perfume.olfactoryNotes.top.length > 3 && (
              <span className="text-[10px] text-[#888] self-center">
                +{perfume.olfactoryNotes.top.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Primary Action Buttons */}
        <div className="pt-3 border-t border-white/10 space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-lg sm:text-xl font-bold font-display text-white tracking-wide">
                {formatPrice(perfume.price)}
              </span>
              {perfume.originalPrice && perfume.originalPrice > perfume.price && (
                <span className="ml-2 text-xs text-[#807a6e] line-through">
                  {formatPrice(perfume.originalPrice)}
                </span>
              )}
            </div>
            
            <span className="text-[11px] text-[#a59e90]">
              {perfume.stockQuantity > 0 ? `${perfume.stockQuantity} disp.` : 'Agotado'}
            </span>
          </div>

          {/* Two Main Buttons: "VER PERFUME" & "COMPRAR" */}
          <div className="grid grid-cols-2 gap-2">
            <button
              id={`btn-view-${perfume.id}`}
              onClick={() => onViewDetails(perfume)}
              className="w-full py-2.5 px-3 rounded-xl bg-[#1c1d22] hover:bg-[#272930] text-[#ded8cc] text-xs font-semibold tracking-wider uppercase border border-white/10 hover:border-[#d4af37]/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>VER PERFUME</span>
            </button>

            <button
              id={`btn-buy-${perfume.id}`}
              disabled={!perfume.inStock}
              onClick={() => onAddToCart(perfume)}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 shadow-md ${
                perfume.inStock
                  ? 'bg-gradient-to-r from-[#d4af37] via-[#e5c76c] to-[#aa821c] text-[#0a0a0a] hover:shadow-[0_4px_15px_rgba(212,175,55,0.4)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{perfume.inStock ? 'COMPRAR' : 'SIN STOCK'}</span>
            </button>
          </div>

          {/* Quick WhatsApp Inquiry for this perfume */}
          <button
            onClick={handleWhatsAppConsult}
            className="w-full text-center text-[11px] text-[#8e887a] hover:text-[#25D366] transition-colors flex items-center justify-center gap-1 pt-0.5 cursor-pointer"
          >
            <MessageCircle className="w-3 h-3 text-[#25D366]" />
            <span>Consultar disponibilidad directa por WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
