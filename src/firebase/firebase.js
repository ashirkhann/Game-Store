import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCS3xSycWzQOcd6T8ObWbTrbd80hWyfVPw",
  authDomain: "game-store-7a7ea.firebaseapp.com",
  projectId: "game-store-7a7ea",
  storageBucket: "game-store-7a7ea.appspot.com",
  messagingSenderId: "831953212122",
  appId: "1:831953212122:web:5517052e7c7c26e2390be3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 
const auth = getAuth(); 

export { db , auth};
