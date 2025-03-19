// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  enableNetwork,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAClbBtB656kVqXMMGMWgm581noSTjoVRY",
  authDomain: "petadoptionportal.firebaseapp.com",
  projectId: "petadoptionportal",
  storageBucket: "petadoptionportal.appspot.com",
  messagingSenderId: "896634503503",
  appId: "1:896634503503:web:8f11765453b8724852453a"
};

let db;
let storage;

try {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  
  // Initialize Firestore with persistence
  db = initializeFirestore(app, {
    cache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  });
  
  // Get Storage instance
  storage = getStorage(app);
  
  // Enable network
  enableNetwork(db).catch(error => {
    console.error('Error enabling network:', error);
  });
} catch (error) {
  console.error('Error initializing Firebase:', error);
  // You might want to show a user-friendly error message here
  throw new Error('Could not initialize Firebase. Please try again later.');
}

export { db, storage }; 