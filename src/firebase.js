import firebase from "firebase";
import "firebase/firestore";
import "firebase/remote-config";
console.log(process.env)


const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};
console.log(firebaseConfig)
const app =  firebase.initializeApp(firebaseConfig)

export const auth = app.auth();
export const storageRef = firebase.storage().ref();

export const remoteConfig = firebase.remoteConfig();
export const db = firebase.firestore();

export default firebase;
