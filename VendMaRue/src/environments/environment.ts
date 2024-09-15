// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyDwwwirDsV8swvUKo4Adpbit8BwzH_mwXI",
  authDomain: "fir-demo-2e44f.firebaseapp.com",
  databaseURL: "https://fir-demo-2e44f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fir-demo-2e44f",
  storageBucket: "fir-demo-2e44f.appspot.com",
  messagingSenderId: "467064314850",
  appId: "1:467064314850:web:d27d5d52d105bd12c3f7bb",
  measurementId: "G-JPVV5PP305"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);