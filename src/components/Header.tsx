import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  Sparkles, 
  Settings, 
  Download, 
  MapPin, 
  PhoneCall, 
  Compass,
  Heart
} from 'lucide-react';
import { siteConfig } from '../config/site';
import { GenderCategory } from '../types';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenAdmin: () => void;
  onOpenExport: () => void;
  onOpenQuiz: () => void;
  selectedCategory: GenderCategory;
  onSelectCategory: (cat: GenderCategory) => void;
  favoriteCount: number;
  onScrollToCatalog: () => void;
  onScrollToDelivery: () => void;
  onScrollToTrust: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenSearch,
  onOpenAdmin,
  onOpenExport,
  onOpenQuiz,
  selectedCategory,
  onSelectCategory,
  favoriteCount,
  onScrollToCatalog,
  onScrollToDelivery,
  onScrollToTrust
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavCategory = (cat: GenderCategory) => {
    onSelectCategory(cat);
    onScrollToCatalog();
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0a0b0d]/90 border-b border-[#d4af37]/20 transition-all duration-300">
      {/* Top Announcement Ribbon */}
      <div className="bg-gradient-to-r from-[#121316] via-[#1a1710] to-[#121316] text-[#d4af37] text-xs py-2 px-4 border-b border-[#d4af37]/15">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap text-ellipsis">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium tracking-wider text-[11px] sm:text-xs">
              {siteConfig.announcement}
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-4 text-[11px] text-[#cfc8b8]">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
              Jardín América & Posadas
            </span>
            <span className="text-[#555]">•</span>
            <button 
              onClick={onOpenExport}
              className="text-[#d4af37] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Download className="w-3 h-3" />
              Instalar App / PDF
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-[#ede8df] hover:text-[#d4af37] hover:bg-[#1a1b1f] focus:outline-none transition-colors"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Logo & Brand Slogan */}
          <div className="flex flex-col items-center lg:items-start cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="flex items-center gap-2">
              <span className="text-[#d4af37] text-lg font-serif">✦</span>
              <span className="text-xl sm:text-2xl font-display font-extrabold tracking-[0.25em] text-white uppercase hover:text-[#d4af37] transition-colors">
                DEALBO
              </span>
              <span className="text-xs sm:text-sm font-sans tracking-[0.3em] font-light text-[#d4af37] uppercase">
                PARFUM
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] tracking-[0.22em] text-[#a8a192] uppercase font-light -mt-0.5">
              “NO TE VAYAS SIN OLER BIEN”
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1.5 xl:space-x-2.5">
            <button
              onClick={() => handleNavCategory('todos')}
              className={`px-4 py-2 text-xs font-bold tracking-wider uppercase transition-all rounded-full cursor-pointer ${
                selectedCategory === 'todos'
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#e8cb6b] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-105'
                  : 'bg-[#18191e]/80 text-[#d8d2c4] border border-white/10 hover:border-[#d4af37]/50 hover:text-white hover:bg-[#22242a]'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => handleNavCategory('hombre')}
              className={`px-4 py-2 text-xs font-bold tracking-wider uppercase transition-all rounded-full cursor-pointer ${
                selectedCategory === 'hombre'
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#e8cb6b] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-105'
                  : 'bg-[#18191e]/80 text-[#d8d2c4] border border-white/10 hover:border-[#d4af37]/50 hover:text-white hover:bg-[#22242a]'
              }`}
            >
              Hombre
            </button>
            <button
              onClick={() => handleNavCategory('mujer')}
              className={`px-4 py-2 text-xs font-bold tracking-wider uppercase transition-all rounded-full cursor-pointer ${
                selectedCategory === 'mujer'
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#e8cb6b] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-105'
                  : 'bg-[#18191e]/80 text-[#d8d2c4] border border-white/10 hover:border-[#d4af37]/50 hover:text-white hover:bg-[#22242a]'
              }`}
            >
              Mujer
            </button>
            <button
              onClick={() => handleNavCategory('unisex')}
              className={`px-4 py-2 text-xs font-bold tracking-wider uppercase transition-all rounded-full cursor-pointer ${
                selectedCategory === 'unisex'
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#e8cb6b] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-105'
                  : 'bg-[#18191e]/80 text-[#d8d2c4] border border-white/10 hover:border-[#d4af37]/50 hover:text-white hover:bg-[#22242a]'
              }`}
            >
              Unisex
            </button>

            <div className="h-5 w-px bg-white/15 mx-1.5" />

            <button
              onClick={onScrollToDelivery}
              className="px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase text-[#e2dacb] hover:text-[#d4af37] hover:bg-white/5 rounded-lg transition-all cursor-pointer"
            >
              Envíos Misiones
            </button>

            <button
              onClick={onScrollToTrust}
              className="px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase text-[#e2dacb] hover:text-[#d4af37] hover:bg-white/5 rounded-lg transition-all cursor-pointer"
            >
              ¿Por Qué Dealbo?
            </button>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Fragrance Finder Button */}
            <button
              id="btn-fragrance-finder"
              onClick={onOpenQuiz}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-[#d4af37]/25 via-[#e5c76c]/20 to-[#aa821c]/25 border border-[#d4af37]/60 text-[#fdfbf6] hover:bg-[#d4af37]/40 hover:border-[#d4af37] transition-all cursor-pointer shadow-[0_0_18px_rgba(212,175,55,0.25)] hover:scale-105"
              title="Descubrí tu fragancia ideal"
            >
              <Sparkles className="w-4 h-4 text-[#d4af37] animate-spin" style={{ animationDuration: '6s' }} />
              <span>Test de Perfumes</span>
            </button>

            {/* Search Button */}
            <button
              id="btn-search-header"
              onClick={onOpenSearch}
              className="p-2.5 rounded-full text-[#ede8df] hover:text-[#d4af37] bg-[#16171b] border border-white/10 hover:border-[#d4af37]/50 transition-all cursor-pointer shadow-sm"
              aria-label="Buscar perfume"
              title="Buscar por nombre o notas"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Install / Export Button */}
            <button
              id="btn-export-header"
              onClick={onOpenExport}
              className="p-2.5 rounded-full text-[#ede8df] hover:text-[#d4af37] bg-[#16171b] border border-white/10 hover:border-[#d4af37]/50 transition-all cursor-pointer shadow-sm hidden md:block"
              aria-label="Opciones de instalación y exportación"
              title="Instalar App / Descargar Catálogo"
            >
              <Download className="w-5 h-5" />
            </button>

            {/* Cart Button with Counter */}
            <button
              id="btn-cart-header"
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full bg-[#1b1c22] border border-[#d4af37]/40 text-[#f2ede4] hover:border-[#d4af37] hover:bg-[#262830] transition-all duration-200 group cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.15)]"
              aria-label="Ver carrito"
            >
              <ShoppingBag className="w-5 h-5 text-[#d4af37] group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-gradient-to-r from-[#d4af37] to-[#e6ca65] text-[#0a0a0a] text-[11px] font-black flex items-center justify-center shadow-lg animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin Access Button */}
            <button
              id="btn-admin-header"
              onClick={onOpenAdmin}
              className="p-2.5 rounded-full text-[#888] hover:text-[#d4af37] bg-[#16171b] border border-white/10 hover:border-[#d4af37]/40 transition-colors cursor-pointer"
              title="Panel de Administración (Stock y Productos)"
              aria-label="Administración"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-down Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0e1013] border-b border-[#d4af37]/20 px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => handleNavCategory('todos')}
              className={`p-3 rounded-lg text-left text-xs font-semibold uppercase tracking-wider ${
                selectedCategory === 'todos'
                  ? 'bg-[#d4af37]/20 text-[#f7eedc] border border-[#d4af37]/50'
                  : 'bg-[#151619] text-[#aaa] border border-white/5'
              }`}
            >
              ✦ Todos
            </button>
            <button
              onClick={() => handleNavCategory('hombre')}
              className={`p-3 rounded-lg text-left text-xs font-semibold uppercase tracking-wider ${
                selectedCategory === 'hombre'
                  ? 'bg-[#d4af37]/20 text-[#f7eedc] border border-[#d4af37]/50'
                  : 'bg-[#151619] text-[#aaa] border border-white/5'
              }`}
            >
              Hombre
            </button>
            <button
              onClick={() => handleNavCategory('mujer')}
              className={`p-3 rounded-lg text-left text-xs font-semibold uppercase tracking-wider ${
                selectedCategory === 'mujer'
                  ? 'bg-[#d4af37]/20 text-[#f7eedc] border border-[#d4af37]/50'
                  : 'bg-[#151619] text-[#aaa] border border-white/5'
              }`}
            >
              Mujer
            </button>
            <button
              onClick={() => handleNavCategory('unisex')}
              className={`p-3 rounded-lg text-left text-xs font-semibold uppercase tracking-wider ${
                selectedCategory === 'unisex'
                  ? 'bg-[#d4af37]/20 text-[#f7eedc] border border-[#d4af37]/50'
                  : 'bg-[#151619] text-[#aaa] border border-white/5'
              }`}
            >
              Unisex
            </button>
          </div>

          <div className="space-y-1 pt-2 border-t border-white/10">
            <button
              onClick={() => {
                onOpenQuiz();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-[#d4af37]/15 to-transparent text-[#f3eedd] text-xs font-medium border border-[#d4af37]/30"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
                Test: ¿Cuál es mi perfume ideal?
              </span>
              <span className="text-[#d4af37] text-xs font-semibold">Iniciar →</span>
            </button>

            <button
              onClick={() => {
                onScrollToDelivery();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 p-3 text-xs tracking-wider uppercase text-[#ccc] hover:text-[#d4af37]"
            >
              <MapPin className="w-4 h-4 text-[#d4af37]" />
              Envíos en Jardín América y Posadas
            </button>

            <button
              onClick={() => {
                onScrollToTrust();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 p-3 text-xs tracking-wider uppercase text-[#ccc] hover:text-[#d4af37]"
            >
              <Compass className="w-4 h-4 text-[#d4af37]" />
              ¿Por qué elegir Dealbo Parfum?
            </button>

            <button
              onClick={() => {
                onOpenExport();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 p-3 text-xs tracking-wider uppercase text-[#d4af37] hover:underline"
            >
              <Download className="w-4 h-4" />
              Instalar App / Descargar Catálogo
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
