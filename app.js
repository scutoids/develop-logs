import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA9Xs3tuawuf5yypI5BsSoGzCIjTKlHOPo",
  authDomain: "fypd-1a987.firebaseapp.com",
  projectId: "fypd-1a987",
  storageBucket: "fypd-1a987.firebasestorage.app",
  messagingSenderId: "828708374248",
  appId: "1:828708374248:web:95c0246527945a7e362b5d",
  measurementId: "G-8LNX8755DB",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const toggleFormBtn = document.getElementById("toggleFormBtn");
const formSection = document.getElementById("formSection");
const logForm = document.getElementById("logForm");
const logsContainer = document.getElementById("logsContainer");

// Toggle form visibility
toggleFormBtn.addEventListener("click", () => {
  formSection.classList.toggle("hidden");
});

// Handle form submission
logForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    await addDoc(collection(db, "devlogs"), {
      phase: document.getElementById("phase").value,
      focus: document.getElementById("focus").value,
      completed: document.getElementById("completed").value,
      problems: document.getElementById("problems").value,
      goals: document.getElementById("goals").value,
      timestamp: serverTimestamp(),
    });
    logForm.reset();
    formSection.classList.add("hidden");
    alert(
      "Log published successfully! The homepage has been automatically updated.",
    );
  } catch (error) {
    console.error("Error adding document: ", error);
    alert(
      "Failed to publish. Please ensure you have entered the correct Firebase Config.",
    );
  }
});

// Listen for database changes and update the webpage in real-time
const q = query(collection(db, "devlogs"), orderBy("timestamp", "desc"));
onSnapshot(q, (snapshot) => {
  logsContainer.innerHTML = "";
  snapshot.forEach((doc) => {
    const data = doc.data();
    const dateStr = data.timestamp
      ? data.timestamp.toDate().toLocaleDateString("en-US")
      : "Just now";

    // Convert line breaks to list items
    const formatList = (text) =>
      text
        .split("\n")
        .filter((t) => t.trim())
        .map((t) => `<li>${t}</li>`)
        .join("");

    const entryHTML = `
            <div class="log-entry">
                <span class="log-date">Update Date: ${dateStr}</span>
                <br>
                <span class="tag">${data.phase}</span>
                <h3>Current Focus</h3>
                <p>${data.focus}</p>
                <h3>Completed Tasks</h3>
                <ul>${formatList(data.completed)}</ul>
                <h3>Problems Faced & Solutions</h3>
                <ul>${formatList(data.problems)}</ul>
                <h3>Next Goals</h3>
                <ul>${formatList(data.goals)}</ul>
            </div>
        `;
    logsContainer.innerHTML += entryHTML;
  });
});
