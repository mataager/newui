function updateShippingFees() {
  // Define the free shipping threshold

  // Get the cart total element and its text content
  const cartTotalElement = document.getElementById("cart-total");
  let totalAmount = 0;

  // Extract the numerical value from the cart total
  if (cartTotalElement) {
    const totalText = cartTotalElement.innerText.replace(" EGP", "").trim();
    totalAmount = parseFloat(totalText) || 0; // Convert to number, default to 0 if not valid
  }

  // Get the city element and its value
  const cityElement = document.getElementById("city");
  let city = "Not selected yet";
  if (cityElement) {
    city = cityElement.value || "Not selected yet";
  }

  // Set default shipping fee based on the city
  let shippingFees = 100; // Default shipping fee for cities not listed
  if (city === "Cairo" || city === "Giza" || city === "Alexandria") {
    shippingFees = 65;
  }

  // Check if the total amount exceeds the free shipping threshold
  if (totalAmount >= freeshipping) {
    // If total amount is above the threshold, set shipping fees to 0
    document.getElementById("shipping-fees").innerText = "Free shipping";
    document.getElementById("shipping-fees-total").innerText = "0 EGP"; // Update summary shipping fees
    // Store the shipping fees in localStorage
    localStorage.setItem("shippingFees", "0");
  } else {
    // If total amount is below the threshold, apply regular shipping fees
    document.getElementById("shipping-fees").innerText = `${shippingFees} EGP`;
    document.getElementById(
      "shipping-fees-total"
    ).innerText = `${shippingFees} EGP`; // Update summary shipping fees
    // Store the shipping fees in localStorage
    localStorage.setItem("shippingFees", shippingFees.toString());
  }

  // Update the cart summary
  updateCartSummary();
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", updateShippingFees);

// Call the function when the city select changes, if the element exists
const cityElement = document.getElementById("city");
if (cityElement) {
  cityElement.addEventListener("change", updateShippingFees);
}
