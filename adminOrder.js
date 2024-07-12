
// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
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
  appId: "1:209664661907:web:933435dab65ebb20913066",
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

// ...

//...



// Read data from the database
onValue(dbRef, async (snapshot) => {
  const ordersTableBody = document.getElementById("orders-table-body");
  ordersTableBody.innerHTML = ""; // Clear existing rows

  if (snapshot.exists()) {
    const orders = snapshot.val();

    Object.keys(orders).forEach(async (orderId) => {
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
        const tableRow = document.createElement("tr");
        tableRow.innerHTML = `
          <td>${orderId}</td>
          <td>${order.username}</td>
          <td>${formattedDate}</td>
          <td>${formattedItemName}</td>
          <td>${quantity}</td>
          <td>
            <div class="image-containerOrder">
              <img src="${imageUrl}" alt="${formattedItemName}" class="img-fluid orderImage" />
            </div>
          </td>
          <td>
            <button class="btn btn-danger" id="delete-btn-${orderId}">Delete</button>
          </td>
        `;
        ordersTableBody.appendChild(tableRow);

        // Attach event listener to the delete button
        const deleteBtn = document.getElementById(`delete-btn-${orderId}`);
        deleteBtn.addEventListener("click", () => {
          deleteOrder(orderId);
        });
      }
    });
  }
});

// Function to delete order data
function deleteOrder(orderId) {
  dbRef.child(orderId).remove()
   .then(() => {
      alert(`Order ${orderId} deleted successfully!`);
    })
   .catch((error) => {
      console.error("Error deleting order:", error);
      alert("Error deleting order. Please try again.");
    });
}