import React, { useState, useEffect } from 'react';
import { 
  X, 
  Smartphone, 
  Share2, 
  Printer, 
  FileText, 
  Download, 
  Check, 
  Copy, 
  ExternalLink,
  Instagram,
  QrCode,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Perfume } from '../types';
import { siteConfig, formatPrice, getPublicStoreUrl } from '../config/site';

interface ExportInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  perfumes: Perfume[];
}

export const ExportInstallModal: React.FC<ExportInstallModalProps> = ({
  isOpen,
  onClose,
  perfumes
}) => {
  const [activeTab, setActiveTab] = useState<'instagram' | 'install' | 'pdf' | 'html'>('instagram');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedBio, setCopiedBio] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const storeUrl = getPublicStoreUrl();

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsInstalled(true);
      }
    } else {
      alert('Para instalar en tu dispositivo:\n\n📱 En Android / Chrome: Tocá los 3 puntos arriba a la derecha y elegí "Instalar aplicación" o "Añadir a la pantalla principal".\n\n🍎 En iPhone / iPad (Safari): Tocá el botón "Compartir" (ícono del cuadrado con flecha hacia arriba) y seleccioná "Añadir a la pantalla de inicio".\n\n💻 En PC / Mac (Chrome o Edge): Hacé clic en el ícono de instalar en la barra de direcciones arriba.');
    }
  };

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

  const handlePrintPDF = () => {
    window.print();
  };

  const handleDownloadHTML = () => {
    const itemsHtml = perfumes.map(p => `
      <div style="border: 1px solid #d4af37; border-radius: 12px; padding: 16px; margin-bottom: 16px; background: #14151a; color: #fff;">
        <h3 style="margin: 0; color: #d4af37; font-family: serif;">${p.name} - ${p.brand}</h3>
        <p style="margin: 4px 0; font-size: 14px; color: #aaa;">${p.volumeMl}ml • ${p.concentration} • ${p.gender.toUpperCase()}</p>
        <p style="margin: 8px 0; font-weight: bold; font-size: 18px;">${formatPrice(p.price)} - ${p.inStock ? '🟢 EN STOCK' : '🔴 SIN STOCK'}</p>
        <p style="margin: 4px 0; font-size: 13px; font-style: italic; color: #ccc;">"${p.feelsLike}"</p>
        <p style="margin: 4px 0; font-size: 12px; color: #999;">Notas: ${p.olfactoryNotes.top.join(', ')}</p>
      </div>
    `).join('');

    const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>DEALBO PARFUM - Catálogo Oficial</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0c0d10; color: #ede8df; padding: 24px; max-width: 800px; margin: auto; }
    h1 { color: #d4af37; text-transform: uppercase; letter-spacing: 2px; }
    .tagline { color: #aaa; font-style: italic; margin-bottom: 24px; }
  </style>
</head>
<body>
  <h1>DEALBO PARFUM</h1>
  <p class="tagline">“NO TE VAYAS SIN OLER BIEN” • Jardín América & Posadas, Misiones</p>
  <div>${itemsHtml}</div>
  <p style="text-align: center; color: #777; margin-top: 40px;">Catálogo generado desde DEALBO PARFUM</p>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dealbo_parfum_catalogo_${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div 
        className="relative w-full max-w-2xl rounded-3xl bg-[#0f1014] border border-[#d4af37]/35 shadow-2xl overflow-hidden z-10 my-auto text-[#ede8df]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 bg-[#121419] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500/20 to-pink-500/20 border border-[#d4af37]/40 text-[#d4af37]">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-white tracking-wide">
                INSTALACIÓN & ENLACE DE DEALBO PARFUM
              </h3>
              <p className="text-xs text-[#a0998b]">
                Link para Instagram Bio, instalación en la pantalla de inicio y catálogo PDF
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
            onClick={() => setActiveTab('instagram')}
            className={`py-3 px-3 sm:px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'instagram'
                ? 'border-[#d4af37] text-[#d4af37]'
                : 'border-transparent text-[#888] hover:text-white'
            }`}
          >
            <Instagram className="w-3.5 h-3.5 text-pink-400" />
            <span>Link para Instagram</span>
          </button>

          <button
            onClick={() => setActiveTab('install')}
            className={`py-3 px-3 sm:px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'install'
                ? 'border-[#d4af37] text-[#d4af37]'
                : 'border-transparent text-[#888] hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Instalar como App (PWA)</span>
          </button>

          <button
            onClick={() => setActiveTab('pdf')}
            className={`py-3 px-3 sm:px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'pdf'
                ? 'border-[#d4af37] text-[#d4af37]'
                : 'border-transparent text-[#888] hover:text-white'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir / PDF</span>
          </button>

          <button
            onClick={() => setActiveTab('html')}
            className={`py-3 px-3 sm:px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'html'
                ? 'border-[#d4af37] text-[#d4af37]'
                : 'border-transparent text-[#888] hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>HTML Offline</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* TAB 1: INSTAGRAM LINK */}
          {activeTab === 'instagram' && (
            <div className="space-y-5">
              
              {/* Important Public Link Banner */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-emerald-300">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Enlace Público Oficial para Clientes e Instagram (Sin error 403)</span>
                </div>
                <p className="text-[#cce8dc] leading-relaxed">
                  Cualquier persona puede abrir este enlace desde su propio celular sin necesitar contraseñas ni cuentas de Google.
                </p>
                <p className="text-[11px] text-emerald-400/90">
                  ⚡ <strong>Sincronización en tiempo real:</strong> Todo lo que actualices en stock o precios se actualiza automáticamente al instante en este link.
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-900/30 via-pink-900/20 to-amber-900/30 p-5 rounded-2xl border border-pink-500/30 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-400 to-pink-500 text-white">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Link Oficial para tu Perfil de Instagram</h4>
                    <p className="text-xs text-[#ccc]">
                      Tus seguidores pueden tocar este link en tu biografía o historias para ver perfumes, precios y stock en vivo.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    readOnly
                    value={storeUrl}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/20 text-white font-mono text-xs select-all"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-5 py-2.5 rounded-xl bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#e5c76c] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? '¡Copiado!' : 'Copiar Link'}</span>
                  </button>
                </div>
              </div>

              {/* Bio Template */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#14151a] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    📝 Plantilla para tu Biografía de Instagram
                  </h4>
                  <button
                    onClick={handleCopyBio}
                    className="text-xs text-[#d4af37] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                  >
                    {copiedBio ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedBio ? '¡Copiado!' : 'Copiar Texto'}</span>
                  </button>
                </div>
                <pre className="p-3.5 rounded-xl bg-black/40 text-[#ccc] text-xs font-sans whitespace-pre-wrap border border-white/5 leading-relaxed">
                  {bioText}
                </pre>
              </div>

              {/* Quick instructions */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#14151a] border border-white/10 space-y-2 text-xs">
                <h4 className="font-bold text-white uppercase tracking-wider">
                  Pasos sencillos en Instagram:
                </h4>
                <ol className="text-[#aaa] list-decimal list-inside space-y-1 pl-1">
                  <li>Entrá a Instagram y tocá <strong>Editar perfil</strong>.</li>
                  <li>Seleccioná <strong>Enlaces</strong> &gt; <strong>Añadir enlace externo</strong>.</li>
                  <li>Pegá la URL copiada y guardá los cambios.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 2: INSTALL APP (PWA) */}
          {activeTab === 'install' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/30 to-[#14151a] border border-emerald-500/30 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Instalar en la Pantalla de Inicio</h4>
                    <p className="text-xs text-[#ccc]">
                      Convertí la tienda en una aplicación nativa con ícono directo en tu teléfono o PC.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleInstallApp}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-[#d4af37] text-black font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>{isInstalled ? '✅ Aplicación ya Instalada' : '📲 Instalar Dealbo Parfum en mi Dispositivo'}</span>
                </button>
              </div>

              {/* Step by step for iOS and Android */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#14151a] border border-white/10 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-[#d4af37] font-bold">
                    <span>🍎 iPhone / iPad (Safari)</span>
                  </div>
                  <ol className="text-[#aaa] list-decimal list-inside space-y-1.5 pl-1">
                    <li>Abrí el link en el navegador <strong>Safari</strong>.</li>
                    <li>Tocá el botón <strong>Compartir</strong> (ícono cuadrado con flecha hacia arriba).</li>
                    <li>Deslizá hacia abajo y seleccioná <strong>"Añadir a pantalla de inicio"</strong>.</li>
                  </ol>
                </div>

                <div className="p-4 rounded-2xl bg-[#14151a] border border-white/10 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <span>🤖 Android (Chrome)</span>
                  </div>
                  <ol className="text-[#aaa] list-decimal list-inside space-y-1.5 pl-1">
                    <li>Abrí el link en <strong>Google Chrome</strong>.</li>
                    <li>Tocá los <strong>3 puntos verticales</strong> arriba a la derecha.</li>
                    <li>Elegí <strong>"Instalar aplicación"</strong> o <strong>"Añadir a pantalla principal"</strong>.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PDF */}
          {activeTab === 'pdf' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#14151a] border border-white/10 space-y-3">
                <h4 className="text-sm font-bold text-white">Generar Catálogo para Imprimir o Guardar en PDF</h4>
                <p className="text-xs text-[#aaa]">
                  Creá una versión limpia y optimizada para enviar por WhatsApp como documento o imprimir para clientes.
                </p>
                <button
                  onClick={handlePrintPDF}
                  className="px-5 py-2.5 rounded-xl bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#e5c76c] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Abrir Vista de Impresión / Guardar PDF</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: HTML OFFLINE */}
          {activeTab === 'html' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#14151a] border border-white/10 space-y-3">
                <h4 className="text-sm font-bold text-white">Descargar Catálogo HTML Autónomo</h4>
                <p className="text-xs text-[#aaa]">
                  Descargá un archivo HTML liviano con toda la lista de fragancias que se puede abrir en cualquier navegador sin conexión a internet.
                </p>
                <button
                  onClick={handleDownloadHTML}
                  className="px-5 py-2.5 rounded-xl bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#e5c76c] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar Archivo HTML</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#121317] flex items-center justify-between text-xs text-[#888]">
          <span>DEALBO PARFUM • Jardín América & Posadas</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 font-semibold cursor-pointer"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
