let products = JSON.parse(localStorage.getItem("products")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser"));
let inbox = JSON.parse(localStorage.getItem("inbox")) || [];

if (!currentUser) {
  window.location = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  displayMyProducts();
});

function addProduct() {
  const name = document.getElementById("name").value.trim();
  const price = document.getElementById("price").value.trim();
  const image = document.getElementById("image").value.trim();

  if (!name || !price) {
    alert("Please provide product name and price.");
    return;
  }

  const productId = Date.now() + Math.floor(Math.random() * 1000);

  const product = {
    id: productId,
    name,
    price,
    image,
    ownerId: currentUser.id,
    likesUsers: [],   
    heartsUsers: []   
  };

  products.push(product);
  localStorage.setItem("products", JSON.stringify(products));

  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("image").value = "";

  alert("Product added!");
  loadProducts();
  displayMyProducts();
}

function loadProducts() {
  products = JSON.parse(localStorage.getItem("products")) || [];
}

function displayMyProducts() {
  loadProducts();
  const myProductsDiv = document.getElementById("myProducts");
  if (!myProductsDiv) return;
  myProductsDiv.innerHTML = "";

  const myProducts = products.filter(p => p.ownerId === currentUser.id);
  if (myProducts.length === 0) {
    myProductsDiv.innerHTML = "<p>No products added yet.</p>";
    return;
  }

  myProducts.forEach((p) => {
    const hearts = (p.heartsUsers || []).length;
    const likes = (p.likesUsers || []).length;
    myProductsDiv.innerHTML += `
      <div class="product-card" data-id="${p.id}">
        <img src="${p.image || 'placeholder.jpg'}" width="150" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>$${p.price}</p>
        <p>❤️ Hearts: ${hearts} | 👍 Likes: ${likes}</p>
        <button type="button" onclick="deleteMyProduct(${p.id})">Delete</button>
      </div>
    `;
  });
}

function deleteMyProduct(productId) {
  loadProducts();
  products = products.filter(p => p.id !== productId);
  localStorage.setItem("products", JSON.stringify(products));
  displayMyProducts();
}

window.addProduct = addProduct;
window.deleteMyProduct = deleteMyProduct;
