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

//test 2 woooow
// function updateUI(user) {
//   // Show the preloader initially
//   document.getElementById("preloader").style.display = "flex";

//   if (user) {
//     const uid = user.uid; // Get the authenticated user's UID
//     const baseUrl = `https://matager-f1f00-default-rtdb.firebaseio.com/users/${uid}`;

//     // Fetch both personalInfo and address1
//     Promise.all([
//       fetch(`${baseUrl}/personalInfo.json`).then((response) => {
//         if (!response.ok) throw new Error("Failed to fetch personalInfo.");
//         return response.json();
//       }),
//       fetch(`${baseUrl}/address.json`).then((response) => {
//         if (!response.ok) throw new Error("Failed to fetch address.");
//         return response.json();
//       }),
//     ])
//       .then(([personalInfoData, addressData]) => {
//         const personalInfo = Object.values(personalInfoData || {})[0] || {};
//         const allAddresses = addressData || {};

//         const email = user.email || "No Email";
//         const username =
//           `${personalInfo.firstName || ""} ${
//             personalInfo.lastName || ""
//           }`.trim() || "No Username";
//         const photoURL =
//           personalInfo.photoURL || "https://i.imgur.com/Zaneuop.png";
//         const role = personalInfo.role || "Customer";
//         const firstName = personalInfo.firstName || "";
//         const lastName = personalInfo.lastName || "";
//         const phone = personalInfo.phone || "No Phone Number";
//         const phone2 = personalInfo.phone2 || "No Phone Number";

//         // Hide the preloader once data is fetched
//         document.getElementById("preloader").style.display = "none";

//         document.getElementById("google-signin-btn").style.display = "none";
//         document.getElementById("signout-btn").style.display = "block";
//         document.getElementById("user-info").style.display = "block";

//         // Populate user information in UI
//         document.getElementById("user-name").innerText = username;
//         document.getElementById(
//           "user-email"
//         ).innerHTML = `<i class="bi bi-envelope-fill mr-5"></i> ${email}`;
//         document.getElementById("email-address").innerText = email;
//         document.getElementById("first-name").innerText = firstName;
//         document.getElementById("last-name").innerText = lastName;
//         document.getElementById("role").innerText = role;
//         document.getElementById("phone-number").innerText = phone;
//         document.getElementById("phone-number2").innerText = phone2;
//         document.getElementById("user-photo").src = photoURL;

//         // Add the edit user personal info logic with updated UID
//         const saveChangesButton = document.getElementById(
//           "savepersonalinfochanges"
//         );
//         saveChangesButton.setAttribute(
//           "onclick",
//           `savepersonalinfochanges('${uid}')`
//         );

//         const addressesContainer = document.querySelector(
//           ".addresses-container"
//         );
//         addressesContainer.innerHTML = ""; // Clear previous addresses

//         if (!allAddresses || Object.keys(allAddresses).length === 0) {
//           // No addresses found
//           const noAddressDiv = `
//             <div id="no-address-container" class="no-address-container">
//               <p>No address yet. Try adding one!</p>
//             </div>
//           `;
//           addressesContainer.insertAdjacentHTML("beforeend", noAddressDiv);
//         } else {
//           // Populate user addresses
//           Object.entries(allAddresses).forEach(([id, address]) => {
//             const addressHTML = `
//               <div class="account-section">
//                 <div class="flex justify-content-flex-end mb-10">
//                   <div class="flex align-items">
//                     <button class="edit-button mr-5 mb-10" onclick="delAddress('${id}')">
//                       <i class="bi bi-trash"></i>
//                     </button>
//                   </div>
//                 </div>
//                 <div class="details-row">
//                   <div class="detail-group">
//                     <h6>Governorate</h6>
//                     <p>${address.governorate || "No Governorate"}</p>
//                   </div>
//                   <div class="detail-group">
//                     <h6>City/State</h6>
//                     <p>${address.city || "No City"}</p>
//                   </div>
//                 </div>
//                 <div class="details-row">
//                   <div class="detail-group">
//                     <h6>Area</h6>
//                     <p>${address.area || "No Area"}</p>
//                   </div>
//                   <div class="detail-group">
//                     <h6>House-Number</h6>
//                     <p>${address.houseNumber || "No House Number"}</p>
//                   </div>
//                 </div>
//                 <div class="details-row">
//                   <div class="detail-group">
//                     <h6>Address</h6>
//                     <p>${address.fullAddress || "No Full Address"}</p>
//                   </div>
//                 </div>
//               </div>
//             `;
//             // Append the address section
//             addressesContainer.insertAdjacentHTML("beforeend", addressHTML);
//           });
//         }
//       })
//       .catch((error) => {
//         console.error(error);

//         // Hide the preloader even if there's an error
//         document.getElementById("preloader").style.display = "none";

//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text: "Could not fetch additional user information.",
//         });
//       });
//   } else {
//     // If no user is signed in, reset the UI
//     document.getElementById("preloader").style.display = "none";
//     document.getElementById("google-signin-btn").style.display = "block";
//     document.getElementById("signout-btn").style.display = "none";
//     document.getElementById("user-info").style.display = "none";
//   }
// }

//v2
async function updateUI(user) {
  // Show the preloader initially
  document.getElementById("preloader").style.display = "flex";

  if (user) {
    const uid = user.uid; // Get the authenticated user's UID
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

        // Render order history
        // const renderOrderHistory = () => {
        //   const orderHistoryGrid = document.querySelector(
        //     ".order-history-grid"
        //   );
        //   orderHistoryGrid.innerHTML = ""; // Clear previous content
        //   if (orderHistory) {
        //     Object.entries(orderHistory).forEach(([key, orderData]) => {
        //       const orderCardHTML = `
        //         <div class="order-card">
        //           <div class="order-header">
        //             <h5 class="flex ">Order:<p>${key}</p></h5>
        //             <span class="status ${orderData.progress.toLowerCase()}">${
        //         orderData.progress
        //       }</span>
        //           </div>
        //           <div class="order-details">
        //           <img style="width: 100px;padding-bottom: 10px" src="${
        //             orderData.order[0]?.photo || "Unknown"
        //           }"></img>
        //             <span>${
        //               orderData.order[0]?.title || "Unknown"
        //             }</span>
        //             <span>${
        //               orderData.order[0]?.price || "Unknown"
        //             }</span>
        //             <span>Qty: ${orderData.order[0]?.qty || 0}</span>
        //           </div>
        //           <div class="order-actions">
        //             <button class="btn-view">View</button>
        //             <button class="btn-cancel">Cancel</button>
        //           </div>
        //         </div>
        //       `;
        //       orderHistoryGrid.insertAdjacentHTML("beforeend", orderCardHTML);
        //     });
        //   }
        // };

        // renderOrderHistory();
        const renderOrderHistory = () => {
          const orderHistoryGrid = document.querySelector(
            ".order-history-grid"
          );
          orderHistoryGrid.innerHTML = ""; // Clear previous content

          if (orderHistory) {
            Object.entries(orderHistory).forEach(([key, orderData]) => {
              // Start building the order card
              let orderCardHTML = `
        <div class="order-card">
          <div class="order-header">
            <h5 class="flex">Order:<p>${key}</p></h5>
            <span class="status ${orderData.progress.toLowerCase()}">${
                orderData.progress
              }</span>
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
            <span>${item.price || "Unknown"}</span>
            
          </div>
        `;
              });

              // Close the order-details and add actions
              orderCardHTML += `
          </div>
          <div class="order-actions">
            <button class="btn-view">View</button>
            <button class="btn-cancel">Cancel</button>
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
