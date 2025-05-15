
// Ініціалізація Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAMUXw7GRwhq_-Pz7RFU6yR01izYi4cCuw",
  authDomain: "guess-ai.firebaseapp.com",
@@ -14,53 +15,85 @@ const firebaseConfig = {

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// initialize database
const db = firebase.database();

// get user's data
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

// submit form
// listen for submit event on the form and call the postChat function
// Відправлення повідомлення
document.getElementById("message-form").addEventListener("submit", sendMessage);

// send message to db
function sendMessage(e) {
  e.preventDefault();

  // get values to be submitted
  const timestamp = Date.now();
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value;

  // clear the input box
  messageInput.value = "";

  //auto scroll to bottom
  document
    .getElementById("messages")
    .scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
  document.getElementById("messages").scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });

  // create db collection and send in the data
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

// display the messages
// reference the collection created earlier
const fetchChat = db.ref("messages/");
// Функція для генерації відповіді ШІ
function getAIResponse(message) {
  const msg = message.toLowerCase();

// check for new messages using the onChildAdded event listener
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
  const message = `<li class=${
    username === messages.username ? "sent" : "receive"
  }><span>${messages.username}: </span>${messages.message}</li>`;
  // append the message on the page
  const message = `<li class=${username === messages.username ? "sent" : "receive"}><span>${messages.username}: </span>${messages.message}</li>`;
  document.getElementById("messages").innerHTML += message;
});
Footer
