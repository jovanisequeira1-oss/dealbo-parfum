import React, { useState, useMemo } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  Flame, 
  Check, 
  RotateCcw, 
  ArrowUpDown,
  Filter,
  X
} from 'lucide-react';
import { Perfume, GenderCategory } from '../types';
import { ProductCard } from './ProductCard';

interface CatalogProps {
  perfumes: Perfume[];
  selectedCategory: GenderCategory;
  onSelectCategory: (category: GenderCategory) => void;
  onViewDetails: (perfume: Perfume) => void;
  onAddToCart: (perfume: Perfume) => void;
  onToggleFavorite: (id: string) => void;
  favorites: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

type SortOption = 'destacados' | 'precio-menor' | 'precio-mayor' | 'mas-vendidos' | 'nuevos' | 'nombre';

export const Catalog: React.FC<CatalogProps> = ({
  perfumes,
  selectedCategory,
  onSelectCategory,
  onViewDetails,
  onAddToCart,
  onToggleFavorite,
  favorites,
  searchQuery,
  onSearchChange
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('destacados');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Filter and Sort Logic
  const filteredPerfumes = useMemo(() => {
    return perfumes.filter(perfume => {
      // Category filter
      if (selectedCategory !== 'todos' && perfume.gender !== selectedCategory) {
        return false;
      }

      // In stock filter
      if (onlyInStock && !perfume.inStock) {
        return false;
      }

      // Favorites filter
      if (onlyFavorites && !favorites.includes(perfume.id)) {
        return false;
      }

      // Search filter (searches name, brand, feelsLike, notes, description)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = perfume.name.toLowerCase().includes(query);
        const matchesBrand = perfume.brand.toLowerCase().includes(query);
        const matchesNotes = [...perfume.olfactoryNotes.top, ...perfume.olfactoryNotes.heart, ...perfume.olfactoryNotes.base]
          .some(note => note.toLowerCase().includes(query));
        const matchesFeels = perfume.feelsLike.toLowerCase().includes(query);
        const matchesFamily = perfume.family.toLowerCase().includes(query);

        if (!matchesName && !matchesBrand && !matchesNotes && !matchesFeels && !matchesFamily) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'precio-menor':
          return a.price - b.price;
        case 'precio-mayor':
          return b.price - a.price;
        case 'mas-vendidos':
          return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
        case 'nuevos':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        case 'nombre':
          return a.name.localeCompare(b.name);
        case 'destacados':
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });
  }, [perfumes, selectedCategory, onlyInStock, onlyFavorites, searchQuery, sortBy, favorites]);

  const activeFiltersCount = (selectedCategory !== 'todos' ? 1 : 0) + 
    (onlyInStock ? 1 : 0) + 
    (onlyFavorites ? 1 : 0) + 
    (searchQuery.trim() ? 1 : 0) + 
    (sortBy !== 'destacados' ? 1 : 0);

  const resetAllFilters = () => {
    onSelectCategory('todos');
    setSortBy('destacados');
    setOnlyInStock(false);
    setOnlyFavorites(false);
    onSearchChange('');
  };

  return (
    <section id="catalogo" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      
      {/* Section Header */}
      <div className="text-center space-y-3 mb-10">
        <p className="text-xs font-display tracking-[0.35em] text-[#d4af37] uppercase font-semibold">
          COLECCIÓN EXCLUSIVA 2026
        </p>
        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight uppercase">
          NUESTROS <span className="gold-gradient-text">PERFUMES</span>
        </h2>
        <p className="text-sm sm:text-base text-[#a8a192] max-w-2xl mx-auto font-light">
          Fragancias seleccionadas con alta concentración y fijación. Consultá disponibilidad y recibí en Jardín América o Posadas.
        </p>
      </div>

      {/* Control Bar: Search, Category Tabs & Filter Triggers */}
      <div className="space-y-4 mb-8">
        
        {/* Search & Category Pills */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          {/* Search Input */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8477]" />
            <input
              id="input-catalog-search"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar perfume, marca o notas (ej: Dior, Vainilla)..."
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#14161a] border border-[#d4af37]/25 text-[#ede8df] placeholder-[#736d62] text-sm focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#888] hover:text-white"
                aria-label="Limpiar búsqueda"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Gender Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#131418] border border-white/10 overflow-x-auto w-full lg:w-auto scrollbar-none">
            {(['todos', 'hombre', 'mujer', 'unisex'] as GenderCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`flex-1 lg:flex-none px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#aa821c] text-[#0a0a0a] shadow-[0_2px_10px_rgba(212,175,55,0.3)]'
                    : 'text-[#9c9586] hover:text-white hover:bg-white/5'
                }`}
              >
                {cat === 'todos' ? '✦ Todos' : cat}
              </button>
            ))}
          </div>

        </div>

        {/* Secondary Filter Bar: Sort Selector & Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#111216] border border-white/5 text-xs text-[#bcb5a5]">
          
          {/* Quick Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Solo en stock */}
            <button
              onClick={() => setOnlyInStock(!onlyInStock)}
              className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                onlyInStock 
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 shadow-sm' 
                  : 'bg-[#181a1f] border-white/10 text-[#a09a8c] hover:text-white'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${onlyInStock ? 'bg-emerald-400 animate-pulse' : 'bg-emerald-600'}`} />
              <span>Solo en Stock</span>
              {onlyInStock && <Check className="w-3 h-3 text-emerald-400 ml-0.5" />}
            </button>

            {/* Favoritos */}
            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                onlyFavorites 
                  ? 'bg-rose-950/60 border-rose-500/50 text-rose-300' 
                  : 'bg-[#181a1f] border-white/10 text-[#a09a8c] hover:text-white'
              }`}
            >
              <span>Favoritos ({favorites.length})</span>
            </button>

            {/* Más Vendidos quick filter */}
            <button
              onClick={() => setSortBy(sortBy === 'mas-vendidos' ? 'destacados' : 'mas-vendidos')}
              className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                sortBy === 'mas-vendidos'
                  ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#f7eecf]'
                  : 'bg-[#181a1f] border-white/10 text-[#a09a8c] hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Más Vendidos</span>
            </button>

            {/* Nuevos quick filter */}
            <button
              onClick={() => setSortBy(sortBy === 'nuevos' ? 'destacados' : 'nuevos')}
              className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                sortBy === 'nuevos'
                  ? 'bg-blue-950/60 border-blue-500/50 text-blue-300'
                  : 'bg-[#181a1f] border-white/10 text-[#a09a8c] hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Nuevos</span>
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-[#777] hidden sm:inline flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3 text-[#d4af37]" /> Ordenar por:
            </span>
            <select
              id="select-sort-perfumes"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-[#181a1f] border border-white/10 text-[#ede8df] text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#d4af37] cursor-pointer"
            >
              <option value="destacados">✦ Destacados</option>
              <option value="mas-vendidos">🔥 Más Vendidos</option>
              <option value="nuevos">✨ Nuevos Ingresos</option>
              <option value="precio-menor">💵 Precio: Menor a Mayor</option>
              <option value="precio-mayor">💎 Precio: Mayor a Menor</option>
              <option value="nombre">🔤 Nombre A-Z</option>
            </select>

            {activeFiltersCount > 0 && (
              <button
                onClick={resetAllFilters}
                className="p-1.5 rounded-lg text-[#888] hover:text-[#d4af37] hover:bg-white/5 transition-colors"
                title="Restablecer filtros"
                aria-label="Restablecer filtros"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Results Counter & Active Filter Tags */}
      <div className="flex items-center justify-between text-xs text-[#8f887b] mb-6">
        <span>
          Mostrando <strong className="text-white font-semibold">{filteredPerfumes.length}</strong> {filteredPerfumes.length === 1 ? 'perfume seleccionado' : 'perfumes seleccionados'}
        </span>
        {searchQuery && (
          <span className="bg-[#1a1b20] px-2.5 py-1 rounded-md text-[#d4af37] border border-[#d4af37]/20">
            Resultados para: "{searchQuery}"
          </span>
        )}
      </div>

      {/* Products Grid */}
      {filteredPerfumes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
          {filteredPerfumes.map((perfume) => (
            <ProductCard
              key={perfume.id}
              perfume={perfume}
              onViewDetails={onViewDetails}
              onAddToCart={onAddToCart}
              onToggleFavorite={onToggleFavorite}
              isFavorite={favorites.includes(perfume.id)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 rounded-2xl bg-[#121316] border border-white/10 space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#1c1d22] border border-[#d4af37]/30 flex items-center justify-center mx-auto text-[#d4af37]">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-serif text-white">No encontramos perfumes con esos criterios</h3>
          <p className="text-sm text-[#9c9586] max-w-md mx-auto">
            Probá quitando algunos filtros o buscando por otra palabra clave (por ejemplo: hombre, vainilla, amaderado).
          </p>
          <button
            onClick={resetAllFilters}
            className="px-6 py-2.5 rounded-xl bg-[#d4af37] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#e6ca65] transition-colors cursor-pointer"
          >
            Ver Todo el Catálogo
          </button>
        </div>
      )}

    </section>
  );
};
