import { StoreConfig } from '../types';

export const siteConfig: StoreConfig = {
  storeName: 'DEALBO PARFUM',
  tagline: 'NO TE VAYAS SIN OLER BIEN',
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '5493764000000',
  whatsappDisplay: '+54 9 376 400-0000',
  instagramUrl: import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com/dealbo.parfum',
  instagramHandle: '@dealbo.parfum',
  tiktokUrl: import.meta.env.VITE_TIKTOK_URL || 'https://tiktok.com/@dealbo.parfum',
  tiktokHandle: '@dealbo.parfum',
  email: 'contacto@dealboparfum.com',
  primaryLocations: ['Jardín América', 'Posadas'],
  deliveryJardinAmerica: 'Entregas coordinadas y envíos directos en Jardín América. Consulta punto de entrega o delivery.',
  deliveryPosadas: 'Envíos rápidos a domicilio en Posadas y puntos de encuentro céntricos.',
  announcement: '✨ ENVÍOS EN JARDÍN AMÉRICA Y POSADAS • STOCK DISPONIBLE 24/7 • NO TE VAYAS SIN OLER BIEN ✨'
};

export const getPublicStoreUrl = (): string => {
  if (typeof window === 'undefined') {
    return 'https://ais-pre-xqbe7b5yaqm3xrtdi7rami-203234824467.us-west2.run.app';
  }
  
  const currentOrigin = window.location.origin;
  // If in the private developer container (ais-dev-...), convert to the public accessible URL (ais-pre-...)
  if (currentOrigin.includes('ais-dev-')) {
    return currentOrigin.replace('ais-dev-', 'ais-pre-');
  }
  return currentOrigin;
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(price);
};

export const generateWhatsAppLink = (message: string, phone: string = siteConfig.whatsappNumber): string => {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};
