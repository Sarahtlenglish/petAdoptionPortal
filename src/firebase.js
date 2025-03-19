// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  enableNetwork,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAClbBtB656kVqXMMGMWgm581noSTjoVRY",
  authDomain: "petadoptionportal.firebaseapp.com",
  projectId: "petadoptionportal",
  storageBucket: "petadoptionportal.appspot.com",
  messagingSenderId: "896634503503",
  appId: "1:896634503503:web:8f11765453b8724852453a"
};

let db;
let auth;

try {
  console.log('Initializing Firebase...');
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  console.log('Firebase app initialized');
  
  // Initialize Firestore with persistence
  db = initializeFirestore(app, {
    cache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  });
  console.log('Firestore initialized');
  
  // Initialize Authentication
  auth = getAuth(app);
  console.log('Auth initialized');
  
  // Add auth state listener
  onAuthStateChanged(auth, (user) => {
    console.log('Auth state changed:', user ? 'User is signed in' : 'No user');
  });
  
  // Enable network
  enableNetwork(db).catch(error => {
    console.error('Error enabling network:', error);
  });
} catch (error) {
  console.error('Error initializing Firebase:', error);
  // You might want to show a user-friendly error message here
  throw new Error('Could not initialize Firebase. Please try again later.');
}

export { db, auth }; 