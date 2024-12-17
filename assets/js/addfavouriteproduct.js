// // async function addfavouriteproduct(key) {
// //   const url = `https://matager-f1f00-default-rtdb.firebaseio.com/Stores/${uid}/Products/${key}.json`;

// //   try {
// //     // Fetch product details
// //     const response = await fetch(url);
// //     const product = await response.json();

// //     if (!product) {
// //       alert("Product not found!");
// //       return;
// //     }

// //     // Select the modal and its content container
// //     const modal = document.getElementById("modal-fav");
// //     const modalContent = document.getElementById("modal-fav-content");

// //     // Clear any existing content in the modal
// //     modalContent.innerHTML = "";

// //     // Add content to the modal
// //     modalContent.innerHTML = `
// //       <div class="modal-header">
// //         <button type="button" class="Add-to-Cart" style="border-radius: 0px 8px 0px 8px;margin: 0; "id="closeModal">
// //           <i class="bi bi-x-lg"></i>
// //         </button>
// //       </div>
// //       <form class="m-50" id="productForm">
// //         <h4>Select Size and Color</h4>
// //         <label class="fav-modal-label" for="size">Size:</label>
// //         <select class="swal2-input" col-black id="size" name="size" required>
// //           ${Object.keys(product.sizes)
// //             .map((size) => `<option value="${size}">${size}</option>`)
// //             .join("")}
// //         </select>
// //         <br>
// //         <label class="fav-modal-label" for="color">Color:</label>
// //         <select class="swal2-input col-black" id="color" name="color" required></select>
// //         <br>
// //         <div class="flex center width-available">
// //         <button class="add-to-fav-btn" type="submit">Add to favourite</button>
// //         </div>
// //       </form>
// //     `;

// //     // Populate the color dropdown based on the selected size
// //     const sizeSelect = modalContent.querySelector("#size");
// //     const colorSelect = modalContent.querySelector("#color");

// //     sizeSelect.addEventListener("change", () => {
// //       const selectedSize = sizeSelect.value;
// //       colorSelect.innerHTML = ""; // Clear colors for new size selection

// //       if (product.sizes[selectedSize]) {
// //         Object.keys(product.sizes[selectedSize]).forEach((color) => {
// //           const colorOption = document.createElement("option");
// //           colorOption.value = color;
// //           colorOption.textContent = color;
// //           colorSelect.appendChild(colorOption);
// //         });
// //       }
// //     });

// //     // Trigger the size change event to populate colors for the default size
// //     sizeSelect.dispatchEvent(new Event("change"));

// //     // Show the modal
// //     modal.style.display = "flex";
// //     modal.classList.add("show");
// //     document.body.style.overflow = "hidden";

// //     // Handle form submission
// //     const form = modalContent.querySelector("#productForm");
// //     form.onsubmit = (e) => {
// //       e.preventDefault();

// //       const selectedSize = sizeSelect.value;
// //       const selectedColor = colorSelect.value;
// //       const selectedDetails = product.sizes[selectedSize][selectedColor];

// //       const result = {
// //         productid: key,
// //         storeid: uid,
// //         title: product["Brand-Name"],
// //         Photo: selectedDetails.img1,
// //       };

// //       console.log(result);

// //       // Hide the modal after submission
// //       modal.style.display = "none";
// //       document.body.style.overflow = "auto"; // Restore body overflow
// //     };

// //     // Close modal on cancel button click
// //     const closeModalButton = modalContent.querySelector("#closeModal");
// //     closeModalButton.onclick = () => {
// //       modal.style.display = "none";
// //       document.body.style.overflow = "auto"; // Restore body overflow
// //     };

// //     // Close modal when clicking outside the modal content
// //     modal.addEventListener("click", (e) => {
// //       if (e.target === modal) {
// //         modal.style.display = "none";
// //         modal.classList.remove("flex");
// //         document.body.style.overflow = "auto"; // Restore body overflow
// //       }
// //     });
// //   } catch (error) {
// //     console.error("Error fetching product:", error);
// //   }
// // }

// async function addfavouriteproduct(key) {
//   const url = `https://matager-f1f00-default-rtdb.firebaseio.com/Stores/${uid}/Products/${key}.json`;

//   try {
//     // Fetch product details
//     const response = await fetch(url);
//     const product = await response.json();
//     console.log(product);

//     if (!product) {
//       alert("Product not found!");
//       return;
//     }

//     // Select the modal and its content container
//     const modal = document.getElementById("modal-fav");
//     const modalContent = document.getElementById("modal-fav-content");

//     // Clear any existing content in the modal
//     modalContent.innerHTML = "";

//     // Add content to the modal
//     modalContent.innerHTML = `
//       <div class="modal-header">
//         <button type="button" class="Add-to-Cart" style="border-radius: 0px 8px 0px 8px;margin: 0;" id="closeModal">
//           <i class="bi bi-x-lg"></i>
//         </button>
//       </div>
//       <form class="m-50" id="productForm">
//         <h4>Select Size and Color</h4>
//         <label class="fav-modal-label" for="size">Size:</label>
//         <select class="swal2-input" col-black id="size" name="size" required>
//           ${Object.keys(product.sizes)
//             .map((size) => `<option value="${size}">${size}</option>`)
//             .join("")}
//         </select>
//         <br>
//         <label class="fav-modal-label" for="color">Color:</label>
//         <select class="swal2-input col-black" id="color" name="color" required></select>
//       </form>
//       <div class="flex center width-available flex-direction-column">
//       <img width="100px" class="" src="${product["product-photo"]}">
//           <button class="add-to-fav-btn flex align-items" type="submit">Add to favourite <ion-icon  name="heart-outline" role="img" class="md hydrated ml-5" aria-label="heart-outline"></ion-icon></button>
//         </div>
//     `;

//     // Populate the color dropdown based on the selected size
//     const sizeSelect = modalContent.querySelector("#size");
//     const colorSelect = modalContent.querySelector("#color");

//     sizeSelect.addEventListener("change", () => {
//       const selectedSize = sizeSelect.value;
//       colorSelect.innerHTML = ""; // Clear colors for new size selection

//       if (product.sizes[selectedSize]) {
//         Object.keys(product.sizes[selectedSize]).forEach((color) => {
//           const colorOption = document.createElement("option");
//           colorOption.value = color;
//           colorOption.textContent = color;
//           colorSelect.appendChild(colorOption);
//         });
//       }
//     });

//     // Trigger the size change event to populate colors for the default size
//     sizeSelect.dispatchEvent(new Event("change"));

//     // Show the modal with animation
//     modal.style.display = "flex";
//     modal.classList.add("show");
//     modalContent.style.animation = "slideUpSmooth 0.6s ease-out forwards";
//     document.body.style.overflow = "hidden";

//     // Handle form submission
//     const form = modalContent.querySelector("#productForm");
//     form.onsubmit = (e) => {
//       e.preventDefault();

//       const selectedSize = sizeSelect.value;
//       const selectedColor = colorSelect.value;
//       const selectedDetails = product.sizes[selectedSize][selectedColor];

//       const result = {
//         productid: key,
//         storeid: uid,
//         title: product["Brand-Name"],
//         Photo: selectedDetails.img1,
//       };

//       console.log(result);

//       // Hide the modal after submission
//       modal.style.display = "none";
//       document.body.style.overflow = "auto"; // Restore body overflow
//     };

//     // Close modal on cancel button click
//     const closeModalButton = modalContent.querySelector("#closeModal");
//     closeModalButton.onclick = () => {
//       modal.style.display = "none";
//       document.body.style.overflow = "auto"; // Restore body overflow
//     };

//     // Close modal when clicking outside the modal content
//     modal.addEventListener("click", (e) => {
//       if (e.target === modal) {
//         modal.style.display = "none";
//         modal.classList.remove("flex");
//         document.body.style.overflow = "auto"; // Restore body overflow
//       }
//     });
//   } catch (error) {
//     console.error("Error fetching product:", error);
//   }
// }

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
        <button type="button" class="Add-to-Cart" style="border-radius: 0px 8px 0px 8px;margin: 0;" id="closeModal">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <form class="m-50" id="productForm">
        <h4>Select Size and Color</h4>
        <div id="image-preview" class="fav-image-preview">
          <img width="150px" src="" alt="Selected Product Image" id="productImage">
        </div>
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
          <button class="add-to-fav-btn" type="submit">Add to Favourite</button>
        </div>
      </form>
    `;

    // Populate the color dropdown based on the selected size
    const sizeSelect = modalContent.querySelector("#size");
    const colorSelect = modalContent.querySelector("#color");
    const productImage = modalContent.querySelector("#productImage");

    // Helper function to update image based on size and color
    const updateImage = () => {
      const selectedSize = sizeSelect.value;
      const selectedColor = colorSelect.value;

      if (
        product.sizes[selectedSize] &&
        product.sizes[selectedSize][selectedColor]
      ) {
        productImage.src = product.sizes[selectedSize][selectedColor].img1;
      }
    };

    // Populate colors and update image when size changes
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

      // Trigger image update for the default color
      colorSelect.dispatchEvent(new Event("change"));
    });

    // Update image when color changes
    colorSelect.addEventListener("change", updateImage);

    // Trigger size change event to initialize colors and image
    sizeSelect.dispatchEvent(new Event("change"));

    // Show the modal
    modal.style.display = "flex";
    modal.classList.add("show");
    document.body.style.overflow = "hidden";

    // Handle form submission
    const form = modalContent.querySelector("#productForm");
    form.onsubmit = (e) => {
      e.preventDefault();

      const selectedSize = sizeSelect.value;
      const selectedColor = colorSelect.value;

      if (
        product.sizes[selectedSize] &&
        product.sizes[selectedSize][selectedColor]
      ) {
        const result = {
          productid: key,
          storeid: uid,
          title: product["product-title"],
          photo: product.sizes[selectedSize][selectedColor].img1,
        };

        console.log(result);
        alert("Product added to favourites!");
      }

      // Hide the modal
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    };

    // Close modal on cancel button click
    const closeModalButton = modalContent.querySelector("#closeModal");
    closeModalButton.onclick = () => {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    };

    // Close modal when clicking outside the modal content
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
        modal.classList.remove("flex");
        document.body.style.overflow = "auto";
      }
    });
  } catch (error) {
    console.error("Error fetching product:", error);
  }
}
