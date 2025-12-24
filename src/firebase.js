import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDy0bdfnmaPnYf83BNhhdgBXsdMS4KNYV4",
  authDomain: "rueda-spin.firebaseapp.com",
  projectId: "rueda-spin",
  storageBucket: "rueda-spin.firebasestorage.app",
  messagingSenderId: "673738262104",
  appId: "1:673738262104:web:0258b13adc10652a016c2d"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
