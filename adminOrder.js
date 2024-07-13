// Import Firebase
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
  appId: "1:209664661907:web:933435dab65ebb20913066",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);
const dbRef = ref(database, "orders");
console.log(dbRef);

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

        const tableRow = document.createElement("tr");
        tableRow.innerHTML = `
          <td class="col-md-1">${orderId}</td>
          <td class="col-md-2">${order.username}</td>
          <td class="col-md-2">${formattedDate}</td>
          <td class="col-md-2">${formattedItemName}</td>
          <td class="col-md-1">${quantity}</td>
          <td class="col-md-2">
            <div class="image-containerOrder">
              <img src="${imageUrl}" alt="${formattedItemName}" class="img-fluid orderImage" />
            </div>
          </td>
          <td class="col-md-1">
            <button class="btn btn-danger" id="delete-btn-${orderId}">Delete</button>
          </td>
        `;
        
        // Attach event listener to the delete button
        const deleteBtn = tableRow.querySelector(`#delete-btn-${orderId}`);
        deleteBtn.addEventListener("click", () => {
          deleteOrder(orderId);
        });
        
        ordersTableBody.appendChild(tableRow);
      }
    });
  }
});

function deleteOrder(orderId) {
  const orderRef = ref(database, `orders/${orderId}`);
  remove(orderRef)
 .then(() => {
      console.log(`Order ${orderId} deleted successfully!`);
    })
 .catch((error) => {
      console.error("Error deleting order:", error);
    });
}