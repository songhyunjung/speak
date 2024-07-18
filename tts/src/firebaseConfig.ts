// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyALv6pA8M3nN1BYFHUfBM2jDG105z_PKrQ",
    authDomain: "speak-e3ceb.firebaseapp.com",
    projectId: "speak-e3ceb",
    storageBucket: "speak-e3ceb.appspot.com",
    messagingSenderId: "930086126949",
    appId: "1:930086126949:web:a028d8aea88bfa19b0cd8c",
    measurementId: "G-33F9R35HFP"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

export { database }; // Export database instead of default export