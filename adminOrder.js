import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

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

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

// Function to fetch image URL from storage
async function getImageUrl(folder, imageFileName) {
  try {
    // Replace the underscore with a dot in the imageFileName
    const formattedFileName = imageFileName.replace("_", ".");

    const imageRef = storageRef(
      storage,
      `CartFolder/${folder}/${formattedFileName}`
    );
    const downloadURL = await getDownloadURL(imageRef);
    return downloadURL;
  } catch (error) {
    console.error(
      `Error fetching image '${imageFileName}' from /${folder} folder.`,
      error
    );
    return "";
  }
}

// Get a reference to the database
const dbRef = ref(database, "orders");

// Read data from the database
// onValue(dbRef, async (snapshot) => {
//   const tableBody = document.getElementById("order-table-body");
//   tableBody.innerHTML = ""; // Clear existing rows

//   if (snapshot.exists()) {
//     const orders = snapshot.val();

//     for (const orderId in orders) {
//       const order = orders[orderId];
//       const orderDate = new Date(order.orderDate);
//       const formattedDate = `${orderDate.toLocaleDateString()} ${orderDate.toLocaleTimeString()}`;

//       for (const item of order.orderItems) {
//         // Get the quantity for the item
//         const quantity = order.quantity[item.name];

//         // Replace underscores with dots in the item name
//         const formattedItemName = item.name.replace(/_/g, ".");

//         // Get the image URL
//         const imageUrl = await getImageUrl(
//           item.productType,
//           formattedItemName
//         );

    //     // Create a new table row
    //     const row = `
    //       <tr>
    //         <td>${orderId}</td>
    //         <td>${order.username}</td>
    //         <td>${formattedDate}</td>
    //         <td>${formattedItemName}</td>
    //         <td>${quantity}</td>
    //         <td><img src="${imageUrl}" alt="${formattedItemName}" /></td>
    //         <td>
    //           <button class="delete-btn" data-order-id="${orderId}">Delete</button>
    //         </td>
    //       </tr>
    //     `;
    //     tableBody.innerHTML += row;
    //   }
    // }

//     // Add event listener to delete buttons using for...of loop
//     const deleteBtns = document.querySelectorAll('.delete-btn');
//     for (const btn of deleteBtns) {
//       btn.addEventListener('click', async (e) => {
//         const orderId = e.target.dataset.orderId;
//         const orderRef = ref(database, `orders/${orderId}`);
//         try {
//           await remove(orderRef);
//           console.log(`Order ${orderId} deleted successfully`);
//         } catch (error) {
//           console.error(`Error deleting order ${orderId}:`, error);
//         }
//       });
//     }
//   }
// });








// Get the display orders button
const displayOrdersBtn = document.getElementById('display-orders-btn');
// Get the order table and heading
const orderTable = document.getElementById('order-table');
const orderHeading = document.getElementById('order-heading');

// Add event listener to display orders button
displayOrdersBtn.addEventListener('click', () => {
  // Show the order table and heading
  orderTable.style.display = 'block';
  orderHeading.style.display = 'block';

  // Get a reference to the database
  const dbRef = ref(database, "orders");

  // Read data from the database
  onValue(dbRef, async (snapshot) => {
    const tableBody = document.getElementById("order-table-body");
    tableBody.innerHTML = ""; // Clear existing rows

    if (snapshot.exists()) {
      const orders = snapshot.val();

      for (const orderId in orders) {
        const order = orders[orderId];
        const orderDate = new Date(order.orderDate);
        const formattedDate = `${orderDate.toLocaleDateString()} ${orderDate.toLocaleTimeString()}`;

        for (const item of order.orderItems) {
          // Get the quantity for the item
          const quantity = order.quantity[item.name];

          // Replace underscores with dots in the item name
          const formattedItemName = item.name.replace(/_/g, ".");

          // Get the image URL
          const imageUrl = await getImageUrl(
            item.productType,
            formattedItemName
          );

          // Create a new table row
          const row = `
            <tr>
              <td>${orderId}</td>
              <td>${order.username}</td>
              <td>${formattedDate}</td>
              <td>${formattedItemName}</td>
              <td>${quantity}</td>
              <td><img src="${imageUrl}" alt="${formattedItemName}" /></td>
              <td>
                <button class="delete-btn" data-order-id="${orderId}">Delete</button>
              </td>
            </tr>
          `;
          tableBody.innerHTML += row;
        }
      }

      // Add event listener to delete buttons using for...of loop
      const deleteBtns = document.querySelectorAll('.delete-btn');
      for (const btn of deleteBtns) {
        btn.addEventListener('click', async (e) => {
          const orderId = e.target.dataset.orderId;
          const orderRef = ref(database, `orders/${orderId}`);
          try {
            await remove(orderRef);
            console.log(`Order ${orderId} deleted successfully`);
          } catch (error) {
            console.error(`Error deleting order ${orderId}:`, error);
          }
        });
      }
    }
  });
});
