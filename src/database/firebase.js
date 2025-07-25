// firebase.js
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_PROJECT_ID.appspot.com",
//   messagingSenderId: "YOUR_SENDER_ID",
//   appId: "YOUR_APP_ID",
// };

const firebaseConfig = {
    apiKey: "AIzaSyACpuzpkeERo60utl5iXeDh3TffmkK-JCo",
    authDomain: "kisandada-prod.firebaseapp.com",
    projectId: "kisandada-prod",
    storageBucket: "kisandada-prod.firebasestorage.app",
    messagingSenderId: "474694040088",
    appId: "1:474694040088:web:6dbc23551fe66009d7216d",
    measurementId: "G-QT61YZ2JCE"
  };

  const app = initializeApp(firebaseConfig);

  // Use persistence for React Native
  const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
  
  export { auth };