import firebase from './firebase/app';
import './firebase/database'; // Example: Importing the database module if you need it

// Import other Firebase modules as needed (auth, firestore, etc.)


  // firebase-init.js

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDczLLPnaREY3SahAMeKJ-DOMyVENmWwLk",
    authDomain: "crex-f9f68.firebaseapp.com",
    databaseURL: "https://crex-f9f68-default-rtdb.firebaseio.com",
    projectId: "crex-f9f68",
    storageBucket: "crex-f9f68.appspot.com",
    messagingSenderId: "209664661907",
    appId: "1:209664661907:web:933435dab65ebb20913066"
  };
  
  // Initialize Firebase
  export function initFirebase() {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig); // <-- Corrected here
    }
    return firebase.app();
  }
  