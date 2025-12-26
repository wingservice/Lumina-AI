
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCMRnZQB8JBOtuJotNfUxTzLUlhr4H8Wuo",
  authDomain: "lumina-ai-4f66f.firebaseapp.com",
  projectId: "lumina-ai-4f66f",
  storageBucket: "lumina-ai-4f66f.firebasestorage.app",
  messagingSenderId: "352742127442",
  appId: "1:352742127442:web:3474e5bd3fc0463b902c8b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
