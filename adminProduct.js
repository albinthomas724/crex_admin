// Initialize Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyDczLLPnaREY3SahAMeKJ-DOMyVENmWwLk",
//   authDomain: "crex-f9f68.firebaseapp.com",
//   databaseURL: "https://crex-f9f68-default-rtdb.firebaseio.com",
//   projectId: "crex-f9f68",
//   storageBucket: "crex-f9f68.appspot.com",
//   messagingSenderId: "209664661907",
//   appId: "1:209664661907:web:933435dab65ebb20913066"
// };
firebase.initializeApp(firebaseConfig);

// Reference for the database
var formdb = firebase.database().ref('crex/product');

// Function to handle form submission
document.getElementById('form1').addEventListener('submit', function (e) {
  e.preventDefault();
  
  var productName = getElementByVal('product-name');
  var price = getElementByVal('price');
  
  saveProduct(productName, price);
});

// Function to save product to Firebase
function saveProduct(productName, price) {
  var newProduct = formdb.child(productName);
  newProduct.set({
      price: price
  });
}

// Function to get element value by ID
function getElementByVal(id) {
  return document.getElementById(id).value;
}

// Function to display data
function displayData() {
  formdb.on('value', (snapshot) => {
      const data = snapshot.val();
      const displayContainer = document.getElementById('display-container-product');
      displayContainer.innerHTML = '';
  
      Object.keys(data).forEach((key) => {
          const product = data[key];
          const displayText = `Product Name: ${key}<br>Price: ${product.price}<br><button id="${key}" onclick="deleteData(this.id)">Delete</button><br><br>`;
          displayContainer.innerHTML += displayText;
      });
  });
}

// Function to delete data from Firebase
function deleteData(productName) {
  formdb.child(productName).remove();
}

// Function to update price
function updatePrice() {
  var updateProductName = getElementByVal('update-product-name');
  var updatePrice = getElementByVal('update-price');
  
  formdb.child(updateProductName).update({
      price: updatePrice
  });
}

// Add event listener to display button
document.getElementById('display-data').addEventListener('click', displayData);

// Add event listener to update button
document.getElementById('update-data').addEventListener('click', updatePrice);