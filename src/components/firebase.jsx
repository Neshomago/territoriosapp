// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  getFirestore
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const googleMapsApiKey = 'AIzaSyAJQuy1lPIpsQ_Y9AePCq0ITTLkurl50II';

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Firestore with Offline Persistence (IndexedDB multi-tab cache)
let firestoreDb;
try {
  firestoreDb = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  });
  console.log("🔥 Firestore inicializado con persistencia offline (IndexedDB)");
} catch (e) {
  console.warn("⚠️ Fallback a getFirestore por inicialización previa:", e);
  firestoreDb = getFirestore(app);
}

export const db = firestoreDb;
export const auth = getAuth(app);

// 🧪 Configuración de Colecciones para Modo Pruebas (Aislamiento de datos reales)
// Por defecto en local usamos las colecciones de test para no alterar datos de producción
export const IS_TEST_MODE = true;

export const COLLECTIONS = {
  TERRITORIES: IS_TEST_MODE ? 'territories_test' : 'territories',
  FOLIO_RECORDS: IS_TEST_MODE ? 'folio_records_test' : 'folio_records',
  LEGACY_FOLIO: IS_TEST_MODE ? 'folio_legacy_test' : 'folioAlboradaEste',
  USERS: 'users'
};