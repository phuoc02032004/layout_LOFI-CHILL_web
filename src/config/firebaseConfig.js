import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBsbzEpZuowHfaLvIuQKivTVSpjxzUkytc",
  authDomain: "music-52602.firebaseapp.com",
  projectId: "music-52602",
  storageBucket: "music-52602.appspot.com",
  messagingSenderId: "74288560870",
  appId: "1:74288560870:web:dcfaf3a9fd3891826f5927",
  measurementId: "G-6DQCF7QWLJ"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
