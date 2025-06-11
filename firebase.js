import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB3_h8MQNfQ-5Hkvvo1XipOXb-Xr2qpvmA",
  authDomain: "solvobill-98d44.firebaseapp.com",
  projectId: "solvobill-98d44",
  storageBucket: "solvobill-98d44.firebasestorage.app",
  messagingSenderId: "1054680909344",
  appId: "1:1054680909344:web:33c2c26487feb2deeb5e45",
};

// ✅ Initialize Firebase App
const app = initializeApp(firebaseConfig);

// ✅ Export Auth, Firestore, and Google Provider
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
export default app;
