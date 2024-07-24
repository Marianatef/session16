"use strict";
const api = "https://dummyjson.com/products";
let products = [];
let cart = JSON.parse(localStorage.getItem("cart") || "{}");
const productContainer = document.getElementById("product-container");
const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");
const sortSelect = document.getElementById("sort");
const productDetails = document.getElementById("product-details");
const closeDetailsButton = document.getElementById("close");
const detailsImg = document.getElementById("details-img");
const detailsTitle = document.getElementById("details-title");
const detailsPrice = document.getElementById("details-price");
const detailsDescription = document.getElementById("details-description");
const addToCartButton = document.getElementById("add-to-cart");
const cartContainer = document.getElementById("cart-container");
const cartSummary = document.getElementById("cart-total");
fetch(api)
  .then((response) => response.json())
  .then((data) => {
    products = data.products;
    displayProducts(products);
    populateFilterOptions();
    updateCart();
  })
  .catch((error) => console.error("Error fetching data:", error));
function displayProducts(products) {
  productContainer.innerHTML = "";
  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "card bg-white cursor-pointer";
    card.innerHTML = `
      <img src="${product.thumbnail}" alt="${product.title}" class="w-full">
      <div class="p-4">
        <h3 class="text-lg font-bold mb-2">${product.title}</h3>
        <p class="text-gray-700">$${product.price}</p>
      </div>
    `;
    card.addEventListener("click", () => showProductDetails(product));
    productContainer.appendChild(card);
  });
}
function showProductDetails(product) {
  productDetails.classList.remove("hidden");
  detailsImg.src = product.thumbnail;
  detailsTitle.textContent = product.title;
  detailsPrice.textContent = `$${product.price}`;
  detailsDescription.textContent = product.description;
  addToCartButton.onclick = () => addToCart(product);
}
closeDetailsButton.addEventListener("click", () => {
  productDetails.classList.add("hidden");
});
function addToCart(product) {
  if (cart[product.id]) {
    cart[product.id].quantity++;
  } else {
    cart[product.id] = Object.assign(Object.assign({}, product), {
      quantity: 1,
    });
  }
  updateCart();
}
function updateCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  cartContainer.innerHTML = "";
  let total = 0;
  for (const id in cart) {
    const cartItem = cart[id];
    total += cartItem.price * cartItem.quantity;
    const cartElement = document.createElement("div");
    cartElement.className = "bg-white p-4";
    cartElement.innerHTML = `
      <h3 class="text-lg font-bold mb-2">${cartItem.title}</h3>
      <p class="text-gray-700 mb-2">$${cartItem.price} x ${cartItem.quantity}</p>
      <button class="bg-red-500 text-white p-2 m-2" onclick="removeFromCart(${cartItem.id})">Remove</button>
      <button class="bg-blue-500 text-white p-2 m-2" onclick="increaseQuantity(${cartItem.id})">+</button>
      <button class="bg-blue-500 text-white p-2" onclick="decreaseQuantity(${cartItem.id})">-</button>
    `;
    cartContainer.appendChild(cartElement);
  }
  cartSummary.textContent = `Total: $${total.toFixed(2)}`;
}
function removeFromCart(id) {
  delete cart[id];
  updateCart();
}
function increaseQuantity(id) {
  cart[id].quantity++;
  updateCart();
}
function decreaseQuantity(id) {
  if (cart[id].quantity > 1) {
    cart[id].quantity--;
  } else {
    delete cart[id];
  }
  updateCart();
}
function populateFilterOptions() {
  const categories = new Set(products.map((product) => product.category));
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    filterSelect.appendChild(option);
  });
}
searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm)
  );
  displayProducts(filteredProducts);
});
filterSelect.addEventListener("change", () => {
  const selectedCategory = filterSelect.value;
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;
  displayProducts(filteredProducts);
});
sortSelect.addEventListener("change", () => {
  const sortOrder = sortSelect.value;
  const sortedProducts = [...products].sort((a, b) =>
    sortOrder === "asc" ? a.price - b.price : b.price - a.price
  );
  displayProducts(sortedProducts);
});
