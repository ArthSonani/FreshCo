// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "grocerblink.firebaseapp.com",
  projectId: "grocerblink",
  storageBucket: "grocerblink.appspot.com",
  messagingSenderId: "432797306614",
  appId: "1:432797306614:web:47bf1c40d28bf2fe41a6d7",
  measurementId: "G-3XWCNN5P11"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);