import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBfJjX8yRpWvQ6QG48RBjvaXkl-sP6h7a8",
  authDomain: "zoocast-37be0.firebaseapp.com",
  projectId: "zoocast-37be0",
  storageBucket: "zoocast-37be0.firebasestorage.app",
  messagingSenderId: "515616196854",
  appId: "1:515616196854:web:f28c81eaeaa1699c6304d7"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);