async function addfavouriteproduct(key) {
  const url = `https://matager-f1f00-default-rtdb.firebaseio.com/Stores/${uid}/Products/${key}.json`;

  try {
    // Fetch product details
    const response = await fetch(url);
    const product = await response.json();

    if (!product) {
      alert("Product not found!");
      return;
    }

    // Select the modal and its content container
    const modal = document.getElementById("modal-fav");
    const modalContent = document.getElementById("modal-fav-content");

    // Clear any existing content in the modal
    modalContent.innerHTML = "";

    // Add content to the modal
    modalContent.innerHTML = `
      <div class="modal-header">
        <button type="button" class="Add-to-Cart" style="border-radius: 0px 8px 0px 8px;margin: 0; "id="closeModal">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <form id="productForm">
        <h4>Select Size and Color</h4>
        <label class="fav-modal-label" for="size">Size:</label>
        <select class="swal2-input" id="size" name="size" required>
          ${Object.keys(product.sizes)
            .map((size) => `<option value="${size}">${size}</option>`)
            .join("")}
        </select>
        <br>
        <label class="fav-modal-label" for="color">Color:</label>
        <select class="swal2-input" id="color" name="color" required></select>
        <br>
        <div class="flex center width-available">
        <button class="add-to-fav-btn" type="submit">Add to favourite</button>
        </div>
      </form>
    `;

    // Populate the color dropdown based on the selected size
    const sizeSelect = modalContent.querySelector("#size");
    const colorSelect = modalContent.querySelector("#color");

    sizeSelect.addEventListener("change", () => {
      const selectedSize = sizeSelect.value;
      colorSelect.innerHTML = ""; // Clear colors for new size selection

      if (product.sizes[selectedSize]) {
        Object.keys(product.sizes[selectedSize]).forEach((color) => {
          const colorOption = document.createElement("option");
          colorOption.value = color;
          colorOption.textContent = color;
          colorSelect.appendChild(colorOption);
        });
      }
    });

    // Trigger the size change event to populate colors for the default size
    sizeSelect.dispatchEvent(new Event("change"));

    // Show the modal
    modal.style.display = "block";
    modal.classList.add("show", "flex");

    // Handle form submission
    const form = modalContent.querySelector("#productForm");
    form.onsubmit = (e) => {
      e.preventDefault();

      const selectedSize = sizeSelect.value;
      const selectedColor = colorSelect.value;
      const selectedDetails = product.sizes[selectedSize][selectedColor];

      const result = {
        productid: key,
        storeid: uid,
        title: product["Brand-Name"],
        Photo: selectedDetails.img1,
      };

      console.log(result);

      // Hide the modal after submission
      modal.style.display = "none";
      modal.classList.remove("flex");
    };

    // Close modal on cancel button click
    const closeModalButton = modalContent.querySelector("#closeModal");
    closeModalButton.onclick = () => {
      modal.style.display = "none";
      modal.classList.remove("flex");
    };

    // Close modal when clicking outside the modal content
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
        modal.classList.remove("flex");
      }
    });
  } catch (error) {
    console.error("Error fetching product:", error);
  }
}
