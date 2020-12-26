import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyD0mXg4a3X73c79C-VrST9wATdXWIz1TeU",
    authDomain: "shopsmilk-2b6c9.firebaseapp.com",
    databaseURL: "https://shopsmilk-2b6c9.firebaseio.com",
    projectId: "shopsmilk-2b6c9",
    storageBucket: "shopsmilk-2b6c9.appspot.com",
    messagingSenderId: "961885901252",
    appId: "1:961885901252:web:6809722cd7bda367961491",
    measurementId: "G-RE4LGBTBNL"
};

firebase.initializeApp(firebaseConfig);

export default firebase