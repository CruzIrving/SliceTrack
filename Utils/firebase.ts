// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9xrU0s5l3a8Swt6AE5tz71GY_Qg5W0k8",
  authDomain: "slice-track.firebaseapp.com",
  projectId: "slice-track",
  storageBucket: "slice-track.firebasestorage.app",
  messagingSenderId: "760085766618",
  appId: "1:760085766618:web:41029e87167f4077a6e0e3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export { GoogleAuthProvider, signInWithCredential };
