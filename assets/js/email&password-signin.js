// Email and Password Sign-In or Sign-Up Prompt
function emailPasswordSignIn() {
  Swal.fire({
    title: "Sign in with Email & Password",
    html: `
      <input type="email" id="email" class="swal2-input" placeholder="Enter your email">
      <input type="password" id="password" class="swal2-input" placeholder="Enter your password">
      <p style="margin-top: 10px;">Don't have an account? <a href="#" id="signup-link">Sign up here</a></p>
    `,
    showCancelButton: true,
    confirmButtonText: "Sign In",
    didOpen: () => {
      document.getElementById("signup-link").addEventListener("click", () => {
        Swal.close(); // Close the sign-in prompt and open the sign-up prompt
        emailPasswordSignUp();
      });
    },
    preConfirm: () => {
      const email = Swal.getPopup().querySelector("#email").value;
      const password = Swal.getPopup().querySelector("#password").value;

      if (!email || !password) {
        Swal.showValidationMessage("Please enter both email and password");
        return false;
      }
      return { email, password };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const { email, password } = result.value;
      auth
        .signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          Swal.fire({
            icon: "success",
            title: "Signed In Successfully",
            text: `Welcome, ${userCredential.user.email}`,
          });

          // Hide the email sign-in button on success
          document.getElementById("email-signin-btn").style.display = "none";
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Sign In Failed",
            text: error.message,
          });
        });
    }
  });
}

// Sign-Up Prompt
// v1
// function emailPasswordSignUp() {
//   Swal.fire({
//     title: "Create a New Account",
//     html: `
//       <input type="email" id="new-email" class="swal2-input" placeholder="Enter your email">
//       <input type="password" id="new-password" class="swal2-input" placeholder="Enter your password">
//       <input type="text" id="phone" class="swal2-input" placeholder="Enter your phone number (optional)">
//       <input type="text" id="profile-pic" class="swal2-input" placeholder="Enter your profile picture URL (optional)">
//     `,
//     showCancelButton: true,
//     confirmButtonText: "Sign Up",
//     preConfirm: () => {
//       const email = Swal.getPopup().querySelector("#new-email").value;
//       const password = Swal.getPopup().querySelector("#new-password").value;
//       const phone = Swal.getPopup().querySelector("#phone").value;
//       const profilePic = Swal.getPopup().querySelector("#profile-pic").value;

//       if (!email || !password) {
//         Swal.showValidationMessage("Please enter both email and password");
//         return false;
//       }
//       return { email, password, phone, profilePic };
//     },
//   }).then((result) => {
//     if (result.isConfirmed) {
//       const { email, password, phone, profilePic } = result.value;
//       auth
//         .createUserWithEmailAndPassword(email, password)
//         .then((userCredential) => {
//           // Set additional user information
//           return userCredential.user
//             .updateProfile({
//               displayName: "Customer",
//               photoURL: profilePic || undefined,
//             })
//             .then(() => {
//               // Save additional info (e.g., phone) in database if needed
//               const uid = userCredential.user.uid;
//               const userData = {
//                 email,
//                 displayName: "Customer",
//                 phone: phone || null,
//                 photoURL: profilePic || null,
//               };
//               // return firebase.database().ref(`users/${uid}`).set(userData);
//             });
//         })
//         .then(() => {
//           Swal.fire({
//             icon: "success",
//             title: "Account Created Successfully",
//             text: "Welcome! You can now signed in",
//           });
//         })
//         .catch((error) => {
//           Swal.fire({
//             icon: "error",
//             title: "Sign Up Failed",
//             text: error.message,
//           });
//         });
//     }
//   });
// }

// v2
// function emailPasswordSignUp() {
//   Swal.fire({
//     title: "Create a New Account",
//     html: `
//       <input type="email" id="new-email" class="swal2-input" placeholder="Enter your email">
//       <input type="text" id="username" class="swal2-input" placeholder="Enter your name">
//       <input type="password" id="new-password" class="swal2-input" placeholder="Enter your password">
//       <input type="text" id="phone" class="swal2-input" placeholder="Enter your phone number (optional)">
//       <input type="text" id="profile-pic" class="swal2-input" placeholder="Enter your profile picture URL (optional)">
//     `,
//     showCancelButton: true,
//     confirmButtonText: "Sign Up",
//     preConfirm: () => {
//       const email = Swal.getPopup().querySelector("#new-email").value;
//       const username = Swal.getPopup().querySelector("#username").value;
//       const password = Swal.getPopup().querySelector("#new-password").value;
//       const phone = Swal.getPopup().querySelector("#phone").value;
//       const profilePic = Swal.getPopup().querySelector("#profile-pic").value;

//       if (!email || !password || !username) {
//         Swal.showValidationMessage("Please fill in all required fields");
//         return false;
//       }
//       return { email, password, username, phone, profilePic };
//     },
//   }).then((result) => {
//     if (result.isConfirmed) {
//       const { email, password, username, phone, profilePic } = result.value;

//       auth
//         .createUserWithEmailAndPassword(email, password)
//         .then((userCredential) => {
//           const user = userCredential.user;

//           // Set the display name to "Customer"
//           return user
//             .updateProfile({
//               displayName: "Customer", // Auth display name
//               photoURL: profilePic || null,
//             })
//             .then(() => user.getIdToken()) // Get ID token for secure database write
//             .then((idToken) => ({ user, idToken }));
//         })
//         .then(({ user, idToken }) => {
//           const userData = {
//             personalInfo: {
//               email: user.email,
//               username: username, // User-provided name stored in the database
//               displayName: "Customer", // Display name explicitly added to the database
//               phone: phone || null,
//               photoURL: profilePic || null,
//             },
//             orders: [],
//             favorites: [],
//           };

//           const uid = user.uid;

//           // Store user data in the Realtime Database
//           return fetch(
//             `https://matager-f1f00-default-rtdb.firebaseio.com/users/${uid}.json?auth=${idToken}`,
//             {
//               method: "PUT", // Ensure data is saved under the user's UID
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify(userData),
//             }
//           );
//         })
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error("Failed to store user data in the database");
//           }
//           return Swal.fire({
//             icon: "success",
//             title: "Account Created Successfully",
//             text: "Welcome! You are now signed in as Customer.",
//           });
//         })
//         .catch((error) => {
//           Swal.fire({
//             icon: "error",
//             title: "Sign Up Failed",
//             text: error.message,
//           });
//         });
//     }
//   });
// }

//v3
function emailPasswordSignUp() {
  Swal.fire({
    title: "Create a New Account",
    html: `
      <input type="email" id="new-email" class="swal2-input" placeholder="Enter your email">
      <input type="text" id="username" class="swal2-input" placeholder="Enter your name">
      <input type="password" id="new-password" class="swal2-input" placeholder="Enter your password">
      <input type="text" id="phone" class="swal2-input" placeholder="Enter your phone number (optional)">
      <input type="text" id="profile-pic" class="swal2-input" placeholder="Enter your profile picture URL (optional)">
    `,
    showCancelButton: true,
    confirmButtonText: "Sign Up",
    preConfirm: () => {
      const email = Swal.getPopup().querySelector("#new-email").value;
      const username = Swal.getPopup().querySelector("#username").value;
      const password = Swal.getPopup().querySelector("#new-password").value;
      const phone = Swal.getPopup().querySelector("#phone").value;
      const profilePic = Swal.getPopup().querySelector("#profile-pic").value;

      if (!email || !password || !username) {
        Swal.showValidationMessage("Please fill in all required fields");
        return false;
      }
      return { email, password, username, phone, profilePic };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const { email, password, username, phone, profilePic } = result.value;

      auth
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const user = userCredential.user;

          // Set the display name to "Customer" in Firebase Authentication
          return user
            .updateProfile({
              displayName: "Customer",
              photoURL: profilePic || null,
            })
            .then(() => user.reload()) // Force refresh the user's data
            .then(() => user.getIdToken()) // Get the updated ID token
            .then((idToken) => ({ user, idToken }));
        })
        .then(({ user, idToken }) => {
          const userData = {
            personalInfo: {
              email: user.email,
              username: username, // User-provided name stored in the database
              displayName: "Customer", // Ensure display name matches
              phone: phone || null,
              photoURL: profilePic || null,
            },
            orders: [],
            favorites: [],
          };

          const uid = user.uid;

          // Store user data in the Realtime Database
          return fetch(
            `https://matager-f1f00-default-rtdb.firebaseio.com/users/${uid}.json?auth=${idToken}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userData),
            }
          );
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to store user data in the database");
          }
          return Swal.fire({
            icon: "success",
            title: "Account Created Successfully",
            text: "Welcome! You are now signed in.",
          });
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Sign Up Failed",
            text: error.message,
          });
        });
    }
  });
}
