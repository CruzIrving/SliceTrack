// firebase.ts
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB9xrU0s5l3a8Swt6AE5tz71GY_Qg5W0k8",
  authDomain: "slice-track.firebaseapp.com",
  projectId: "slice-track",
  storageBucket: "slice-track.firebasestorage.app",
  messagingSenderId: "760085766618",
  appId: "1:760085766618:web:41029e87167f4077a6e0e3",
};

const app = initializeApp(firebaseConfig);

// ✅ Auth con persistencia real en React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

// Proveedores
export { GoogleAuthProvider, signInWithCredential };
