// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDss53pHibCpqo87_1bhoUHkf8Idnj-Fig",
  authDomain: "matager-f1f00.firebaseapp.com",
  projectId: "matager-f1f00",
  storageBucket: "matager-f1f00.appspot.com",
  messagingSenderId: "922824110897",
  appId: "1:922824110897:web:b7978665d22e2d652e7610",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Google Provider
const provider = new firebase.auth.GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
provider.setCustomParameters({
  login_hint: "user@example.com",
});

// v2
document.getElementById("google-signin-btn").addEventListener("click", () => {
  auth
    .signInWithPopup(provider)
    .then(async (result) => {
      const user = result.user;
      console.log("User signed in:", user);

      // Get the ID token for authentication
      const idToken = await user.getIdToken();

      // Create or update the user's record in the Realtime Database
      const userData = {
        personalInfo: {
          email: user.email,
          displayName: user.displayName || "Google User",
          phone: user.phoneNumber || null,
          photoURL: user.photoURL || "https://i.imgur.com/Zaneuop.png",
        },
        orders: [],
        favorites: [],
      };

      const uid = user.uid;
      const databaseUrl = `https://matager-f1f00-default-rtdb.firebaseio.com/users/${uid}.json?auth=${idToken}`;

      // Check if the user already exists in the database
      fetch(databaseUrl)
        .then((response) => response.json())
        .then((existingData) => {
          if (!existingData) {
            // User doesn't exist, create a new record
            return fetch(databaseUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userData),
            });
          }
          console.log("User already exists in the database.");
        })
        .then(() => {
          Swal.fire("Logged in!", "You are now signed in.", "success");
          updateUI(user); // Update UI with user info
        })
        .catch((error) => {
          console.error("Error during database operation:", error);
          Swal.fire("Error", error.message, "error");
        });
    })
    .catch((error) => {
      console.error("Error during sign-in:", error);
      Swal.fire("Error", error.message, "error");
    });
});

// Sign out
document.getElementById("signout-btn").addEventListener("click", () => {
  auth.signOut().then(() => {
    console.log("User signed out");
    Swal.fire("Logged out!", "You have been signed out.", "success");
    updateUI(null); // Hide signout button and user info
  });
});

auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("User is signed in:", user);
    updateUI(user); // Update UI with user data
    // Hide the "Sign in" button if user is already authenticated
    document.getElementById("google-signin-btn").style.display = "none";
    document.getElementById("email-signin-btn").style.display = "none";
    document.getElementById("signout-btn").style.display = "block";
  } else {
    console.log("No user is signed in.");
    updateUI(null); // Hide user info
    document.getElementById("google-signin-btn").style.display = "block";
    document.getElementById("email-signin-btn").style.display = "block";
    document.getElementById("signout-btn").style.display = "none";
  }
});
async function updateUI(user) {
  // Show the preloader initially
  document.getElementById("preloader").style.display = "flex";

  if (user) {
    const uid = user.uid; // Get the authenticated user's UID
    const token = await user.getIdToken();
    const baseUrl = `https://matager-f1f00-default-rtdb.firebaseio.com/users/${uid}`;

    // Fetch both personalInfo, address, and orderHistory
    Promise.all([
      fetch(`${baseUrl}/personalInfo.json`).then((response) => {
        if (!response.ok) throw new Error("Failed to fetch personalInfo.");
        return response.json();
      }),
      fetch(`${baseUrl}/address.json`).then((response) => {
        if (!response.ok) throw new Error("Failed to fetch address.");
        return response.json();
      }),
      fetch(`${baseUrl}/orderHistory.json`).then((response) => {
        if (!response.ok) throw new Error("Failed to fetch order history.");
        return response.json();
      }),
    ])
      .then(([personalInfoData, addressData, orderHistoryData]) => {
        const personalInfo = Object.values(personalInfoData || {})[0] || {};
        const allAddresses = addressData || {};
        const orderHistory = orderHistoryData || {};

        const email = user.email || "No Email";
        const username =
          `${personalInfo.firstName || ""} ${
            personalInfo.lastName || ""
          }`.trim() || "No Username";
        const photoURL =
          personalInfo.photoURL || "https://i.imgur.com/Zaneuop.png";
        const role = personalInfo.role || "Customer";
        const firstName = personalInfo.firstName || "";
        const lastName = personalInfo.lastName || "";
        const phone = personalInfo.phone || "No Phone Number";
        const phone2 = personalInfo.phone2 || "No Phone Number";

        // Hide the preloader once data is fetched
        document.getElementById("preloader").style.display = "none";

        document.getElementById("google-signin-btn").style.display = "none";
        document.getElementById("signout-btn").style.display = "block";
        document.getElementById("user-info").style.display = "block";

        // Populate user information in UI
        document.getElementById("user-name").innerText = username;
        document.getElementById(
          "user-email"
        ).innerHTML = `<i class="bi bi-envelope-fill mr-5"></i> ${email}`;
        document.getElementById("email-address").innerText = email;
        document.getElementById("first-name").innerText = firstName;
        document.getElementById("last-name").innerText = lastName;
        document.getElementById("role").innerText = role;
        document.getElementById("phone-number").innerText = phone;
        document.getElementById("phone-number2").innerText = phone2;
        document.getElementById("user-photo").src = photoURL;

        // Add the edit user personal info logic with updated UID
        const saveChangesButton = document.getElementById(
          "savepersonalinfochanges"
        );
        saveChangesButton.setAttribute(
          "onclick",
          `savepersonalinfochanges('${uid}')`
        );

        const addressesContainer = document.querySelector(
          ".addresses-container"
        );
        addressesContainer.innerHTML = ""; // Clear previous addresses

        if (!allAddresses || Object.keys(allAddresses).length === 0) {
          const noAddressDiv = `
            <div id="no-address-container" class="no-address-container">
              <p>No address yet. Try adding one!</p>
            </div>
          `;
          addressesContainer.insertAdjacentHTML("beforeend", noAddressDiv);
        } else {
          Object.entries(allAddresses).forEach(([id, address]) => {
            const addressHTML = `
              <div class="account-section">
                <div class="flex justify-content-flex-end mb-10">
                  <div class="flex align-items">
                    <button class="edit-button mr-5 mb-10" onclick="delAddress('${id}')">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
                <div class="details-row">
                  <div class="detail-group">
                    <h6>Governorate</h6>
                    <p>${address.governorate || "No Governorate"}</p>
                  </div>
                  <div class="detail-group">
                    <h6>City/State</h6>
                    <p>${address.city || "No City"}</p>
                  </div>
                </div>
                <div class="details-row">
                  <div class="detail-group">
                    <h6>Area</h6>
                    <p>${address.area || "No Area"}</p>
                  </div>
                  <div class="detail-group">
                    <h6>House-Number</h6>
                    <p>${address.houseNumber || "No House Number"}</p>
                  </div>
                </div>
                <div class="details-row">
                  <div class="detail-group">
                    <h6>Address</h6>
                    <p>${address.fullAddress || "No Full Address"}</p>
                  </div>
                </div>
              </div>
            `;
            addressesContainer.insertAdjacentHTML("beforeend", addressHTML);
          });
        }

        const renderOrderHistory = () => {
          const orderHistoryGrid = document.querySelector(
            ".order-history-grid"
          );
          orderHistoryGrid.innerHTML = ""; // Clear previous content

          if (!orderHistory || Object.keys(orderHistory).length === 0) {
            // Append a message if no orders are found
            const noOrdersMessage = `
      <div class="no-orders-container">
        <p>No orders yet. Start shopping to see your orders here!</p>
      </div>
    `;
            orderHistoryGrid.insertAdjacentHTML("beforeend", noOrdersMessage);
            return; // Exit the function
          }

          if (orderHistory) {
            const orderEntries = Object.entries(orderHistory).reverse(); // Reverse the order

            orderEntries.forEach(([key, orderData]) => {
              // Start building the order card
              let orderCardHTML = `
        <div class="order-card">
          <div class="order-header">
            <h5 class="flex"><p>${key}</p></h5>
            <div class="flex align-items flex-direction-column gap-10">
            <span class="status ${orderData.progress.toLowerCase()}">${
                orderData.progress
              }</span>
              <span class="payment-card">${orderData.payment}</span>
            </div>
            
          </div>
          <div class="order-details">
      `;

              // Loop through all items in the `order` array
              orderData.order.forEach((item) => {
                orderCardHTML += `
          <div class="order-item">
            <div class="img-container">
              <img src="${item.photo}" alt="${item.title}">
              <div class="qty-circle">${item.qty || 0}</div>
            </div>
            <span>${item.title || "Unknown"}</span>
            <span>${
              (parseFloat(item.price) * parseInt(item.qty || 0)).toFixed(2) ||
              "Unknown"
            }</span>
            
          </div>
        `;
              });

              // Close the order-details and add actions
              orderCardHTML += `
          </div>
          <div class="order-actions">
            <button onclick="printinvoice('${key}', '${uid}', '${token}')" class="btn-view">Print Invoice</button>
          </div>
        </div>
      `;

              // Append the order card to the grid
              orderHistoryGrid.insertAdjacentHTML("beforeend", orderCardHTML);
            });
          }
        };

        renderOrderHistory();
      })
      .catch((error) => {
        console.error(error);

        document.getElementById("preloader").style.display = "none";

        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Could not fetch additional user information.",
        });
      });
  } else {
    document.getElementById("preloader").style.display = "none";
    document.getElementById("google-signin-btn").style.display = "block";
    document.getElementById("signout-btn").style.display = "none";
    document.getElementById("user-info").style.display = "none";
  }
}

//printing ivoice
async function printinvoice(orderId, userId, userToken) {
  try {
    // Construct the API URL with userId and userToken
    const url = `https://matager-f1f00-default-rtdb.firebaseio.com/users/${userId}/orderHistory/${orderId}.json?auth=${userToken}`;

    // Fetch order details from the API
    const response = await fetch(url);
    const orderData = await response.json();

    if (!orderData || !orderData.order) {
      console.error("Order not found or invalid data.");
      return;
    }

    // Extract the items from the order
    const items = orderData.order;

    // Initialize jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add Order ID and Progress
    doc.setFontSize(16);
    doc.text(`Order ID: ${orderId}`, 10, 10);
    doc.text(
      `Progress: ${orderData.progress}, Payment: ${orderData.payment}`,
      10,
      20
    );

    // Add Items Section
    doc.setFontSize(14);
    doc.text("Items:", 10, 30);

    // Configure item layout
    let yPosition = 50;
    const pageWidth = doc.internal.pageSize.getWidth();
    const imageWidth = 40;
    const imageHeight = 40;
    const padding = 10;

    for (const item of items) {
      // Fetch item image as Base64
      const imgBase64 = await fetchImageAsBase64(item.photo);

      // Add image
      if (imgBase64) {
        doc.addImage(imgBase64, "JPEG", 10, yPosition, imageWidth, imageHeight);
      }

      const finalprice = parseFloat(item.price) * parseInt(item.qty, 10);

      // Align text with the image
      const xTextStart = 10 + imageWidth + padding; // Text starts after image + padding
      const lineHeight = 8;
      const details = [
        `Title: ${item.title}`,
        `Brand: ${item.brand}`,
        `Size: ${item.size}`,
        `Color: ${item.color}`,
        `Qty: ${item.qty}`,
        `Price: ${finalprice}`,
      ];

      // Add text, line by line, next to the image
      details.forEach((line, index) => {
        doc.text(line, xTextStart, yPosition + index * lineHeight + 5);
      });

      // Move yPosition for the next item
      yPosition += Math.max(imageHeight, details.length * lineHeight) + padding;

      // Add a new page if content exceeds current page height
      if (yPosition > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        yPosition = 20; // Reset yPosition for new page
      }
    }

    // Save the generated PDF
    doc.save(`Order_${orderId}.pdf`);
  } catch (error) {
    console.error("Error printing order:", error);
  }
}
async function fetchImageAsBase64(url) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
}

//printing ivoice//
