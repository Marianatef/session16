const api: string = "https://dummyjson.com/products";
let products: any[] = [];
let cart: {
  [key: number]: {
    quantity: number;
    id: number;
    title: string;
    price: number;
    thumbnail: string;
  };
} = JSON.parse(localStorage.getItem("cart") || "{}");

const productContainer = document.getElementById(
  "product-container"
) as HTMLDivElement;
const searchInput = document.getElementById("search") as HTMLInputElement;
const filterSelect = document.getElementById("filter") as HTMLSelectElement;
const sortSelect = document.getElementById("sort") as HTMLSelectElement;
const productDetails = document.getElementById(
  "product-details"
) as HTMLDivElement;
const closeDetailsButton = document.getElementById(
  "close"
) as HTMLButtonElement;
const detailsImg = document.getElementById("details-img") as HTMLImageElement;
const detailsTitle = document.getElementById(
  "details-title"
) as HTMLHeadingElement;
const detailsPrice = document.getElementById(
  "details-price"
) as HTMLParagraphElement;
const detailsDescription = document.getElementById(
  "details-description"
) as HTMLParagraphElement;
const addToCartButton = document.getElementById(
  "add-to-cart"
) as HTMLButtonElement;
const cartContainer = document.getElementById(
  "cart-container"
) as HTMLDivElement;
const cartSummary = document.getElementById("cart-total") as HTMLDivElement;

fetch(api)
  .then((response) => response.json())
  .then((data) => {
    products = data.products;
    displayProducts(products);
    populateFilterOptions();
    updateCart();
  })
  .catch((error) => console.error("Error fetching data:", error));

function displayProducts(products: any[]): void {
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

function showProductDetails(product: any): void {
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

function addToCart(product: any): void {
  if (cart[product.id]) {
    cart[product.id].quantity++;
  } else {
    cart[product.id] = { ...product, quantity: 1 };
  }
  updateCart();
}

function updateCart(): void {
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

function removeFromCart(id: number): void {
  delete cart[id];
  updateCart();
}

function increaseQuantity(id: number): void {
  cart[id].quantity++;
  updateCart();
}

function decreaseQuantity(id: number): void {
  if (cart[id].quantity > 1) {
    cart[id].quantity--;
  } else {
    delete cart[id];
  }
  updateCart();
}

function populateFilterOptions(): void {
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
