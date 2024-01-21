let log = console.log;

const loading = (button, disabled, content) => {
  disabled ? button.setAttribute("disabled", true) : button.removeAttribute("disabled", true);
  button.innerHTML = content;
}

let name = null;

do{
  name = prompt("Enter Your Name!");
}while(!name);

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";


const firebaseConfig = {
  apiKey: "AIzaSyC2tyr2TwnOTsT6HzhX-4FeJjYugqHJbRk",
  authDomain: "shop-com2.firebaseapp.com",
  databaseURL: "https://shop-com2-default-rtdb.firebaseio.com",
  projectId: "shop-com2",
  storageBucket: "shop-com2.appspot.com",
  messagingSenderId: "124251492278",
  appId: "1:124251492278:web:b52d58b8d7abed78a07b17"
};

const app = initializeApp(firebaseConfig);

import {
  getDatabase,
  set,
  ref,
  get,
  onValue,
  serverTimestamp,
  
} from "./database.js";
import { sorting } from "./sortOwnWay.js";

const database = getDatabase(app);

const send = document.querySelector(".sendMessage .material-symbols-outlined");
const sendMessageInput = document.querySelector(".sendMessageInput");

sendMessageInput.addEventListener("input", e => {
  if (e.target.value) {
    send.style.opacity = 1;
    send.style.pointerEvents = "all";
  }
  else {
    send.style.opacity = 0.5;
    send.style.pointerEvents = "none";
  }
})

sendMessageInput.addEventListener("focus", () => {
  addEventListener("keydown", e => {
    if (e.key.includes("Enter")) {
      send.click();
    }
  })
})

let totalMessage = null;

send.addEventListener("click", () => {
  let dref = ref(database);

  const message = sendMessageInput.value.trim();
  if(!message) return;

  get(dref).then(snapshot => {
    totalMessage = snapshot.size;
    ++totalMessage;

    dref = ref(database, `${totalMessage}${name}`);
      set(dref, {
        message: message,
        createdAt: serverTimestamp()
      })
  })
  sendMessageInput.value = "";
})


get(ref(database)).then(snapshot => {
  totalMessage = snapshot.size;
  ++totalMessage;
  set(ref(database, totalMessage + name), {
    message: name + " Joined!"
  })
})


addEventListener("beforeunload", e => {
  localStorage.setItem("windowClosed", true);
})

const allChat = document.querySelector(".allChat");

onValue(ref(database), snapshot => {
  allChat.innerHTML = "";

  let allUserName = [];

  snapshot.forEach(child => {
    allUserName.push(child.key);
  })
  const newArr = sorting(allUserName);
  newArr.forEach(arr => {
    appendMessage(arr, snapshot)
  })
})

function appendMessage(id, snapshot) {
  let h4 = document.createElement("h4");
  let span = document.createElement("span");
  
  
  span.classList.add("userName");
  h4.classList.add("another");
  

  h4.textContent = snapshot.val()[id].message;

  if (snapshot.val()[id].message.includes("Joined")) {
    h4.classList.replace("another", "NewJoined");
    span.remove();
  }
  else if (id.includes(name)) {
      h4.classList.replace("another", "myself");
  }

  if(!snapshot.val()[id].message.includes("Joined")) {
    span.textContent = id.replaceAll(/[0-9]/g, "");
  }

  h4.append(span)
  allChat.appendChild(h4);

  allChat.scrollTop = allChat.scrollHeight;
}
