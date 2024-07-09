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
  
  // Reference to the users database
  const usersRef = firebase.database().ref('crex/users');
  
  // Function to display user data
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
            <button class="btn btn-danger" onclick="deleteUser('${username}')">Delete</button>
          </td>
        `;
        userTableBody.appendChild(tableRow);
      });
    });
  }
  
  // Function to delete user data
  function deleteUser(username) {
    usersRef.child(username).remove();
    alert(`User ${username} deleted successfully!`);
  }
  
  // Call displayUserData function when the page is loaded
  displayUserData();
  
  // Add event listener to display button
  document.getElementById('display-btn').addEventListener('click', displayUserData);
  
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
    
    if (username) {
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
      });
    } else {
      alert('Please enter a username to update.');
    }
  }
  
  // // Add event listener to display button
  // document.getElementById('display-btn').addEventListener('click', displayUserData);
  
  // Add event listener to update button
  document.getElementById('update-btn').addEventListener('click', updateUserData);