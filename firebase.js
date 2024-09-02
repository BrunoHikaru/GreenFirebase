import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';  // Importar Firestore
import { getStorage } from 'firebase/storage'; // Importar o Firebase Storage
import { getDatabase, ref } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyA9CyNmwf_8Uq5G6bp4RZbmbpuks4WxIpU",
    authDomain: "greenvolunteers-c43b4.firebaseapp.com",
    databaseURL: "https://greenvolunteers-c43b4-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "greenvolunteers-c43b4",
    storageBucket: "greenvolunteers-c43b4.appspot.com",
    messagingSenderId: "728577396575",
    appId: "1:728577396575:web:b027c40e9f203100ac30ea"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// Inicializa o Firestore
const firestore = getFirestore(app);
const storage = getStorage(app);
const database =  getDatabase(app);

export { auth, firestore, storage, database };
