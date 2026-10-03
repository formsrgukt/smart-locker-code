import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyARcLYjFBKCyLRadBb68XlxtHlFy__piII",
  authDomain: "smart-locker-57a98.firebaseapp.com",
  projectId: "smart-locker-57a98",
  storageBucket: "smart-locker-57a98.firebasestorage.app",
  messagingSenderId: "955905965351",
  appId: "1:955905965351:web:b92e5088a6a219bc0dfd02",
  measurementId: "G-6X61MBJW02"
};

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

// Initialize Analytics only in the browser and if supported
let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, analytics, db, auth };
