import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
const app = firebase.initializeApp({
    apiKey: process.env.REACT_APP_ORCHARD_API_KEY,
    authDomain: process.env.REACT_APP_ORCHARD_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_ORCHARD_DATABASEURL,
    projectId: process.env.REACT_APP_ORCHARD_PROJECT_ID,
    storageBucket: process.env.REACT_APP_ORCHARD_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_ORCHARD_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_ORCHARD_APP_ID
})

export const auth = app.auth(); 
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export default app;