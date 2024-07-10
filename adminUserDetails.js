// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDczLLPnaREY3SahAMeKJ-DOMyVENmWwLk",
  authDomain: "crex-f9f68.firebaseapp.com",
  databaseURL: "https://crex-f9f68-default-rtdb.firebaseio.com",
  projectId: "crex-f9f68",
  storageBucket: "crex-f9f68.appspot.com",
  messagingSenderId: "209664661907",
  appId: "1:209664661907:web:933435dab65ebb20913066"
};

firebase.initializeApp(firebaseConfig);

// Get a reference to the Realtime Database
const db = firebase.database();

// Reference to the users database
const usersRef = db.ref('crex/users');

// ... rest of your code

//... rest of your code

function displayUserData() {
  usersRef.on('value', (snapshot) => {
    const userData = snapshot.val();
    const userTableBody = document.getElementById('user-table-body');
    userTableBody.innerHTML = '';

    Object.keys(userData).forEach((username) => {
      const user = userData[username];
      const tableRow = document.createElement('tr');
      tableRow.innerHTML = `
        <td>${username}</td>
        <td>${user.email}</td>
        <td>${user.password}</td>
        <td>
          <button class="btn btn-danger" id="delete-btn-${username}">Delete</button>
        </td>
      `;
      userTableBody.appendChild(tableRow);

      // Attach event listener to the delete button
      const deleteBtn = document.getElementById(`delete-btn-${username}`);
      deleteBtn.addEventListener('click', () => {
        deleteUser(username);
      });
    });
  });
}

// Function to delete user data
function deleteUser(username) {
  usersRef.child(username).remove()
  .then(() => {
      alert(`User ${username} deleted successfully!`);
    })
  .catch((error) => {
      console.error('Error deleting user:', error);
      alert('Error deleting user. Please try again.');
    });
}

// Add event listener to display button
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('userDisplayBtn').addEventListener('click', displayUserData);
  document.getElementById('userUpdateForm').addEventListener('submit', function(event) {
    event.preventDefault();
    updateUserData();
  });
});

// Function to update user data
function updateUserData() {
  const updateUsernameInput = document.getElementById('update-username');
  const newUsernameInput = document.getElementById('new-username');
  const updateEmailInput = document.getElementById('update-email');
  const updatePasswordInput = document.getElementById('update-password');

  const username = updateUsernameInput.value;
  const newUsername = newUsernameInput.value;
  const email = updateEmailInput.value;
  const password = updatePasswordInput.value;

  if (!username) {
    alert('Please enter a username to update.');
    return;
  }

  if (!email &&!password &&!newUsername) {
    alert('Please enter at least one field to update.');
    return;
  }

  usersRef.child(username).once('value', (snapshot) => {
    const userData = snapshot.val();
    if (userData) {
      const updates = {};

      if (newUsername) {
        usersRef.child(newUsername).set(userData);
        usersRef.child(username).remove();
        alert('Username updated successfully!');
      } else {
        if (email) {
          updates.email = email;
        }
        if (password) {
          updates.password = password;
        }
        usersRef.child(username).update(updates);
        alert('User data updated successfully!');
      }
    } else {
      alert('User not found.');
    }
  }).catch((error) => {
    console.error('Error updating user data:', error);
    alert('Error updating user data. Please try again.');
  });
}

// Call displayUserData function when the page is loaded
displayUserData();