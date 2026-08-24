import React from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  MapPin, 
  ShieldCheck, 
  Sparkles,
  MessageCircle
} from 'lucide-react';
import { CartItem } from '../types';
import { formatPrice, siteConfig } from '../config/site';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (perfumeId: string, delta: number) => void;
  onRemoveItem: (perfumeId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout
}) => {
  if (!isOpen) return null;

  const totalAmount = items.reduce(
    (sum, item) => sum + item.perfume.price * item.quantity, 
    0
  );

  const totalItemsCount = items.reduce(
    (count, item) => count + item.quantity, 
    0
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0e0f13] border-l border-[#d4af37]/30 shadow-2xl flex flex-col justify-between text-[#ede8df]">
          
          {/* Header */}
          <div className="p-5 border-b border-white/10 bg-[#121317] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-white tracking-wide">
                  TU BOLSA DE COMPRA
                </h3>
                <span className="text-xs text-[#a0998b]">
                  {totalItemsCount} {totalItemsCount === 1 ? 'fragancia seleccionada' : 'fragancias seleccionadas'}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#999] hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Cerrar bolsa"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 px-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#18191e] border border-white/10 flex items-center justify-center mx-auto text-[#777]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-serif text-white">Tu bolsa está vacía</h4>
                <p className="text-xs text-[#8f887a] max-w-xs mx-auto leading-relaxed">
                  Explorá nuestro catálogo de fragancias exclusivas y encontrá la que mejor va con tu estilo.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa821c] text-[#0a0a0a] font-bold text-xs uppercase tracking-wider shadow-md hover:scale-102 transition-transform cursor-pointer"
                >
                  Explorar Perfumes
                </button>
              </div>
            ) : (
              items.map(({ perfume, quantity }) => (
                <div
                  key={perfume.id}
                  className="p-3.5 rounded-2xl bg-[#14151a] border border-[#d4af37]/20 flex gap-3 relative group"
                >
                  {/* Thumbnail */}
                  <img
                    src={perfume.image}
                    alt={perfume.name}
                    className="w-20 h-24 object-cover rounded-xl border border-white/10 shrink-0 bg-black/40"
                  />

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-display tracking-widest text-[#d4af37] block">
                            {perfume.brand}
                          </span>
                          <h5 className="text-sm font-serif font-bold text-white line-clamp-1">
                            {perfume.name}
                          </h5>
                          <span className="text-[11px] text-[#8e8779]">
                            {perfume.volumeMl} ml • {perfume.concentration}
                          </span>
                        </div>

                        {/* Delete button */}
                        <button
                          onClick={() => onRemoveItem(perfume.id)}
                          className="p-1.5 text-[#777] hover:text-red-400 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/5">
                      {/* Counter */}
                      <div className="flex items-center rounded-lg bg-[#1b1c22] border border-white/10 p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(perfume.id, -1)}
                          className="p-1 text-[#aaa] hover:text-white rounded transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-white min-w-[1.5rem] text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(perfume.id, 1)}
                          className="p-1 text-[#aaa] hover:text-white rounded transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Total Item Price */}
                      <span className="text-sm font-bold font-display text-white">
                        {formatPrice(perfume.price * quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-white/10 bg-[#121317] space-y-4">
              
              {/* Location Badge */}
              <div className="p-2.5 rounded-xl bg-[#181920] border border-[#d4af37]/20 flex items-center gap-2 text-xs text-[#cfc7b6]">
                <MapPin className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>Envíos locales en <strong>Jardín América</strong> y <strong>Posadas</strong>.</span>
              </div>

              {/* Subtotal & Total */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-[#8f887b]">
                  <span>Subtotal ({totalItemsCount} fragancias)</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-base sm:text-lg font-bold text-white pt-1 border-t border-white/5">
                  <span className="font-serif">TOTAL A PAGAR</span>
                  <span className="font-display text-[#f5ebd2]">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <div className="space-y-2">
                <button
                  id="btn-proceed-checkout"
                  onClick={() => {
                    onClose();
                    onProceedToCheckout();
                  }}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c76c] to-[#aa821c] text-[#0a0a0a] font-bold text-sm tracking-wider uppercase shadow-[0_4px_20px_rgba(212,175,55,0.4)] hover:shadow-[0_6px_25px_rgba(212,175,55,0.55)] hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>CONTINUAR PEDIDO</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onClearCart}
                  className="w-full text-center text-xs text-[#777] hover:text-red-400 py-1 transition-colors"
                >
                  Vaciar carrito
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
