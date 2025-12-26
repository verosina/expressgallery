import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, addDoc, collection } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔴 REPLACE WITH YOUR FIREBASE CONFIG
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAGjOJeYfO9T7WoMlqRSdh1sFgJDhY5xss",
  authDomain: "expressgallery.firebaseapp.com",
  projectId: "expressgallery",
  storageBucket: "expressgallery.firebasestorage.app",
  messagingSenderId: "712598948196",
  appId: "1:712598948196:web:9a2d703e2cea38814b9271",
  measurementId: "G-VMLBJ105N9"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let currentUser = null;

// 🔹 AUTH FUNCTIONS
window.signUp = () => {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(loginSuccess)
    .catch(err => alert(err.message));
};

window.signIn = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(loginSuccess)
    .catch(err => alert(err.message));
};

function loginSuccess(userCred) {
  currentUser = userCred.user;
  startApp();
}

window.guest = () => startApp();

function startApp() {
  document.getElementById("auth").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
}

// 🔹 ART GENERATION
window.express = () => {
  const feeling = document.getElementById("feeling").value.toLowerCase();
  ctx.clearRect(0,0,400,400);
  
  const colors = pickColors(feeling);
  
  for(let i=0;i<15;i++){
    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.arc(Math.random()*400, Math.random()*400, Math.random()*80, 0, Math.PI*2);
    ctx.fill();
  }
};

function pickColors(text) {
  if (text.includes("sad")) return ["#5c6b8a", "#889bb5"];
  if (text.includes("happy")) return ["#ffd166", "#ef476f"];
  if (text.includes("calm")) return ["#a8dadc", "#f1faee"];
  return ["#e5989b", "#b5838d", "#6d6875"];
}

// 🔹 SAVE TO FIRESTORE
window.save = async () => {
  if (!currentUser) {
    alert("Sign in to save your artwork.");
    return;
  }

  const img = canvas.toDataURL();

  await addDoc(collection(db, "gallery"), {
    uid: currentUser.uid,
    image: img,
    created: new Date()
  });

  const preview = document.createElement("img");
  preview.src = img;
  gallery.appendChild(preview);
};

