// Firebase конфігурація
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Ініціалізація Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAMUXw7GRwhq_-Pz7RFU6yR01izYi4cCuw",
  authDomain: "guess-ai.firebaseapp.com",
  projectId: "guess-ai",
  storageBucket: "guess-ai.firebasestorage.app",
  messagingSenderId: "182407504429",
  appId: "1:182407504429:web:0e662e4136b286f6a2cea4",
  measurementId: "G-62J2DK6D97"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Масиви відповідей
const greetings = [
  "Привіт! Як справи?",
  "Доброго дня! Чим можу допомогти?",
  "Хеллоу! Радий тебе бачити!"
];

const movies = [
  "Я люблю фільми Крістофера Нолана. А ти?",
  "Ти бачив останній фільм Marvel?",
  "Мій улюблений фільм — «Інтерстеллар»."
];

const games = [
  "Я граю в шахи! А ти у що любиш грати?",
  "Fortnite чи CS:GO — що краще?",
  "Геймінг — це нова культура, правда ж?"
];

const genericResponses = [
  "Цікаво!",
  "Можеш розповісти більше?",
  "А чому ти так думаєш?"
];

// Запит імені користувача
const username = prompt("Please Tell Us Your Name");

// Відправлення повідомлення
document.getElementById("message-form").addEventListener("submit", sendMessage);

function sendMessage(e) {
  e.preventDefault();

  const timestamp = Date.now();
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value;
  messageInput.value = "";

  document.getElementById("messages").scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });

  db.ref("messages/" + timestamp).set({
    username,
    message,
  });

  // Генеруємо відповідь від ШІ
  const aiReply = getAIResponse(message);
  setTimeout(() => {
    const botTimestamp = Date.now();
    db.ref("messages/" + botTimestamp).set({
      username: "AI Bot 🤖",
      message: aiReply,
    });
  }, 2000);
}

// Функція для генерації відповіді ШІ
function getAIResponse(message) {
  const msg = message.toLowerCase();

  if (msg.includes("привіт") || msg.includes("доброго") || msg.includes("хай")) {
    return greetings[Math.floor(Math.random() * greetings.length)];
  } else if (msg.includes("фільм") || msg.includes("кіно") || msg.includes("серіал")) {
    return movies[Math.floor(Math.random() * movies.length)];
  } else if (msg.includes("гра") || msg.includes("ігри") || msg.includes("геймінг")) {
    return games[Math.floor(Math.random() * games.length)];
  } else {
    return genericResponses[Math.floor(Math.random() * genericResponses.length)];
  }
}

// Виведення повідомлень
const fetchChat = db.ref("messages/");
fetchChat.on("child_added", function (snapshot) {
  const messages = snapshot.val();
  const message = `<li class=${username === messages.username ? "sent" : "receive"}><span>${messages.username}: </span>${messages.message}</li>`;
  document.getElementById("messages").innerHTML += message;
});
