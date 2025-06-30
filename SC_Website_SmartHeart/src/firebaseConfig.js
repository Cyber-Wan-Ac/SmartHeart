import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = {
  databaseURL: process.env.REACT_APP_FIREBASE_URL
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, onValue };