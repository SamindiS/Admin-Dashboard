// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-auth-803f1.firebaseapp.com",
    projectId: "mern-auth-803f1",
    storageBucket: "mern-auth-803f1.appspot.com",
    messagingSenderId: "264213743920",
    appId: "1:264213743920:web:cda328d92d80e0e105e0f5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);