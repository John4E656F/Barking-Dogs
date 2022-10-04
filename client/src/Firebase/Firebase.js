import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAjWz9KrfXMqXtOLgTjvlUBHWGkBrDjBdU",
  authDomain: "bark-5b302.firebaseapp.com",
  projectId: "bark-5b302",
  storageBucket: "bark-5b302.appspot.com",
  messagingSenderId: "908802450180",
  appId: "1:908802450180:web:f67ad0544fb894ef8ae651",
  measurementId: "G-HK2LF5XMHY"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const storage = firebase.storage(firebaseApp);

const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider, storage };

