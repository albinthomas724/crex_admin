import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
    import { getFirestore, collection, addDoc, deleteDoc, doc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

    // Your web app's Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyCDYlCSgksz5aGrRd57He-yfuo8zzcog_I",
      authDomain: "product-40143.firebaseapp.com",
      databaseURL: "https://product-40143-default-rtdb.firebaseio.com",
      projectId: "product-40143",
      storageBucket: "product-40143.appspot.com",
      messagingSenderId: "397255272673",
      appId: "1:397255272673:web:829df4d68ea98cc7eb2fa0",
      measurementId: "G-566VGYNG2K"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    document.addEventListener('DOMContentLoaded', function() {
      const fileInput = document.getElementById('fileInput');
      const uploadButton = document.getElementById('uploadButton');
      const uploadImageBtn = document.getElementById('uploadImageBtn');
      const onamImageContainer = document.getElementById('onamImageContainer');
      const imagesImageContainer = document.getElementById('imagesImageContainer');
      const collectionSelect = document.getElementById('collectionSelect');
      const fileNameInput = document.getElementById('fileNameInput');

      // Initialize the modal
      const uploadModal = $('#uploadModal').modal({ show: false });

      // Upload image and save to Firestore
      uploadImageBtn.addEventListener('click', async () => {
        const file = fileInput.files[0];
        const fileName = fileNameInput.value;
        const collectionName = collectionSelect.value;
        if (file) {
          const reader = new FileReader();
          reader.onload = async function(e) {
            const dataUrl = e.target.result;
            try {
              await saveImageToFirestore(dataUrl, fileName, collectionName);
              displayImagesFromFirestore(collectionName, collectionName === 'onam' ? onamImageContainer : imagesImageContainer);
              uploadModal.modal('hide'); // Hide the modal after successful upload
              fileInput.value = ''; // Reset the file input
              fileNameInput.value = ''; // Reset the file name input
            } catch (error) {
              console.error('Error saving image to Firestore:', error);
            }
          };
          reader.readAsDataURL(file);
        }
      });

      async function saveImageToFirestore(dataUrl, fileName, collectionName) {
        try {
          await addDoc(collection(db, collectionName), {
            name: fileName,
            dataUrl: dataUrl
          });
          console.log('Image saved to Firestore');
        } catch (error) {
          console.error('Error saving image to Firestore:', error);
          throw error;
        }
      }

      // Function to display images from Firestore
      async function displayImagesFromFirestore(collectionName, imageContainer) {
        imageContainer.innerHTML = '';
        try {
          const querySnapshot = await getDocs(collection(db, collectionName));
          querySnapshot.forEach((doc) => {
            const imageDiv = document.createElement('div');
            imageDiv.className = 'col-md-4';
            const fileName = doc.data().name;
            const fileNameWithoutExtension = fileName.replace(/\.[^\.]+$/, ''); // remove file extension
            imageDiv.innerHTML = `
              <img src="${doc.data().dataUrl}" alt="${fileNameWithoutExtension}" class="img-fluid small-image">
              <p>${fileNameWithoutExtension}</p> <!-- display file name without extension -->
              <button type="button" class="btn btn-danger" id="deleteButton-${doc.id}">Delete</button>
            `;
            imageContainer.appendChild(imageDiv);

            // Add event listener to delete button
            const deleteButton = document.getElementById(`deleteButton-${doc.id}`);
            deleteButton.addEventListener('click', async () => {
              try {
                await deleteImageFromFirestore(doc.id, collectionName);
                console.log('Image deleted from Firestore');
                displayImagesFromFirestore(collectionName, collectionName === 'onam' ? onamImageContainer : imagesImageContainer);
              } catch (error) {
                console.error('Error deleting image from Firestore:', error);
              }
            });
          });
        } catch (error) {
          console.error('Error getting images:', error);
        }
      }

      // Function to delete image from Firestore
      async function deleteImageFromFirestore(imageId, collectionName) {
        try {
          await deleteDoc(doc(db, collectionName, imageId)); // Correct usage of doc() here
          console.log('Image deleted from Firestore');
        } catch (error) {
          console.error('Error deleting image from Firestore:', error);
        }
      }

      // Function to download image
      function downloadImage(imageUrl, fileName) {
        const a = document.createElement('a');
        a.href = imageUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }

      displayImagesFromFirestore('onam', onamImageContainer);
      displayImagesFromFirestore('images', imagesImageContainer);
    });