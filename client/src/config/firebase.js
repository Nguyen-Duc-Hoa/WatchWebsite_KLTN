// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA37MLxzQklMlAgIveje5j0JCaju3wg46A",
  authDomain: "minimix-8f98b.firebaseapp.com",
  projectId: "minimix-8f98b",
  storageBucket: "minimix-8f98b.appspot.com",
  messagingSenderId: "633465663637",
  appId: "1:633465663637:web:2e37e42c806a7ee083eb9c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app, "gs://minimix-8f98b.appspot.com");