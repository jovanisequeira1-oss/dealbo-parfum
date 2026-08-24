import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Truck, 
  CreditCard, 
  MessageCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  ArrowLeft,
  Store,
  Wallet
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, Localidad, DeliveryMethod, PaymentMethod, OrderDetails } from '../types';
import { formatPrice, siteConfig, generateWhatsAppLink } from '../config/site';
import { saveOrderLocally } from '../services/storage';
import { saveOrderToFirestore } from '../services/firebase';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderCompleted: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderCompleted
}) => {
  const totalAmount = items.reduce((sum, item) => sum + item.perfume.price * item.quantity, 0);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [locality, setLocality] = useState<Localidad>('Jardín América');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentPreference, setPaymentPreference] = useState<PaymentMethod>('Efectivo al recibir');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<OrderDetails | null>(null);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      alert('Por favor, ingresá tu nombre completo.');
      return;
    }
    if (!whatsapp.trim()) {
      alert('Por favor, ingresá tu número de WhatsApp para confirmar el pedido.');
      return;
    }
    if (deliveryMethod === 'delivery' && !address.trim()) {
      alert('Por favor, ingresá tu dirección de entrega en ' + locality + '.');
      return;
    }

    setIsSubmitting(true);

    const orderId = 'DB-' + Math.floor(100000 + Math.random() * 900000);

    const order: OrderDetails = {
      id: orderId,
      customerName: customerName.trim(),
      whatsapp: whatsapp.trim(),
      locality,
      deliveryMethod,
      address: address.trim() || 'Retiro acordado en punto céntrico',
      notes: notes.trim(),
      paymentPreference,
      items: items.map(i => ({
        perfumeId: i.perfume.id,
        name: i.perfume.name,
        brand: i.perfume.brand,
        volumeMl: i.perfume.volumeMl,
        price: i.perfume.price,
        quantity: i.quantity
      })),
      total: totalAmount,
      status: 'pending',
      createdAt: new Date().toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    // Save locally
    saveOrderLocally(order);

    // Save to Firestore asynchronously
    saveOrderToFirestore(order).catch(err => console.log('Firestore sync notice:', err));

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#ffffff', '#e6ca65', '#25D366']
      });
    } catch (err) {
      console.warn('Confetti error', err);
    }

    // Build structured WhatsApp message
    const itemsListText = items.map(
      (item, idx) => `${idx + 1}. *${item.perfume.name}* (${item.perfume.brand} ${item.perfume.volumeMl}ml)\n   - Cantidad: ${item.quantity} un.\n   - Subtotal: ${formatPrice(item.perfume.price * item.quantity)}`
    ).join('\n');

    const whatsappMessage = 
`✨ *NUEVO PEDIDO - DEALBO PARFUM* ✨
🔖 *Orden:* #${orderId}
“NO TE VAYAS SIN OLER BIEN”

👤 *Cliente:* ${customerName}
📱 *WhatsApp:* ${whatsapp}
📍 *Localidad:* ${locality}
🚚 *Método:* ${deliveryMethod === 'delivery' ? 'Envío a Domicilio' : 'Retiro / Entrega Acordada'}
🏠 *Dirección/Punto:* ${order.address}
💳 *Forma de Pago:* ${paymentPreference}
${notes ? `📝 *Nota:* ${notes}\n` : ''}
📦 *DETALLE DE FRAGANCIAS:*
${itemsListText}

💰 *TOTAL A PAGAR: ${formatPrice(totalAmount)}*

_Hola Dealbo Parfum, te comparto el pedido para coordinar la entrega y confirmación. ¡Muchas gracias!_`;

    setOrderConfirmed(order);
    setIsSubmitting(false);
    onOrderCompleted();

    // Auto launch WhatsApp in new tab
    const waLink = generateWhatsAppLink(whatsappMessage);
    window.open(waLink, '_blank');
  };

  const resetAndClose = () => {
    setOrderConfirmed(null);
    onClose();
  };

  if (!isOpen || (items.length === 0 && !orderConfirmed)) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={resetAndClose} />

      <div 
        className="relative w-full max-w-2xl rounded-3xl bg-[#0f1014] border border-[#d4af37]/35 shadow-2xl overflow-hidden z-10 my-auto text-[#ede8df]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 bg-[#121317] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-white tracking-wide">
                {orderConfirmed ? '¡PEDIDO ENVIADO CON ÉXITO!' : 'CONFIRMAR PEDIDO & ENTREGA'}
              </h3>
              <p className="text-xs text-[#a0998b]">
                {orderConfirmed ? 'Coordiná la entrega por WhatsApp' : 'Entregas en Jardín América y Posadas, Misiones'}
              </p>
            </div>
          </div>

          <button
            onClick={resetAndClose}
            className="p-2 rounded-full text-[#999] hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto">
          
          {orderConfirmed ? (
            /* Order Success View */
            <div className="text-center py-6 space-y-6">
              <div className="w-20 h-20 rounded-full bg-emerald-950/80 border-2 border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-display tracking-widest text-[#d4af37] uppercase font-bold">
                  ORDEN REGISTRADA #{orderConfirmed.id}
                </span>
                <h4 className="text-2xl font-serif font-bold text-white">
                  ¡Gracias por elegir DEALBO PARFUM!
                </h4>
                <p className="text-sm text-[#b5ad9e] max-w-md mx-auto">
                  Tu pedido ha sido preparado. Si la ventana de WhatsApp no se abrió automáticamente, tocá el botón de abajo para enviar el resumen y coordinar la entrega.
                </p>
              </div>

              {/* Order Summary Box */}
              <div className="p-4 rounded-2xl bg-[#14161a] border border-[#d4af37]/20 text-left space-y-2 text-xs">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-[#888]">Cliente:</span>
                  <span className="font-semibold text-white">{orderConfirmed.customerName}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-[#888]">Localidad:</span>
                  <span className="font-semibold text-[#d4af37]">{orderConfirmed.locality}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-[#888]">Modalidad:</span>
                  <span className="font-semibold text-white">
                    {orderConfirmed.deliveryMethod === 'delivery' ? 'Envío a Domicilio' : 'Retiro / Encuentro'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-[#888]">Total:</span>
                  <span className="font-bold text-sm text-white font-display">{formatPrice(orderConfirmed.total)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => {
                    const waLink = generateWhatsAppLink(
                      `¡Hola Dealbo Parfum! Confirmo mi pedido #${orderConfirmed.id} por valor de ${formatPrice(orderConfirmed.total)} para ${orderConfirmed.locality}.`
                    );
                    window.open(waLink, '_blank');
                  }}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold text-sm tracking-wider uppercase shadow-[0_4px_20px_rgba(37,211,102,0.35)] hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>ABRIR CHAT DE WHATSAPP</span>
                </button>

                <button
                  onClick={resetAndClose}
                  className="w-full py-3 px-4 rounded-xl bg-[#181a1f] hover:bg-[#202229] text-[#ded8cc] text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Volver a la Tienda
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form View */
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              
              {/* Order Items Preview */}
              <div className="p-3.5 rounded-2xl bg-[#14151a] border border-white/5 space-y-2">
                <span className="text-[11px] font-display uppercase tracking-widest text-[#a8a090] font-semibold block">
                  Resumen de Compra ({items.length} productos)
                </span>
                <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1">
                  {items.map((i) => (
                    <div key={i.perfume.id} className="flex items-center justify-between text-xs text-[#cfc7b6]">
                      <span className="line-clamp-1 flex-1">
                        {i.quantity}x {i.perfume.name} <span className="text-[#777]">({i.perfume.brand})</span>
                      </span>
                      <span className="font-semibold text-white ml-2">
                        {formatPrice(i.perfume.price * i.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-sm font-bold text-[#f5ebd2] pt-2 border-t border-white/10">
                  <span>TOTAL ESTIMADO</span>
                  <span className="font-display">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              {/* Step 1: Localidad */}
              <div className="space-y-2">
                <label className="text-xs font-display font-semibold tracking-wider text-[#d4af37] uppercase flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  1. Localidad de Entrega (Misiones)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['Jardín América', 'Posadas', 'Otra localidad (Misiones)'] as Localidad[]).map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setLocality(loc)}
                      className={`p-3 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                        locality === loc
                          ? 'bg-[#d4af37]/20 border-[#d4af37] text-white shadow-sm'
                          : 'bg-[#15161b] border-white/10 text-[#999] hover:text-white'
                      }`}
                    >
                      <div className="font-bold">{loc}</div>
                      <div className="text-[10px] text-[#888] mt-0.5">
                        {loc === 'Jardín América' && 'Entrega local directa'}
                        {loc === 'Posadas' && 'Envíos y puntos clave'}
                        {loc === 'Otra localidad (Misiones)' && 'A coordinar'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Modalidad de Entrega */}
              <div className="space-y-2">
                <label className="text-xs font-display font-semibold tracking-wider text-[#d4af37] uppercase flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" />
                  2. Método de Entrega
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('delivery')}
                    className={`p-3 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                      deliveryMethod === 'delivery'
                        ? 'bg-[#d4af37]/20 border-[#d4af37] text-white'
                        : 'bg-[#15161b] border-white/10 text-[#999] hover:text-white'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-[#d4af37] shrink-0" />
                    <div>
                      <div className="font-bold">Envío a Domicilio</div>
                      <div className="text-[10px] text-[#888]">Llega a tu puerta</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`p-3 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                      deliveryMethod === 'pickup'
                        ? 'bg-[#d4af37]/20 border-[#d4af37] text-white'
                        : 'bg-[#15161b] border-white/10 text-[#999] hover:text-white'
                    }`}
                  >
                    <Store className="w-4 h-4 text-[#d4af37] shrink-0" />
                    <div>
                      <div className="font-bold">Retiro / Encuentro</div>
                      <div className="text-[10px] text-[#888]">Punto acordado</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Step 3: Datos de Contacto y Dirección */}
              <div className="space-y-3">
                <label className="text-xs font-display font-semibold tracking-wider text-[#d4af37] uppercase">
                  3. Tus Datos para Coordinar
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-[#999] block mb-1">Nombre y Apellido *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ej: Juan Pérez"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#15161a] border border-white/10 text-white text-xs focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-[#999] block mb-1">Número de WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="Ej: 376 4123456"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#15161a] border border-white/10 text-white text-xs focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-[#999] block mb-1">
                    {deliveryMethod === 'delivery' ? 'Dirección completa (Calle, Altura, Barrio, Referencia) *' : 'Punto de encuentro preferido (Opcional)'}
                  </label>
                  <input
                    type="text"
                    required={deliveryMethod === 'delivery'}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={deliveryMethod === 'delivery' ? 'Ej: Av. San Martín 450, Jardín América' : 'Ej: Centro / Plaza principal'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#15161a] border border-white/10 text-white text-xs focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#999] block mb-1">Comentarios o notas (Opcional)</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ej: Es para regalo / Coordinar horario de tarde"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#15161a] border border-white/10 text-white text-xs focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              {/* Step 4: Forma de Pago */}
              <div className="space-y-2">
                <label className="text-xs font-display font-semibold tracking-wider text-[#d4af37] uppercase flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" />
                  4. Forma de Pago Preferida
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(['Efectivo al recibir', 'Transferencia bancaria / Alias', 'Mercado Pago'] as PaymentMethod[]).map((pay) => (
                    <button
                      key={pay}
                      type="button"
                      onClick={() => setPaymentPreference(pay)}
                      className={`p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                        paymentPreference === pay
                          ? 'bg-[#d4af37]/20 border-[#d4af37] text-white font-semibold'
                          : 'bg-[#15161b] border-white/10 text-[#999] hover:text-white'
                      }`}
                    >
                      {pay}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c76c] to-[#aa821c] text-[#0a0a0a] font-bold text-sm tracking-wider uppercase shadow-[0_4px_20px_rgba(212,175,55,0.4)] hover:shadow-[0_6px_25px_rgba(212,175,55,0.55)] hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 text-black" />
                  <span>{isSubmitting ? 'PROCESANDO...' : 'CONFIRMAR Y ENVIAR POR WHATSAPP'}</span>
                </button>

                <p className="text-[11px] text-[#888] text-center">
                  Al confirmar, se abrirá WhatsApp con el detalle listo para que nuestro equipo te asesore y coordine el envío.
                </p>
              </div>

            </form>
          )}

        </div>

      </div>

    </div>
  );
};
