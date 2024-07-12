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




// Check if the Firebase app has already been initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Get a reference to the Realtime Database
const db = firebase.database();

// Reference to the products database
const productsRef = db.ref('crex/product');

function displayProductData() {
  productsRef.on('value', (snapshot) => {
    const products = snapshot.val();
    const productTableBody = document.getElementById('product-table-body');
    productTableBody.innerHTML = '';

    if (products) {
      Object.keys(products).forEach((productName) => {
        const product = products[productName];
        if (product) {
          const tableRow = document.createElement('tr');
          tableRow.innerHTML = `
            <td>${productName}</td>
            <td>${product.price}</td>
            <td>
              <button class="btn btn-danger" id="delete-btn-${productName}">Delete</button>
            </td>
          `;
          productTableBody.appendChild(tableRow);

          // Attach event listener to the delete button
          const deleteBtn = document.getElementById(`delete-btn-${productName}`);
          deleteBtn.addEventListener('click', () => {
            deleteProduct(productName);
          });
        }
      });
    } else {
      console.log('No products found');
      alert('No products found');
    }
  }, (error) => {
    console.error('Error fetching product data:', error);
    alert('Error fetching product data. Please try again.');
  });
}

// Function to delete product data
function deleteProduct(productName) {
  if (productName) {
    productsRef.child(productName).remove()
   .then(() => {
      alert(`Product ${productName} deleted successfully!`);
    })
   .catch((error) => {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again.');
    });
  } else {
    console.log('Product name is required');
    alert('Product name is required');
  }
}

// Call displayProductData function when page is loaded
displayProductData();


// product create modal

const updateProductBtn = document.getElementById('updateProductBtn');

updateProductBtn.addEventListener('click', function() {
  const currentProductNameInput = document.getElementById('currentProductName');
  const newProductNameInput = document.getElementById('newProductName');
  const productPriceInput = document.getElementById('productPrice');

  const currentProductName = currentProductNameInput.value;
  const newProductName = newProductNameInput.value;
  const productPrice = productPriceInput.value;

  // Update product details in Firebase Realtime Database
  const oldProductRef = productsRef.child(currentProductName);
  let newProductRef; // Define newProductRef here

  oldProductRef.once('value', (snapshot) => {
    const productData = snapshot.val();
    const updateData = {};

    if (newProductName) {
      // Create a new directory with the new product name
      newProductRef = productsRef.child(newProductName); // Assign value to newProductRef
      updateData.name = newProductName;
    } else {
      updateData.name = currentProductName;
    }

    if (productPrice) {
      updateData.price = productPrice;
    } else {
      updateData.price = productData.price;
    }

    if (Object.keys(updateData).length > 0) {
      if (newProductName) {
        // Move the data to the new directory
        newProductRef.set(updateData)
        .then(() => {
          alert(`Product updated successfully!`);
        })
        .catch((error) => {
          console.error('Error updating product:', error);
          alert('Error updating product. Please try again.');
        });

        // Remove the old directory
        oldProductRef.remove()
        .then(() => {
          console.log(`Old product directory removed`);
        })
        .catch((error) => {
          console.error('Error removing old product directory:', error);
        });
      } else {
        // Update the data in the existing directory
        oldProductRef.update(updateData)
        .then(() => {
          alert(`Product updated successfully!`);
        })
        .catch((error) => {
          console.error('Error updating product:', error);
          alert('Error updating product. Please try again.');
        });
      }
    } else {
      alert('No changes made');
    }
  });
});


// create new product


// const createProductModal = document.getElementById('createProductModal');
// const createProductBtnInModal = document.getElementById('createProductBtnInModal');

// createProductBtnInModal.addEventListener('click', function() {
//   const productNameInput = document.getElementById('productName');
//   const productPriceInput = document.getElementById('productPrice');

//   const productName = productNameInput.value;
//   const productPrice = productPriceInput.value;

//   // Create a new product in Firebase Realtime Database
//   const newProductRef = productsRef.child(productName);

//   const newProductData = {
//     name: productName,
//     price: productPrice
//   };

//   newProductRef.set(newProductData)
//   .then(() => {
//     alert(`Product created successfully!`);
//     // Close the modal
//     $(createProductModal).modal('hide');
//   })
//   .catch((error) => {
//     console.error('Error creating product:', error);
//     alert('Error creating product. Please try again.');
//   });
// });


// ...

// Get the create product button
const createProductBtn = document.getElementById('createProductModalBtn');

// Add an event listener to the create product button
createProductBtn.addEventListener('click', function() {
  // Get the product name and price input fields
  const productNameInput = document.getElementById('productName');
  const productPriceInput = document.getElementById('newProductPrice');

  // Get the values of the input fields
  const productName = productNameInput.value;
  const productPrice = productPriceInput.value;

  if (!productPrice || productPrice.trim() === "") {
    alert("Please enter a valid product price.");
    return;
  }

  if (isNaN(productPrice) || productPrice <= 0) {
    alert('Invalid product price. Please enter a valid number greater than 0.');
    return;
  }

  // Create a new product in Firebase Realtime Database
  const newProductRef = productsRef.child(productName);

  const newProductData = {
    price: productPrice
  };

  newProductRef.set(newProductData)
  .then(() => {
    alert(`Product created successfully!`);
    // Close the modal
    $(`#createProductModal`).modal('hide');
  })
  .catch((error) => {
    console.error('Error creating product:', error);
    alert('Error creating product. Please try again.');
  });
});






