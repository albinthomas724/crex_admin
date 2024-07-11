import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getDatabase, ref as dbRef, onValue, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDczLLPnaREY3SahAMeKJ-DOMyVENmWwLk",
  authDomain: "crex-f9f68.firebaseapp.com",
  databaseURL: "https://crex-f9f68-default-rtdb.firebaseio.com",
  projectId: "crex-f9f68",
  storageBucket: "crex-f9f68.appspot.com",
  messagingSenderId: "209664661907",
  appId: "1:209664661907:web:933435dab65ebb20913066"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

const feedbackRef = dbRef(database, 'crex/feedback');

function formatDateTime(timestamp) {
  const date = new Date(timestamp);
  const formattedDate = date.toLocaleDateString(); // Get only the date part
  const formattedTime = date.toLocaleTimeString(); // Get only the time part
  return `${formattedDate} ${formattedTime}`;
}

function fetchFeedbackDetails() {
  onValue(feedbackRef, (snapshot) => {
    const feedbackTable = document.getElementById('feedback-table');
    const feedbackTableBody = feedbackTable.getElementsByTagName('tbody')[0];
    feedbackTableBody.innerHTML = ''; // Clear the table body

    snapshot.forEach(userFeedback => {
      const username = userFeedback.key;
      userFeedback.forEach(feedbackEntry => {
        const feedback = feedbackEntry.val();
        const row = feedbackTableBody.insertRow();
        const cellUsername = row.insertCell(0);
        const cellRating = row.insertCell(1);
        const cellComment = row.insertCell(2);
        const cellTimestamp = row.insertCell(3);
        const cellDelete = row.insertCell(4);

        cellUsername.textContent = username;
        cellRating.textContent = feedback.rating;
        cellComment.textContent = feedback.comment;
        cellTimestamp.textContent = formatDateTime(feedback.timestamp);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger btn-sm';
        deleteButton.textContent = 'Delete';

        deleteButton.onclick = () => {
          const feedbackRefToDelete = dbRef(database, `crex/feedback/${username}/${feedbackEntry.key}`);
          remove(feedbackRefToDelete);
        };

        cellDelete.appendChild(deleteButton);
      });
    });
  }, (error) => {
    console.error('Error fetching feedback details:', error);
  });
}

// Add an event listener to the feedback button
document.getElementById('feedbackBtn').addEventListener('click', fetchFeedbackDetails);