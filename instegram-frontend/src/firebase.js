import firebase from 'firebase'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseApp =  firebase.initializeApp({
    apiKey: "AIzaSyCqU-zLKxXiAEypydEWl5zxuEmFcrsgLN4",
    authDomain: "insta-clone-56daf.firebaseapp.com",
    databaseURL: "https://insta-clone-56daf.firebaseio.com",
    projectId: "insta-clone-56daf",
    storageBucket: "insta-clone-56daf.appspot.com",
    messagingSenderId: "476699214689",
    appId: "1:476699214689:web:16bc476fa4fc5e821c3b20",
    measurementId: "G-JH3M3YJEGR"
  });

  const db =firebaseApp.firestore();
  const auth =firebase.auth();
  const storage =firebase.storage();

  export { db, auth, storage};

