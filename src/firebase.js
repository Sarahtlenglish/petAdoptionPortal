// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAClbBtB656kVqXMMGMWgm581noSTjoVRY",
  authDomain: "petadoptionportal.firebaseapp.com",
  projectId: "petadoptionportal",
  storageBucket: "petadoptionportal.firebasestorage.app",
  messagingSenderId: "896634503503",
  appId: "1:896634503503:web:8f11765453b8724852453a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db }; 