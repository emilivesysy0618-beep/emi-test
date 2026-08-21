import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-app.js";
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-auth.js";
import { collection, doc, getDoc, getDocs, getFirestore, serverTimestamp, setDoc } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCQhJOWnlha6EBd9qOZX831ejz8BiLe9xc",
  authDomain: "emi-test-e8a25.firebaseapp.com",
  projectId: "emi-test-e8a25",
  storageBucket: "emi-test-e8a25.firebasestorage.app",
  messagingSenderId: "363269982047",
  appId: "1:363269982047:web:10cafe7a5f95778bb318ea"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, collection, db, doc, getDoc, getDocs, googleProvider, onAuthStateChanged, serverTimestamp, setDoc, signInWithPopup, signOut };
