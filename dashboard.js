window.Data = window.Data || JSON.parse(localStorage.getItem("users")) || [];
let Data = window.Data;

let products = JSON.parse(localStorage.getItem("products")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser"));
let inbox = JSON.parse(localStorage.getItem("inbox")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];

let IsUserLoggedIn = JSON.parse(localStorage.getItem("userloggedin")) || false;

if (!currentUser || IsUserLoggedIn !== true) {
  window.location = "index.html";
}

const logout = document.getElementById("logout");
if (logout) {
  logout.addEventListener('click', () => {
    localStorage.setItem("userloggedin", JSON.stringify(false));
    localStorage.removeItem("currentUser");
    window.location = "index.html";
  });
}

function loadProducts() {
  products = JSON.parse(localStorage.getItem("products")) || [];
}

function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
}
function saveInbox() {
  localStorage.setItem("inbox", JSON.stringify(inbox));
}

function displayProducts() {
  loadProducts();
  const shop = document.getElementById("shop");
  if (!shop) return;
  shop.innerHTML = "";

  products.forEach((p) => {
    p.likesUsers = p.likesUsers || [];
    p.heartsUsers = p.heartsUsers || [];
    p.likes = p.likesUsers.length;
    p.hearts = p.heartsUsers.length;

    shop.innerHTML += `
      <div class="product-card" data-id="${p.id}">
        <img src="${p.image || 'placeholder.jpg'}" width="150" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>$${p.price}</p>
        <p>❤️ ${p.hearts} | 👍 ${p.likes}</p>
<button onclick="openReviews(${p.id})">Reviews</button>
        <button onclick="toggleLike(${p.id})">${p.likesUsers.includes(currentUser.id) ? '👍 Unlike' : '👍 Like'}</button>
        <button onclick="toggleHeart(${p.id})">${p.heartsUsers.includes(currentUser.id) ? '💔 Unheart' : '❤️ Heart'}</button>

        ${p.ownerId === currentUser.id ? `<button onclick="deleteProduct(${p.id})">Delete</button>` : ''}

        ${p.ownerId !== currentUser.id ? `<button onclick="addToCartById(${p.id})">Add to Cart</button>` : ''}
      </div>
    `;
  });
}

function deleteProduct(productId) {
  loadProducts();
  products = products.filter(p => p.id !== productId);
  saveProducts();
  displayProducts();
}

function addToCartById(productId) {
  loadProducts();
  const product = products.find(p => p.id === productId);
  if (!product) { alert("Product not found"); return; }

  if (product.ownerId === currentUser.id) {
    alert("You cannot add your own product to the cart.");
    return;
  }

  cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Product added to cart!");
}

function toggleLike(productId) {
  loadProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  product.likesUsers = product.likesUsers || [];
  const idx = product.likesUsers.indexOf(currentUser.id);
  if (idx === -1) {
    product.likesUsers.push(currentUser.id);

    inbox = JSON.parse(localStorage.getItem("inbox")) || [];
    inbox.push({
      id: Date.now() + Math.floor(Math.random() * 1000),
      to: product.ownerId,
      from: currentUser.id,
      type: "like",
      productId: product.id,
      message: `${currentUser.name || currentUser.username} liked your product: ${product.name}`,
      createdAt: new Date().toISOString()
    });
    saveInbox();
  } else {
    product.likesUsers.splice(idx, 1);
  }

  saveProducts();
  displayProducts();
}

function toggleHeart(productId) {
  loadProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  product.heartsUsers = product.heartsUsers || [];
  const idx = product.heartsUsers.indexOf(currentUser.id);

  inbox = JSON.parse(localStorage.getItem("inbox")) || [];

  if (idx === -1) {
    product.heartsUsers.push(currentUser.id);

    inbox.push({
      id: Date.now() + Math.floor(Math.random() * 1000),
      to: product.ownerId,
      from: currentUser.id,
      type: "heart_owner",
      productId: product.id,
      message: `${currentUser.name || currentUser.username} hearted your product: ${product.name}`,
      createdAt: new Date().toISOString()
    });

    inbox.push({
      id: Date.now() + Math.floor(Math.random() * 1000) + 1,
      to: currentUser.id,
      from: product.ownerId,
      type: "heart_user",
      productId: product.id,
      message: `You hearted the product: ${product.name}`,
      createdAt: new Date().toISOString()
    });

    saveInbox();
  } else {
    product.heartsUsers.splice(idx, 1);
  }

  saveProducts();
  displayProducts();
}

function openInbox() {
  inbox = JSON.parse(localStorage.getItem("inbox")) || [];
  const box = document.getElementById("inboxMessages");
  if (!box) return;
  box.innerHTML = "";

  const userInbox = inbox.filter(m => m.to === currentUser.id);

  if (userInbox.length === 0) {
    box.innerHTML = "<p>No messages.</p>";
  } else {
    userInbox.forEach(msg => {
      const fromUser = (window.Data || []).find(u => u.id === msg.from);
      const fromName = fromUser ? (fromUser.name || fromUser.username) : `ID ${msg.from}`;
      box.innerHTML += `
        <div class="inbox-message">
          <small>${new Date(msg.createdAt).toLocaleString()}</small>
          <p>${msg.message} <br><em>from: ${fromName}</em></p>
        </div>
      `;
    });
  }

  document.getElementById("inboxPopup").style.display = "block";
}

function closeInbox() {
  const popup = document.getElementById("inboxPopup");
  if (popup) popup.style.display = "none";
}

function clearInbox() {
  inbox = JSON.parse(localStorage.getItem("inbox")) || [];
  inbox = inbox.filter(m => m.to !== currentUser.id);
  localStorage.setItem("inbox", JSON.stringify(inbox));
  openInbox(); 
  alert("Inbox cleared.");
}
function openReviews(productId) {
    window.location = `reviews.html?productId=${productId}`;
}


displayProducts();

window.displayProducts = displayProducts;
window.deleteProduct = deleteProduct;
window.addToCartById = addToCartById;
window.toggleLike = toggleLike;
window.toggleHeart = toggleHeart;
window.openInbox = openInbox;
window.closeInbox = closeInbox;
window.clearInbox = clearInbox;
