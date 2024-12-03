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

async function googleSignIn() {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    const result = await firebase.auth().signInWithPopup(provider);
    Swal.fire({
      icon: "success",
      title: "Signed in successfully!",
      showConfirmButton: false,
      timer: 1500, // Close the alert after 1.5 seconds
    });
    return result.user;
  } catch (error) {
    console.error("Error signing in:", error);
    Swal.fire({
      icon: "error",
      title: "Sign In Failed",
      text: "There was a problem signing you in. Please try again!",
      showConfirmButton: false,
      timer: 1500, // Close the alert after 1.5 seconds
    });
    return null;
  }
}

async function submitOrder() {
  // Show the preloader
  document.getElementById("preloader").classList.remove("hidden");

  try {
    // Ensure the user is signed in and fetch their token
    const user = firebase.auth().currentUser;
    if (!user) {
      document.getElementById("preloader").classList.add("hidden");
      Swal.fire({
        icon: "warning",
        title: "Sign In Required",
        text: "You must sign in to complete your order.",
        showCancelButton: true,
        confirmButtonText: "Go to Account",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "./account.html"; // Redirect to the account page
        }
      });
      return;
    }

    const idToken = await user.getIdToken();

    // Get the cart from local storage
    let cart = JSON.parse(localStorage.getItem("cart"));
    if (!cart || cart.length === 0) {
      document.getElementById("preloader").classList.add("hidden");
      Swal.fire({
        icon: "warning",
        title: "Your cart is empty",
        text: "Please add items to your cart before placing an order.",
      });
      return;
    }

    // Check cart total and adjust shipping fees
    const freeshipping = 2000; // Free shipping threshold
    const cartTotalElement = document.getElementById("cart-total");
    let cartTotal = 0;

    if (cartTotalElement) {
      const cartTotalText = cartTotalElement.innerText.match(/\d+/)
        ? cartTotalElement.innerText.match(/\d+/)[0]
        : "0";
      cartTotal = parseInt(cartTotalText, 10);
    }

    // If the cart total exceeds the freeshipping threshold, update shipping fees
    if (cartTotal >= freeshipping) {
      localStorage.setItem("shippingFees", "0");
      document.getElementById("shipping-fees").innerText = "Free Shipping";
      document.getElementById("shipping-fees-total").innerText = "0 EGP";
    }

    const unavailableItems = [];
    const updatedCart = [];

    for (const item of cart) {
      // Fetch the product data from Firebase
      const productResponse = await fetch(
        `${url}/Stores/${uid}/Products/${item.id}.json?auth=${idToken}`
      );
      const productData = await productResponse.json();

      if (!productData) {
        unavailableItems.push({
          title: item.title,
          photourl: item.photourl,
          reason: "Product no longer exists in the store.",
        });
        continue;
      }

      const stockQty =
        productData.sizes[item.productSize]?.[item.productColor]?.qty || 0;

      if (stockQty < item.quantity) {
        unavailableItems.push({
          title: item.title,
          photourl: item.photourl,
          reason: `Requested quantity (${item.quantity}) exceeds available stock (${stockQty}).`,
        });
        continue;
      }

      // Update the stock in Firebase
      const newStockQty = stockQty - item.quantity;

      if (newStockQty > 0) {
        await fetch(
          `${url}/Stores/${uid}/Products/${item.id}/sizes/${item.productSize}/${item.productColor}.json?auth=${idToken}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ qty: newStockQty }),
          }
        );
      } else {
        // Delete the size/color if stock is depleted
        await fetch(
          `${url}/Stores/${uid}/Products/${item.id}/sizes/${item.productSize}/${item.productColor}.json?auth=${idToken}`,
          {
            method: "DELETE",
          }
        );
      }

      updatedCart.push(item);
    }

    if (unavailableItems.length > 0) {
      document.getElementById("preloader").classList.add("hidden");

      const unavailableList = unavailableItems
        .map(
          (item) =>
            `<li>
              <img src="${item.photourl}" alt="${item.title}" style="width: 50px; height: 50px; margin-right: 10px;">
              <strong>${item.title}</strong> - ${item.reason}
            </li>`
        )
        .join("");

      Swal.fire({
        icon: "warning",
        title: "Some items are unavailable",
        html: `<ul>${unavailableList}</ul>`,
      }).then(() => {
        location.reload();
      });

      return;
    }

    // Get personal information and shipping fees
    const personalInfo = JSON.parse(localStorage.getItem("personal_info"));
    let shippingFees = parseFloat(
      document
        .getElementById("shipping-fees-total")
        .innerText.replace(" EGP", "")
    );

    // Construct the order
    const order = {
      cart: updatedCart,
      personal_info: personalInfo,
      email: user.email,
      shippingFees,
    };

    // Submit the order to Firebase
    const orderResponse = await fetch(
      `${url}/Stores/${uid}/orders.json?auth=${idToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      }
    );

    if (!orderResponse.ok) {
      throw new Error("Failed to submit order");
    }

    // Clear the cart
    localStorage.removeItem("cart");
    document.getElementById("preloader").classList.add("hidden");

    Swal.fire({
      icon: "success",
      title: "Order submitted successfully!",
      showConfirmButton: false,
      timer: 2000,
    }).then(() => {
      window.location.href = "./index.html";
    });
  } catch (error) {
    console.error("Error during order submission:", error);
    document.getElementById("preloader").classList.add("hidden");
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "An error occurred while processing your order. Please try again.",
    });
  }
}
