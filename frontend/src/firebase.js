// ============================================================
// firebase.js — Firebase configuration
// ============================================================

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCx85SvUPdmWcxMWZurTlwOJO92lXLXQQs",
  authDomain: "nestnav-f8316.firebaseapp.com",
  projectId: "nestnav-f8316",
  storageBucket: "nestnav-f8316.firebasestorage.app",
  messagingSenderId: "164095596193",
  appId: "1:164095596193:web:a0fcafe104e0e155f8c2e0"
};

// Initialize Firebase
let db = null;
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (e) {
  console.error('[NestNav] Firebase initialization error:', e);
}

export { db };
