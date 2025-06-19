import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAQAQv-ki3X8wZHUqeAVngpSX5A9H2r3QM',
  authDomain: 'echotip-v5-b7d93.firebaseapp.com',
  projectId: 'echotip-v5-b7d93',
  storageBucket: 'echotip-v5-b7d93.firebasestorage.app',
  messagingSenderId: '1047941335542',
  appId: '1:1047941335542:web:d21edb9d50c7285e691fd7',
  measurementId: 'G-YDG29CTERB',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
