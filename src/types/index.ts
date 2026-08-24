export type GenderCategory = 'hombre' | 'mujer' | 'unisex' | 'todos';

export type ConcentrationType = 
  | 'Eau de Toilette'
  | 'Eau de Parfum'
  | 'Parfum'
  | 'Extrait de Parfum'
  | 'Elixir';

export interface OlfactoryNotes {
  top: string[];   // Notas de Salida
  heart: string[]; // Notas de Corazón
  base: string[];  // Notas de Fondo
}

export interface Perfume {
  id: string;
  name: string;
  brand: string;
  gender: 'hombre' | 'mujer' | 'unisex';
  volumeMl: number;
  concentration: ConcentrationType;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  stockQuantity: number;
  image: string;
  additionalImages?: string[];
  description: string;
  olfactoryNotes: OlfactoryNotes;
  family: string;
  longevity: string;
  projection: string;
  feelsLike: string;     // ¿A qué huele?
  perfectFor: string[];  // Perfecto para
  isBestSeller?: boolean;
  isNew?: boolean;
  featured?: boolean;
}

export interface CartItem {
  perfume: Perfume;
  quantity: number;
}

export type Localidad = 'Jardín América' | 'Posadas' | 'Otra localidad (Misiones)';
export type DeliveryMethod = 'delivery' | 'pickup';
export type PaymentMethod = 'Efectivo al recibir' | 'Transferencia bancaria / Alias' | 'Mercado Pago';

export interface OrderDetails {
  id?: string;
  customerName: string;
  whatsapp: string;
  locality: Localidad;
  deliveryMethod: DeliveryMethod;
  address: string;
  notes?: string;
  paymentPreference: PaymentMethod;
  items: {
    perfumeId: string;
    name: string;
    brand: string;
    volumeMl: number;
    price: number;
    quantity: number;
  }[];
  total: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface StoreConfig {
  storeName: string;
  tagline: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  instagramUrl: string;
  instagramHandle: string;
  tiktokUrl: string;
  tiktokHandle: string;
  email: string;
  primaryLocations: string[];
  deliveryJardinAmerica: string;
  deliveryPosadas: string;
  announcement: string;
}
