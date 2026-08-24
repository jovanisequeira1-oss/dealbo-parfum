import { Perfume, OrderDetails, CartItem } from '../types';
import { initialPerfumes } from '../data/perfumes';

const STORAGE_KEY_PERFUMES = 'dealbo_parfum_catalog_v1';
const STORAGE_KEY_CART = 'dealbo_parfum_cart_v1';
const STORAGE_KEY_ORDERS = 'dealbo_parfum_orders_v1';
const STORAGE_KEY_FAVORITES = 'dealbo_parfum_favorites_v1';

// Load cached perfumes from local storage or initial defaults
export const loadPerfumes = (): Perfume[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PERFUMES);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading cached perfumes:', e);
  }
  return initialPerfumes;
};
export const getStoredPerfumes = loadPerfumes;

// Cache perfumes locally
export const savePerfumes = (perfumes: Perfume[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY_PERFUMES, JSON.stringify(perfumes));
    window.dispatchEvent(new Event('dealbo_catalog_updated'));
  } catch (e) {
    console.error('Error caching perfumes locally:', e);
  }
};
export const savePerfumesLocally = savePerfumes;

// Reset local cache to defaults
export const resetToDefaultPerfumes = (): Perfume[] => {
  try {
    localStorage.setItem(STORAGE_KEY_PERFUMES, JSON.stringify(initialPerfumes));
    window.dispatchEvent(new Event('dealbo_catalog_updated'));
  } catch (e) {
    console.error('Error resetting perfumes cache:', e);
  }
  return initialPerfumes;
};

// Cart persistence (per device/browser session)
export const getStoredCart = (): CartItem[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CART);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading cart from storage:', e);
  }
  return [];
};

export const saveCartLocally = (cart: CartItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
  } catch (e) {
    console.error('Error saving cart to storage:', e);
  }
};

// Save single order locally as user history
export const saveOrderLocally = (order: OrderDetails): void => {
  try {
    const orders = loadOrdersLocally();
    const newOrders = [order, ...orders.filter(o => o.id !== order.id)];
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(newOrders));
    window.dispatchEvent(new Event('dealbo_orders_updated'));
  } catch (e) {
    console.error('Error saving order history locally:', e);
  }
};

// Load saved local user orders
export const loadOrdersLocally = (): OrderDetails[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_ORDERS);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading local order history:', e);
  }
  return [];
};

// Favorites
export const getFavorites = (): string[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_FAVORITES);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error getting favorites:', e);
  }
  return [];
};
export const getStoredFavorites = getFavorites;

export const toggleFavorite = (id: string): string[] => {
  const favs = getFavorites();
  const newFavs = favs.includes(id) ? favs.filter(item => item !== id) : [...favs, id];
  try {
    localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(newFavs));
    window.dispatchEvent(new Event('dealbo_favorites_updated'));
  } catch (e) {
    console.error('Error toggling favorite:', e);
  }
  return newFavs;
};
export const toggleFavoriteLocally = toggleFavorite;
