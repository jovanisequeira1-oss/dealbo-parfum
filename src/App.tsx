import React, { useState, useEffect } from 'react';
import { Perfume, CartItem, GenderCategory } from './types';
import { 
  getStoredPerfumes, 
  savePerfumesLocally, 
  getStoredCart, 
  saveCartLocally, 
  getStoredFavorites, 
  toggleFavoriteLocally 
} from './services/storage';
import { 
  subscribeToPerfumes, 
  seedInitialCatalogIfEmpty,
  getFirebaseStatus 
} from './services/firebase';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Catalog } from './components/Catalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { DeliverySection } from './components/DeliverySection';
import { TrustSection } from './components/TrustSection';
import { InstagramSection } from './components/InstagramSection';
import { FragranceQuizModal } from './components/FragranceQuizModal';
import { AdminModal } from './components/AdminModal';
import { ExportInstallModal } from './components/ExportInstallModal';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  // Main State
  const [perfumes, setPerfumes] = useState<Perfume[]>(() => getStoredPerfumes());
  const [cart, setCart] = useState<CartItem[]>(() => getStoredCart());
  const [favorites, setFavorites] = useState<string[]>(() => getStoredFavorites());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<GenderCategory>('todos');
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);

  // Modals & Drawers State
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // Real-time Firestore Catalog Subscription
  useEffect(() => {
    // Initial check & auto-seeding
    seedInitialCatalogIfEmpty().catch(err => console.log('Firestore seed notice:', err));

    const unsubscribe = subscribeToPerfumes(
      (firestorePerfumes) => {
        if (firestorePerfumes && firestorePerfumes.length > 0) {
          setPerfumes(firestorePerfumes);
          savePerfumesLocally(firestorePerfumes);
          setIsCloudSynced(true);
        }
      },
      (error) => {
        console.warn('Firestore subscription error (using cached catalog):', error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Sync state changes with persistence
  useEffect(() => {
    savePerfumesLocally(perfumes);
  }, [perfumes]);

  useEffect(() => {
    saveCartLocally(cart);
  }, [cart]);

  // Cart Handlers
  const handleAddToCart = (perfume: Perfume, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.perfume.id === perfume.id);
      if (existing) {
        const newQty = Math.min(perfume.stockQuantity, existing.quantity + quantity);
        return prev.map(item =>
          item.perfume.id === perfume.id ? { ...item, quantity: newQty } : item
        );
      } else {
        return [...prev, { perfume, quantity: Math.min(perfume.stockQuantity, quantity) }];
      }
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (perfumeId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.perfume.id === perfumeId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const handleRemoveCartItem = (perfumeId: string) => {
    setCart(prev => prev.filter(item => item.perfume.id !== perfumeId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Favorites Handlers
  const handleToggleFavorite = (perfumeId: string) => {
    const updated = toggleFavoriteLocally(perfumeId);
    setFavorites(updated);
  };

  // Catalog Scroll Helper
  const scrollToCatalog = () => {
    const el = document.getElementById('catalogo');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToDelivery = () => {
    const el = document.getElementById('envios-misiones');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTrust = () => {
    const el = document.getElementById('por-que-dealbo');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenSearch = () => {
    scrollToCatalog();
    setTimeout(() => {
      const searchInput = document.getElementById('input-catalog-search');
      searchInput?.focus();
    }, 300);
  };

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-[#0a0a0d] text-[#ede8df] flex flex-col font-sans selection:bg-[#d4af37] selection:text-black">
      
      {/* Header / Navbar */}
      <Header
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        favoriteCount={favorites.length}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={handleOpenSearch}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onScrollToCatalog={scrollToCatalog}
        onScrollToDelivery={scrollToDelivery}
        onScrollToTrust={scrollToTrust}
      />

      {/* Main Content */}
      <main className="flex-1 space-y-4">
        {/* Hero Section */}
        <Hero
          onExploreCatalog={scrollToCatalog}
          onQuickBuy={scrollToCatalog}
          onOpenQuiz={() => setIsQuizOpen(true)}
        />

        {/* Catalog Section with Real-Time Stock & Prices */}
        <Catalog
          perfumes={perfumes}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onViewDetails={setSelectedPerfume}
          onAddToCart={handleAddToCart}
          onToggleFavorite={handleToggleFavorite}
          favorites={favorites}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Delivery in Jardín América & Posadas */}
        <DeliverySection />

        {/* Why Dealbo Parfum Trust Pillars */}
        <TrustSection />

        {/* Instagram & Social Community */}
        <InstagramSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenExport={() => setIsExportOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onScrollToCatalog={scrollToCatalog}
        onScrollToDelivery={scrollToDelivery}
        onScrollToTrust={scrollToTrust}
      />

      {/* Floating WhatsApp Action Button */}
      <WhatsAppFloatingButton />

      {/* Modals and Slide-overs */}
      <ProductDetailModal
        perfume={selectedPerfume}
        onClose={() => setSelectedPerfume(null)}
        onAddToCart={handleAddToCart}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={selectedPerfume ? favorites.includes(selectedPerfume.id) : false}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        onOrderCompleted={handleClearCart}
      />

      <FragranceQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        perfumes={perfumes}
        onSelectPerfume={setSelectedPerfume}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        perfumes={perfumes}
        onUpdatePerfumes={setPerfumes}
      />

      <ExportInstallModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        perfumes={perfumes}
      />

    </div>
  );
};

export default App;
