import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyArOCXetJtaMMJStNiDqR5716QLLGBUEWc",
  authDomain: "react-native-with-expo-377f7.firebaseapp.com",
  projectId: "react-native-with-expo-377f7",
  storageBucket: "react-native-with-expo-377f7.firebasestorage.app",
  messagingSenderId: "938616619792",
  appId: "1:938616619792:web:6ac67f6aa9cc4531761b95",
  measurementId: "G-CE1R20P86S"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
