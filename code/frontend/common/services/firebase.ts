// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = JSON.parse(
  process.env.NEXT_PUBLIC_FIREBASE_CONFIG || '{}'
);

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
