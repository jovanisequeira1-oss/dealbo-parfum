import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  getDoc,
  deleteDoc,
  updateDoc, 
  Firestore,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { Perfume, OrderDetails, StoreConfig } from '../types';
import { initialPerfumes } from '../data/perfumes';
import { siteConfig } from '../config/site';

// Import provisioned Firebase configuration
import configJson from '../../firebase-applet-config.json';

export interface FirebaseConnectionStatus {
  isConfigured: boolean;
  isConnected: boolean;
  projectId: string;
  databaseId: string;
  source: 'provisioned' | 'env' | 'offline';
  lastSyncTime: Date | null;
  perfumeCount: number;
}

const getResolvedConfig = () => {
  const apiKey = configJson.apiKey || import.meta.env.VITE_FIREBASE_API_KEY || '';
  const projectId = configJson.projectId || import.meta.env.VITE_FIREBASE_PROJECT_ID || '';
  const appId = configJson.appId || import.meta.env.VITE_FIREBASE_APP_ID || '';
  const authDomain = configJson.authDomain || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${projectId}.firebaseapp.com`;
  const storageBucket = configJson.storageBucket || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${projectId}.firebasestorage.app`;
  const messagingSenderId = configJson.messagingSenderId || import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '';
  const firestoreDatabaseId = configJson.firestoreDatabaseId || import.meta.env.VITE_FIREBASE_DATABASE_ID || '';

  return {
    apiKey,
    projectId,
    appId,
    authDomain,
    storageBucket,
    messagingSenderId,
    firestoreDatabaseId
  };
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

export const getFirebaseDb = (): Firestore | null => {
  if (db) return db;
  const config = getResolvedConfig();
  if (!config.apiKey || !config.projectId) {
    console.warn('Firebase config missing apiKey or projectId');
    return null;
  }

  try {
    if (!getApps().length) {
      app = initializeApp({
        apiKey: config.apiKey,
        authDomain: config.authDomain,
        projectId: config.projectId,
        storageBucket: config.storageBucket,
        messagingSenderId: config.messagingSenderId,
        appId: config.appId
      });
    } else {
      app = getApps()[0];
    }

    if (config.firestoreDatabaseId && config.firestoreDatabaseId.trim() !== '') {
      db = getFirestore(app, config.firestoreDatabaseId);
    } else {
      db = getFirestore(app);
    }

    return db;
  } catch (err) {
    console.error('Failed to initialize Firebase Firestore:', err);
    return null;
  }
};

export const getFirebaseStatus = (): FirebaseConnectionStatus => {
  const config = getResolvedConfig();
  const firestore = getFirebaseDb();
  return {
    isConfigured: Boolean(config.apiKey && config.projectId),
    isConnected: Boolean(firestore),
    projectId: config.projectId || 'consummate-lens-85fd2',
    databaseId: config.firestoreDatabaseId || '(default)',
    source: configJson.apiKey ? 'provisioned' : 'env',
    lastSyncTime: new Date(),
    perfumeCount: 0
  };
};

export const checkFirebaseStatus = () => {
  const status = getFirebaseStatus();
  return {
    isConfigured: status.isConfigured,
    missingKeys: status.isConfigured ? [] : ['VITE_FIREBASE_API_KEY', 'VITE_FIREBASE_PROJECT_ID']
  };
};

// ----------------------------------------------------
// REAL-TIME PERFUMES CATALOG
// ----------------------------------------------------

/**
 * Seed initial catalog to Firestore if empty or forced
 */
export const seedInitialCatalogIfEmpty = async (force: boolean = false): Promise<boolean> => {
  const firestore = getFirebaseDb();
  if (!firestore) return false;

  try {
    const colRef = collection(firestore, 'dealbo_perfumes');
    if (!force) {
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        console.log(`Firestore dealbo_perfumes already has ${snap.size} items.`);
        return true;
      }
    }

    console.log('Seeding initial perfumes catalog to Firestore...');
    const batch = writeBatch(firestore);
    for (const perfume of initialPerfumes) {
      const docRef = doc(colRef, perfume.id);
      batch.set(docRef, perfume, { merge: true });
    }
    await batch.commit();
    console.log('Catalog successfully seeded to Firestore.');
    return true;
  } catch (e) {
    console.error('Error seeding initial perfumes to Firestore:', e);
    return false;
  }
};

/**
 * Subscribe to real-time updates of perfumes catalog
 */
export const subscribeToPerfumes = (
  onUpdate: (perfumes: Perfume[]) => void,
  onError?: (err: Error) => void
): (() => void) => {
  const firestore = getFirebaseDb();
  if (!firestore) {
    // Return empty unsubscribe if no firestore
    return () => {};
  }

  const colRef = collection(firestore, 'dealbo_perfumes');

  const unsubscribe = onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        // Auto seed once on empty database
        await seedInitialCatalogIfEmpty();
        return;
      }

      const items: Perfume[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Perfume;
        items.push({
          ...data,
          id: docSnap.id
        });
      });

      // Preserve reasonable sorting (featured / inStock first)
      items.sort((a, b) => {
        if (a.inStock === b.inStock) {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return a.name.localeCompare(b.name);
        }
        return a.inStock ? -1 : 1;
      });

      onUpdate(items);
    },
    (error) => {
      console.error('Firestore perfumes subscription error:', error);
      if (onError) onError(error);
    }
  );

  return unsubscribe;
};

/**
 * Save or update a perfume in Firestore
 */
export const savePerfumeToFirestore = async (perfume: Perfume): Promise<boolean> => {
  const firestore = getFirebaseDb();
  if (!firestore) return false;

  try {
    const docRef = doc(firestore, 'dealbo_perfumes', perfume.id);
    await setDoc(docRef, perfume, { merge: true });
    return true;
  } catch (e) {
    console.error(`Error saving perfume ${perfume.id} to Firestore:`, e);
    return false;
  }
};

/**
 * Update stock quantity and inStock status in Firestore
 */
export const updatePerfumeStockInFirestore = async (
  id: string, 
  newStock: number
): Promise<boolean> => {
  const firestore = getFirebaseDb();
  if (!firestore) return false;

  try {
    const docRef = doc(firestore, 'dealbo_perfumes', id);
    const stockQuantity = Math.max(0, newStock);
    await updateDoc(docRef, {
      stockQuantity,
      inStock: stockQuantity > 0
    });
    return true;
  } catch (e) {
    console.error(`Error updating stock for ${id} in Firestore:`, e);
    return false;
  }
};

/**
 * Toggle stock status in Firestore
 */
export const toggleStockStatusInFirestore = async (
  id: string, 
  currentInStock: boolean,
  currentStockQty: number = 0
): Promise<boolean> => {
  const firestore = getFirebaseDb();
  if (!firestore) return false;

  try {
    const nextInStock = !currentInStock;
    const nextStockQuantity = nextInStock ? (currentStockQty > 0 ? currentStockQty : 3) : 0;
    const docRef = doc(firestore, 'dealbo_perfumes', id);
    await updateDoc(docRef, {
      inStock: nextInStock,
      stockQuantity: nextStockQuantity
    });
    return true;
  } catch (e) {
    console.error(`Error toggling stock for ${id} in Firestore:`, e);
    return false;
  }
};

/**
 * Delete a perfume from Firestore
 */
export const deletePerfumeFromFirestore = async (id: string): Promise<boolean> => {
  const firestore = getFirebaseDb();
  if (!firestore) return false;

  try {
    const docRef = doc(firestore, 'dealbo_perfumes', id);
    await deleteDoc(docRef);
    return true;
  } catch (e) {
    console.error(`Error deleting perfume ${id} from Firestore:`, e);
    return false;
  }
};

/**
 * Sync entire catalog array to Firestore
 */
export const syncCatalogToFirestore = async (perfumes: Perfume[]): Promise<boolean> => {
  const firestore = getFirebaseDb();
  if (!firestore) return false;

  try {
    const batch = writeBatch(firestore);
    for (const p of perfumes) {
      const docRef = doc(firestore, 'dealbo_perfumes', p.id);
      batch.set(docRef, p, { merge: true });
    }
    await batch.commit();
    return true;
  } catch (e) {
    console.error('Error syncing entire catalog to Firestore:', e);
    return false;
  }
};

/**
 * Fetch one-time snapshot of perfumes from Firestore
 */
export const fetchCatalogFromFirestore = async (): Promise<Perfume[] | null> => {
  const firestore = getFirebaseDb();
  if (!firestore) return null;

  try {
    const snapshot = await getDocs(collection(firestore, 'dealbo_perfumes'));
    if (snapshot.empty) {
      await seedInitialCatalogIfEmpty();
      return initialPerfumes;
    }
    const items: Perfume[] = [];
    snapshot.forEach(docSnap => {
      items.push(docSnap.data() as Perfume);
    });
    return items;
  } catch (e) {
    console.error('Error fetching catalog from Firestore:', e);
    return null;
  }
};

// ----------------------------------------------------
// REAL-TIME ORDERS
// ----------------------------------------------------

/**
 * Save an order to Firestore
 */
export const saveOrderToFirestore = async (order: OrderDetails): Promise<string | null> => {
  const firestore = getFirebaseDb();
  if (!firestore) return null;

  try {
    const ordersCol = collection(firestore, 'dealbo_orders');
    const docRef = await addDoc(ordersCol, {
      ...order,
      createdAtIso: new Date().toISOString(),
      timestamp: Date.now()
    });
    return docRef.id;
  } catch (e) {
    console.error('Error saving order to Firestore:', e);
    return null;
  }
};

/**
 * Subscribe to real-time orders list
 */
export const subscribeToOrders = (
  onUpdate: (orders: OrderDetails[]) => void
): (() => void) => {
  const firestore = getFirebaseDb();
  if (!firestore) return () => {};

  const colRef = collection(firestore, 'dealbo_orders');
  const q = query(colRef, orderBy('createdAtIso', 'desc'));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const orders: OrderDetails[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data() as OrderDetails;
        orders.push({
          ...data,
          id: docSnap.id
        });
      });
      onUpdate(orders);
    },
    (err) => {
      console.warn('Orders snapshot listener error (will fallback to unordered query):', err);
      // Fallback query if index is not ready yet
      onSnapshot(colRef, (snap) => {
        const list: OrderDetails[] = [];
        snap.forEach(d => list.push({ ...(d.data() as OrderDetails), id: d.id }));
        onUpdate(list);
      });
    }
  );

  return unsubscribe;
};

/**
 * Update status of an order
 */
export const updateOrderStatusInFirestore = async (
  orderId: string, 
  status: OrderDetails['status']
): Promise<boolean> => {
  const firestore = getFirebaseDb();
  if (!firestore) return false;

  try {
    const docRef = doc(firestore, 'dealbo_orders', orderId);
    await updateDoc(docRef, { status });
    return true;
  } catch (e) {
    console.error(`Error updating order ${orderId} status:`, e);
    return false;
  }
};

// ----------------------------------------------------
// STORE CONFIGURATION & ANNOUNCEMENTS
// ----------------------------------------------------

export const subscribeToStoreConfig = (
  onUpdate: (config: StoreConfig) => void
): (() => void) => {
  const firestore = getFirebaseDb();
  if (!firestore) return () => {};

  const docRef = doc(firestore, 'dealbo_config', 'main');
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      onUpdate({ ...siteConfig, ...docSnap.data() } as StoreConfig);
    }
  });
};

export const saveStoreConfigToFirestore = async (
  config: Partial<StoreConfig>
): Promise<boolean> => {
  const firestore = getFirebaseDb();
  if (!firestore) return false;

  try {
    const docRef = doc(firestore, 'dealbo_config', 'main');
    await setDoc(docRef, config, { merge: true });
    return true;
  } catch (e) {
    console.error('Error saving store config to Firestore:', e);
    return false;
  }
};
