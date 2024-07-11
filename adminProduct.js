// adminProduct.js
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

// // adminProduct.js
// import { database } from './firebase-init.js';

// // Reference for the database
// var formdb = database.ref('crex/product');

// //... rest of your code
// import { database } from './firebase-init.js';

// if (database) {
//   var formdb = database().ref('crex/product');
//   //...
// } else {
//   console.error('Firebase is not initialized');
// }



// Reference for the database
var formdb = firebase.database().ref('crex/product');

// ... rest of your code

// Function to handle form submission
document.getElementById('productUpdateForm').addEventListener('submit', function (e) {
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

// Function to display product data
function displayProductData() {
  const productRef = firebase.database().ref('crex/product');
  productRef.on('value', (snapshot) => {
    const data = snapshot.val();
    const productTableBody = document.getElementById('product-table-body');
    productTableBody.innerHTML = '';
    Object.keys(data).forEach((key) => {
      const product = data[key];
      const tableRow = document.createElement('tr');
      tableRow.innerHTML = `
        <td>${key}</td>
        <td>${product.price}</td>
        <td>
          <button class="btn btn-danger" onclick="deleteProduct('${key}')">Delete</button>
        </td>
      `;
      productTableBody.appendChild(tableRow);
    });
  });
}

// Function to delete a product
function deleteProduct(productId) {
  const productRef = firebase.database().ref('crex/product');
  productRef.child(productId).remove();
}
// Add event listener to display product button
document.getElementById('displayProduct').addEventListener('click', displayProductData);
// // Add event listener to display product button
// document.getElementById('productDisplayBtn').addEventListener('click', displayProductData);

// Function to update product
function updateProduct() {
  const productName = document.getElementById('update-product-name').value;
  const price = document.getElementById('update-price').value;
  const productRef = firebase.database().ref('crex/product');
  productRef.child(productName).update({
    price: price
  });
}

// Add event listener to update product button
document.getElementById('updateProductSubmit').addEventListener('click', updateProduct);

// Add event listener to display button
document.getElementById('displayProduct').addEventListener('click', displayProductData);

// // Add event listener to update button
// document.getElementById('update-data').addEventListener('click', updatePrice);