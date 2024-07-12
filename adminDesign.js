import { uploadBytes, deleteObject } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDczLLPnaREY3SahAMeKJ-DOMyVENmWwLk",
  authDomain: "crex-f9f68.firebaseapp.com",
  databaseURL: "https://crex-f9f68-default-rtdb.firebaseio.com",
  projectId: "crex-f9f68",
  storageBucket: "crex-f9f68.appspot.com",
  messagingSenderId: "209664661907",
  appId: "1:209664661907:web:933435dab65ebb20913066"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const storage = getStorage(app);

// Get the file input element
const designBtn = document.querySelector('#designBtn');

// Add an event listener to the design button
designBtn.addEventListener('click', () => {
  // Remove existing images
  document.getElementById('designs-inner').innerHTML = '';
  document.getElementById('logos-inner').innerHTML = '';
  document.getElementById('text-inner').innerHTML = '';

  // List all files in the storage locations
  const designsRef = ref(storage, 'images/designs');
  const logosRef = ref(storage, 'images/logos');
  const textRef = ref(storage, 'images/text');

  Promise.all([
    listAll(designsRef),
    listAll(logosRef),
    listAll(textRef)
  ]).then((results) => {
    const designsItems = results[0].items;
    const logosItems = results[1].items;
    const textItems = results[2].items;

    // ...

//...

// Designs div
designsItems.forEach((item) => {
    getDownloadURL(item).then((url) => {
      const img = document.createElement('img');
      img.src = url;
      img.alt = item.name;
      img.className = 'img-fluid';
  
      const colDiv = document.createElement('div');
      colDiv.className = 'col-md-3 d-flex flex-column';
  
      const imgContainer = document.createElement('div');
      imgContainer.className = 'flex-grow-1';
      imgContainer.appendChild(img);
  
      const fileNameSpan = document.createElement('span');
      const fileName = item.name.replace(/\.[^.]+$/, ''); // Remove file extension
      fileNameSpan.textContent = fileName;
      fileNameSpan.className = 'text-muted';
  
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-danger mt-2';
      deleteBtn.textContent = 'Delete';
      deleteBtn.onclick = () => {
        deleteObject(item).then(() => {
          console.log(`Deleted file ${item.name}`);
          colDiv.remove();
        }).catch((error) => {
          console.error(`Error deleting file ${item.name}:`, error);
        });
      };
  
      colDiv.appendChild(imgContainer);
      colDiv.appendChild(fileNameSpan);
      colDiv.appendChild(deleteBtn);
  
      document.getElementById('designs-inner').appendChild(colDiv);
    });
  });
  
  // Logos div
  logosItems.forEach((item) => {
    getDownloadURL(item).then((url) => {
      const img = document.createElement('img');
      img.src = url;
      img.alt = item.name;
      img.className = 'img-fluid';
  
      const colDiv = document.createElement('div');
      colDiv.className = 'col-md-3 d-flex flex-column';
  
      const imgContainer = document.createElement('div');
      imgContainer.className = 'flex-grow-1';
      imgContainer.appendChild(img);
  
      const fileNameSpan = document.createElement('span');
      const fileName = item.name.replace(/\.[^.]+$/, ''); // Remove file extension
      fileNameSpan.textContent = fileName;
      fileNameSpan.className = 'text-muted';
  
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-danger mt-2';
      deleteBtn.textContent = 'Delete';
      deleteBtn.onclick = () => {
        deleteObject(item).then(() => {
          console.log(`Deleted file ${item.name}`);
          colDiv.remove();
        }).catch((error) => {
          console.error(`Error deleting file ${item.name}:`, error);
        });
      };
  
      colDiv.appendChild(imgContainer);
      colDiv.appendChild(fileNameSpan);
      colDiv.appendChild(deleteBtn);
  
      document.getElementById('logos-inner').appendChild(colDiv);
    });
  });
  
  // Text div
  textItems.forEach((item) => {
    getDownloadURL(item).then((url) => {
      const img = document.createElement('img');
      img.src = url;
      img.alt = item.name;
      img.className = 'img-fluid';
  
      const colDiv = document.createElement('div');
      colDiv.className = 'col-md-3 d-flex flex-column';
  
      const imgContainer = document.createElement('div');
      imgContainer.className = 'flex-grow-1';
      imgContainer.appendChild(img);
  
      const fileNameSpan = document.createElement('span');
      const fileName = item.name.replace(/\.[^.]+$/, ''); // Remove file extension
      fileNameSpan.textContent = fileName;
      fileNameSpan.className = 'text-muted';
  
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-danger mt-2';
      deleteBtn.textContent = 'Delete';
      deleteBtn.onclick = () => {
        deleteObject(item).then(() => {
          console.log(`Deleted file ${item.name}`);
          colDiv.remove();
        }).catch((error) => {
          console.error(`Error deleting file ${item.name}:`, error);
        });
      };
  
      colDiv.appendChild(imgContainer);
      colDiv.appendChild(fileNameSpan);
      colDiv.appendChild(deleteBtn);
  
      document.getElementById('text-inner').appendChild(colDiv);
    });
  });
  });
});



// upload image modal js code


// Get the modal elements
const createImageModal = document.getElementById('createImageModal');
const imageNameInput = document.getElementById('imageName');
const imageTypeSelect = document.getElementById('imageType');
const imageFileInput = document.getElementById('imageFile');
const uploadImageBtn = document.getElementById('uploadImageBtn');

// Add an event listener to the upload image button
uploadImageBtn.addEventListener('click', () => {
  // Get the selected file
  const file = imageFileInput.files[0];

  // Get the image type and name
  const imageType = imageTypeSelect.value;
  const imageName = imageNameInput.value;

  // Create a reference to the storage location
  const storageRef = ref(storage, `images/${imageType}/${imageName}`);

  // Upload the file
  uploadBytes(storageRef, file).then((snapshot) => {
    console.log(`Uploaded file ${imageName} to ${imageType} location`);
    // Close the modal after successful upload
    $('#createImageModal').modal('hide');
    // Optionally, clear form fields or perform any additional actions
    imageNameInput.value = '';
    imageFileInput.value = '';
  }).catch((error) => {
    console.error(`Error uploading file ${imageName}:`, error);
  });
});

// Additional event listener for modal close event
createImageModal.addEventListener('hidden.bs.modal', () => {
  // Reset form fields when modal is closed
  imageNameInput.value = '';
  imageFileInput.value = '';
});