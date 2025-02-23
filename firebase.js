import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB3_h8MQNfQ-5Hkvvo1XipOXb-Xr2qpvmA", // Replace with your Firebase API Key
  authDomain: "solvobill-98d44.firebaseapp.com",
  projectId: "solvobill-98d44",
  storageBucket: "solvobill-98d44.firebasestorage.app",
  messagingSenderId: "1054680909344",
  appId: "1:1054680909344:web:33c2c26487feb2deeb5e45",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
