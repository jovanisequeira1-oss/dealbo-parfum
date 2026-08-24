import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Cloud, 
  Database, 
  Download, 
  Check, 
  AlertCircle,
  Package,
  Sparkles,
  ShoppingBag,
  Share2,
  Copy,
  ExternalLink,
  MessageCircle,
  Clock,
  MapPin,
  RefreshCw,
  Eye,
  CheckCircle2,
  QrCode
} from 'lucide-react';
import { Perfume, ConcentrationType, OrderDetails } from '../types';
import { formatPrice, siteConfig, getPublicStoreUrl } from '../config/site';
import { 
  getFirebaseStatus, 
  savePerfumeToFirestore,
  updatePerfumeStockInFirestore,
  toggleStockStatusInFirestore,
  deletePerfumeFromFirestore,
  syncCatalogToFirestore, 
  seedInitialCatalogIfEmpty,
  subscribeToOrders,
  updateOrderStatusInFirestore
} from '../services/firebase';
import { resetToDefaultPerfumes } from '../services/storage';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  perfumes: Perfume[];
  onUpdatePerfumes: (newPerfumes: Perfume[]) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  perfumes,
  onUpdatePerfumes
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'add' | 'instagram' | 'firebase' | 'backup'>('inventory');
  const [firebaseStatus, setFirebaseStatus] = useState(getFirebaseStatus());
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedBio, setCopiedBio] = useState(false);

  // Real-time Orders state
  const [orders, setOrders] = useState<OrderDetails[]>([]);

  // Subscribe to real-time orders when modal opens
  useEffect(() => {
    if (!isOpen) return;
    const unsubscribe = subscribeToOrders((newOrders) => {
      setOrders(newOrders);
    });
    setFirebaseStatus(getFirebaseStatus());
    return () => unsubscribe();
  }, [isOpen]);

  // New Perfume Form State
  const [newPerfume, setNewPerfume] = useState<Partial<Perfume>>({
    name: '',
    brand: '',
    gender: 'unisex',
    volumeMl: 100,
    concentration: 'Eau de Parfum',
    price: 150000,
    inStock: true,
    stockQuantity: 3,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop',
    description: '',
    family: 'Amaderada Aromática',
    longevity: '8 - 10 horas',
    projection: 'Envolvente',
    feelsLike: '',
    perfectFor: ['Uso diario', 'Salidas nocturnas'],
    olfactoryNotes: {
      top: ['Bergamota', 'Lavanda'],
      heart: ['Jazmín', 'Cedro'],
      base: ['Vainilla', 'Ámbar']
    }
  });

  // Handle stock change with Firestore sync
  const handleStockChange = async (id: string, newStock: number) => {
    const qty = Math.max(0, newStock);
    const updated = perfumes.map(p => {
      if (p.id === id) {
        return {
          ...p,
          stockQuantity: qty,
          inStock: qty > 0
        };
      }
      return p;
    });
    onUpdatePerfumes(updated);
    await updatePerfumeStockInFirestore(id, qty);
  };

  // Toggle stock boolean with Firestore sync
  const handleToggleStock = async (id: string) => {
    const target = perfumes.find(p => p.id === id);
    if (!target) return;
    const nextInStock = !target.inStock;
    const nextQty = nextInStock ? (target.stockQuantity > 0 ? target.stockQuantity : 2) : 0;

    const updated = perfumes.map(p => {
      if (p.id === id) {
        return {
          ...p,
          inStock: nextInStock,
          stockQuantity: nextQty
        };
      }
      return p;
    });
    onUpdatePerfumes(updated);
    await toggleStockStatusInFirestore(id, target.inStock, target.stockQuantity);
  };

  // Update price with Firestore sync
  const handlePriceChange = async (id: string, newPrice: number) => {
    const price = Math.max(0, newPrice);
    const target = perfumes.find(p => p.id === id);
    if (!target) return;

    const updatedPerfume = { ...target, price };
    const updated = perfumes.map(p => (p.id === id ? updatedPerfume : p));
    onUpdatePerfumes(updated);
    await savePerfumeToFirestore(updatedPerfume);
  };

  // Delete product from Firestore
  const handleDeletePerfume = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este perfume del catálogo? Se actualizará en la nube.')) {
      const updated = perfumes.filter(p => p.id !== id);
      onUpdatePerfumes(updated);
      await deletePerfumeFromFirestore(id);
    }
  };

  // Add new product to Firestore
  const handleCreatePerfume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPerfume.name || !newPerfume.brand) {
      alert('Por favor ingresá el nombre y marca del perfume.');
      return;
    }

    const created: Perfume = {
      id: (newPerfume.name || 'perfume').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now().toString().slice(-4),
      name: newPerfume.name || '',
      brand: newPerfume.brand || '',
      gender: newPerfume.gender || 'unisex',
      volumeMl: Number(newPerfume.volumeMl) || 100,
      concentration: (newPerfume.concentration as ConcentrationType) || 'Eau de Parfum',
      price: Number(newPerfume.price) || 0,
      originalPrice: newPerfume.originalPrice ? Number(newPerfume.originalPrice) : undefined,
      inStock: (newPerfume.stockQuantity || 0) > 0,
      stockQuantity: Number(newPerfume.stockQuantity) || 1,
      image: newPerfume.image || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop',
      description: newPerfume.description || 'Fragancia seleccionada por Dealbo Parfum.',
      olfactoryNotes: newPerfume.olfactoryNotes || { top: ['Cítricos'], heart: ['Flores'], base: ['Maderas'] },
      family: newPerfume.family || 'Amaderada Aromática',
      longevity: newPerfume.longevity || '8 - 10 horas',
      projection: newPerfume.projection || 'Envolvente',
      feelsLike: newPerfume.feelsLike || 'Elegante y distinguido.',
      perfectFor: newPerfume.perfectFor || ['Uso diario', 'Salidas nocturnas'],
      isBestSeller: Boolean(newPerfume.isBestSeller),
      isNew: Boolean(newPerfume.isNew)
    };

    onUpdatePerfumes([created, ...perfumes]);
    await savePerfumeToFirestore(created);
    alert('¡Perfume guardado en Firestore exitosamente y visible en tiempo real!');
    setActiveTab('inventory');
  };

  // Force Firebase Catalog Sync
  const handleForceSyncFirebase = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    const success = await syncCatalogToFirestore(perfumes);
    setIsSyncing(false);
    if (success) {
      setSyncMessage('¡Catálogo sincronizado exitosamente con Firebase Firestore!');
    } else {
      setSyncMessage('Hubo un problema al sincronizar. Verificá la conexión.');
    }
  };

  // Re-seed Initial Catalog in Firestore
  const handleReseedCatalog = async () => {
    if (confirm('¿Deseas restaurar y sembrar los 12 perfumes oficiales iniciales en Firestore?')) {
      setIsSyncing(true);
      const ok = await seedInitialCatalogIfEmpty(true);
      setIsSyncing(false);
      if (ok) {
        setSyncMessage('¡Catálogo oficial re-sembrado en Firestore!');
      }
    }
  };

  // Update order status in Firestore
  const handleStatusChange = async (orderId: string, status: OrderDetails['status']) => {
    await updateOrderStatusInFirestore(orderId, status);
  };

  const storeUrl = getPublicStoreUrl();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(storeUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const bioText = `✨ DEALBO PARFUM | “No te vayas sin oler bien”
🛍️ Catálogo y Stock en tiempo real:
👉 ${storeUrl}
🚚 Envíos en el día en Jardín América y Posadas, Misiones
📲 Pedidos directos al WhatsApp`;

  const handleCopyBio = () => {
    navigator.clipboard.writeText(bioText);
    setCopiedBio(true);
    setTimeout(() => setCopiedBio(false), 2500);
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(perfumes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `dealbo_perfumes_catalog_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div 
        className="relative w-full max-w-5xl rounded-3xl bg-[#0f1014] border border-[#d4af37]/35 shadow-2xl overflow-hidden z-10 my-auto text-[#ede8df]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 bg-[#131418] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#d4af37]">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-serif font-bold text-white tracking-wide">
                  PANEL DE ADMINISTRACIÓN DEALBO
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Firestore Conectado
                </span>
              </div>
              <p className="text-xs text-[#a0998b]">
                Inventario en la nube en tiempo real, pedidos de clientes y enlaces para Instagram
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#999] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-[#101115] px-4 sm:px-6 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-3 px-3 sm:px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'border-[#d4af37] text-[#d4af37]'
                : 'border-transparent text-[#888] hover:text-white'
            }`}
          >
            📦 Inventario & Stock ({perfumes.length})
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-3 sm:px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'border-[#d4af37] text-[#d4af37]'
                : 'border-transparent text-[#888] hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Pedidos Recibidos ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className={`py-3 px-3 sm:px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'add'
                ? 'border-[#d4af37] text-[#d4af37]'
                : 'border-transparent text-[#888] hover:text-white'
            }`}
          >
            ➕ Agregar Perfume
          </button>

          <button
            onClick={() => setActiveTab('instagram')}
            className={`py-3 px-3 sm:px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'instagram'
                ? 'border-[#d4af37] text-[#d4af37]'
                : 'border-transparent text-[#888] hover:text-white'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-pink-400" />
            <span>Link para Instagram</span>
          </button>

          <button
            onClick={() => setActiveTab('firebase')}
            className={`py-3 px-3 sm:px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'firebase'
                ? 'border-[#d4af37] text-[#d4af37]'
                : 'border-transparent text-[#888] hover:text-white'
            }`}
          >
            <Cloud className="w-3.5 h-3.5 text-amber-400" />
            <span>Base de Datos Firestore</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`py-3 px-3 sm:px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'backup'
                ? 'border-[#d4af37] text-[#d4af37]'
                : 'border-transparent text-[#888] hover:text-white'
            }`}
          >
            💾 Backup JSON
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6 max-h-[72vh] overflow-y-auto space-y-6">
          
          {/* TAB 1: INVENTORY */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#15161b] p-3.5 rounded-xl border border-white/5">
                <div>
                  <span className="text-xs font-medium text-white block">
                    Sincronización en la Nube Activa
                  </span>
                  <span className="text-[11px] text-[#999]">
                    Cada cambio de stock, precio o estado se guarda en Firestore al instante para todos tus clientes.
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('add')}
                  className="px-3.5 py-1.5 rounded-lg bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#e5c76c] transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nuevo Perfume</span>
                </button>
              </div>

              <div className="space-y-3">
                {perfumes.map(perfume => (
                  <div 
                    key={perfume.id}
                    className="p-3.5 sm:p-4 rounded-2xl bg-[#14151a] border border-white/10 hover:border-[#d4af37]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    {/* Info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <img 
                        src={perfume.image} 
                        alt={perfume.name} 
                        className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0" 
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-white truncate">{perfume.name}</h4>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-[#aaa] font-medium uppercase">
                            {perfume.brand} • {perfume.volumeMl}ml
                          </span>
                          {perfume.featured && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#d4af37]/20 text-[#d4af37] font-semibold uppercase">
                              Destacado
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#d4af37] font-semibold mt-0.5">
                          {formatPrice(perfume.price)}
                        </p>
                      </div>
                    </div>

                    {/* Stock & Controls */}
                    <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-white/5">
                      
                      {/* Price Editor */}
                      <div className="flex items-center gap-1 bg-[#1c1e24] px-2 py-1 rounded-lg border border-white/10">
                        <span className="text-xs text-[#888]">$</span>
                        <input
                          type="number"
                          value={perfume.price}
                          onChange={(e) => handlePriceChange(perfume.id, Number(e.target.value))}
                          className="w-20 bg-transparent text-xs text-white font-mono focus:outline-none"
                          title="Modificar precio"
                        />
                      </div>

                      {/* Stock Stepper */}
                      <div className="flex items-center gap-1 bg-[#1c1e24] px-2 py-1 rounded-lg border border-white/10">
                        <span className="text-[11px] text-[#888] mr-1">Stock:</span>
                        <button
                          onClick={() => handleStockChange(perfume.id, perfume.stockQuantity - 1)}
                          className="w-5 h-5 rounded bg-white/10 hover:bg-white/20 text-white text-xs flex items-center justify-center cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-xs font-mono font-bold w-6 text-center text-white">
                          {perfume.stockQuantity}
                        </span>
                        <button
                          onClick={() => handleStockChange(perfume.id, perfume.stockQuantity + 1)}
                          className="w-5 h-5 rounded bg-white/10 hover:bg-white/20 text-white text-xs flex items-center justify-center cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      {/* InStock Toggle */}
                      <button
                        onClick={() => handleToggleStock(perfume.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                          perfume.inStock
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}
                      >
                        {perfume.inStock ? '🟢 Disponible' : '🔴 Agotado'}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeletePerfume(perfume.id)}
                        className="p-1.5 rounded-lg text-[#666] hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-[#15161b] p-3.5 rounded-xl border border-white/5">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Historial de Pedidos en Firestore
                  </h4>
                  <p className="text-[11px] text-[#999]">
                    Pedidos enviados por tus clientes desde Jardín América, Posadas y Misiones.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#d4af37] bg-[#d4af37]/10 px-2.5 py-1 rounded-lg border border-[#d4af37]/20">
                  {orders.length} pedidos
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl bg-[#131418]">
                  <ShoppingBag className="w-10 h-10 text-[#555] mx-auto mb-2" />
                  <p className="text-sm text-[#aaa]">Aún no hay pedidos registrados en la base de datos.</p>
                  <p className="text-xs text-[#777] mt-1">Los pedidos de tus clientes aparecerán aquí en tiempo real.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div 
                      key={order.id} 
                      className="p-4 rounded-2xl bg-[#14151a] border border-white/10 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#d4af37]">
                              #{order.id}
                            </span>
                            <span className="text-xs font-semibold text-white">
                              {order.customerName}
                            </span>
                            <span className="text-[10px] text-[#888] flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {order.createdAt}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-[#aaa] mt-1">
                            <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                            <span>{order.locality} • {order.address}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id || '', e.target.value as any)}
                            className="bg-[#1b1d24] text-xs font-semibold rounded-lg px-2.5 py-1.5 border border-white/10 text-white focus:outline-none focus:border-[#d4af37]"
                          >
                            <option value="pending">🟡 Pendiente</option>
                            <option value="confirmed">🟢 Confirmado</option>
                            <option value="delivered">✅ Entregado</option>
                            <option value="cancelled">❌ Cancelado</option>
                          </select>

                          <a
                            href={`https://wa.me/${order.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola ${order.customerName}, te escribimos de DEALBO PARFUM respecto a tu pedido #${order.id}.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 rounded-lg bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40 hover:bg-[#25D366] hover:text-black transition-all text-xs font-bold flex items-center gap-1"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="text-xs text-[#ccc] space-y-1">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{it.quantity}x {it.name} ({it.brand} {it.volumeMl}ml)</span>
                            <span className="font-mono text-white">{formatPrice(it.price * it.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-white/5 text-xs">
                        <span className="text-[#888]">Pago: {order.paymentPreference}</span>
                        <span className="text-sm font-bold text-[#d4af37]">Total: {formatPrice(order.total)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ADD PRODUCT */}
          {activeTab === 'add' && (
            <form onSubmit={handleCreatePerfume} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#ccc] block mb-1">Nombre del Perfume *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Sauvage Elixir, Baccarat Rouge 540..."
                    value={newPerfume.name}
                    onChange={(e) => setNewPerfume({ ...newPerfume, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#14151a] border border-white/10 text-white text-xs focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#ccc] block mb-1">Marca / Diseñador *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Dior, Tom Ford, Jean Paul Gaultier..."
                    value={newPerfume.brand}
                    onChange={(e) => setNewPerfume({ ...newPerfume, brand: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#14151a] border border-white/10 text-white text-xs focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#ccc] block mb-1">Género</label>
                  <select
                    value={newPerfume.gender}
                    onChange={(e) => setNewPerfume({ ...newPerfume, gender: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#14151a] border border-white/10 text-white text-xs focus:border-[#d4af37] focus:outline-none"
                  >
                    <option value="hombre">Hombre</option>
                    <option value="mujer">Mujer</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#ccc] block mb-1">Concentración</label>
                  <select
                    value={newPerfume.concentration}
                    onChange={(e) => setNewPerfume({ ...newPerfume, concentration: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#14151a] border border-white/10 text-white text-xs focus:border-[#d4af37] focus:outline-none"
                  >
                    <option value="Eau de Toilette">Eau de Toilette</option>
                    <option value="Eau de Parfum">Eau de Parfum</option>
                    <option value="Parfum">Parfum</option>
                    <option value="Extrait de Parfum">Extrait de Parfum</option>
                    <option value="Elixir">Elixir</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#ccc] block mb-1">Precio (ARS) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newPerfume.price}
                    onChange={(e) => setNewPerfume({ ...newPerfume, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#14151a] border border-white/10 text-white text-xs focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#ccc] block mb-1">Cantidad Inicial en Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={newPerfume.stockQuantity}
                    onChange={(e) => setNewPerfume({ ...newPerfume, stockQuantity: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#14151a] border border-white/10 text-white text-xs focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#ccc] block mb-1">URL de la Imagen</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newPerfume.image}
                  onChange={(e) => setNewPerfume({ ...newPerfume, image: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#14151a] border border-white/10 text-white text-xs focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#ccc] block mb-1">¿A qué huele? (Sensación / Impresión)</label>
                <input
                  type="text"
                  placeholder="Ej. Poderoso, dulce cristalino, maderas sensuales y noche fría..."
                  value={newPerfume.feelsLike}
                  onChange={(e) => setNewPerfume({ ...newPerfume, feelsLike: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#14151a] border border-white/10 text-white text-xs focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('inventory')}
                  className="px-4 py-2 rounded-xl bg-white/5 text-white hover:bg-white/10 text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#d4af37] text-black hover:bg-[#e5c76c] text-xs font-bold uppercase tracking-wider cursor-pointer shadow-lg"
                >
                  Guardar en Firestore
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: INSTAGRAM & SOCIAL LINKS */}
          {activeTab === 'instagram' && (
            <div className="space-y-6">
              
              {/* Important Public Link Banner */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Enlace Público Oficial para Clientes (Sin error 403)</span>
                </div>
                <p className="text-[#cce8dc] leading-relaxed">
                  Este es el enlace público <strong>100% accesible para cualquier persona</strong> desde Instagram, historias o WhatsApp sin pedir inicio de sesión.
                </p>
                <p className="text-[11px] text-emerald-400/90">
                  ⚡ <strong>Sincronización en tiempo real con Firebase:</strong> Cualquier cambio que hagas en el stock, precio o nuevos perfumes desde este panel de control se refleja al instante para todos tus clientes en este link.
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#1a141c] to-[#121319] p-5 rounded-2xl border border-pink-500/20 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500 to-pink-500 text-white">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Tu Enlace Listo para Instagram Bio</h4>
                    <p className="text-xs text-[#aaa]">
                      Pegá este link en tu biografía de Instagram o en historias para que tus seguidores compren en tiempo real.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    readOnly
                    value={storeUrl}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white font-mono text-xs font-semibold select-all"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-5 py-2.5 rounded-xl bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#e5c76c] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg hover:scale-105"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? '¡Link Copiado!' : 'Copiar Enlace'}</span>
                  </button>
                </div>
              </div>

              {/* Bio Generator */}
              <div className="p-5 rounded-2xl bg-[#14151a] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    📝 Texto Recomendado para tu Biografía de Instagram
                  </h4>
                  <button
                    onClick={handleCopyBio}
                    className="text-xs text-[#d4af37] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedBio ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedBio ? '¡Copiado!' : 'Copiar Texto Completo'}</span>
                  </button>
                </div>
                <pre className="p-3.5 rounded-xl bg-black/40 text-[#ccc] text-xs font-sans whitespace-pre-wrap border border-white/5 leading-relaxed">
                  {bioText}
                </pre>
              </div>

              {/* How to add to Instagram steps */}
              <div className="p-5 rounded-2xl bg-[#14151a] border border-white/10 space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  ¿Cómo poner el link en tu Instagram?
                </h4>
                <ol className="text-xs text-[#aaa] list-decimal list-inside space-y-1.5 pl-1">
                  <li>Abrí tu app de Instagram en el celular y tocá <strong>Editar perfil</strong>.</li>
                  <li>Seleccioná <strong>Enlaces / Links</strong> y luego <strong>Añadir enlace externo</strong>.</li>
                  <li>Pegá el enlace copiado arriba y en Título poné: <strong>Tienda Dealbo Parfum</strong>.</li>
                  <li>¡Listo! Ahora cualquiera que entre a tu perfil verá tus perfumes con stock y precios en tiempo real.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 5: FIREBASE FIRESTORE CLOUD */}
          {activeTab === 'firebase' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-[#14151a] border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                    <Cloud className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Estado de Google Firebase Firestore</h4>
                    <p className="text-xs text-[#aaa]">
                      Base de datos en la nube provisionada con sincronización instantánea y persistencia permanente.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                    <span className="text-[#888] block text-[11px]">Proyecto Firebase:</span>
                    <span className="font-mono text-white font-semibold">{firebaseStatus.projectId}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                    <span className="text-[#888] block text-[11px]">Base de Datos Firestore ID:</span>
                    <span className="font-mono text-[#d4af37] font-semibold truncate block">
                      {firebaseStatus.databaseId}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                    <span className="text-[#888] block text-[11px]">Colecciones activas:</span>
                    <span className="text-white">dealbo_perfumes, dealbo_orders, dealbo_config</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                    <span className="text-[#888] block text-[11px]">Sincronización en vivo:</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Activa (onSnapshot)
                    </span>
                  </div>
                </div>

                {syncMessage && (
                  <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{syncMessage}</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={handleForceSyncFirebase}
                    disabled={isSyncing}
                    className="px-4 py-2.5 rounded-xl bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#e5c76c] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Sincronizando...' : 'Forzar Sincronización a Firestore'}</span>
                  </button>

                  <button
                    onClick={handleReseedCatalog}
                    disabled={isSyncing}
                    className="px-4 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/15 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restablecer Catálogo Oficial de 12 Perfumes</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: BACKUP */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#14151a] border border-white/10 space-y-3">
                <h4 className="text-sm font-bold text-white">Descargar Copia de Seguridad</h4>
                <p className="text-xs text-[#aaa]">
                  Descargá un archivo JSON con todos los perfumes, notas olfativas, precios y fotos para tener un respaldo offline en tu computadora o celular.
                </p>
                <button
                  onClick={handleExportJSON}
                  className="px-4 py-2.5 rounded-xl bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#e5c76c] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar Archivo JSON</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#121317] flex items-center justify-between text-xs text-[#888]">
          <span>DEALBO PARFUM Cloud Firestore v2.0</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 font-semibold cursor-pointer"
          >
            Cerrar Panel
          </button>
        </div>
      </div>
    </div>
  );
};
