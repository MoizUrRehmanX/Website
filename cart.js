let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser"));

function displayCart() {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartDiv = document.getElementById("cartItems");
  const totalDiv = document.getElementById("totalPrice");
  if (!cartDiv || !totalDiv) return;

  cartDiv.innerHTML = "";
  if (cart.length === 0) {
    cartDiv.innerHTML = "<p>Your cart is empty.</p>";
    totalDiv.innerHTML = "";
    return;
  }

  let total = 0;
  cart.forEach((item, index) => {
    total += Number(item.price);
    cartDiv.innerHTML += `
      <div class="product-card">
        <img src="${item.image}" width="100" alt="${item.name}">
        <h3>${item.name}</h3>
        <p>$${item.price}</p>
        <button onclick="removeFromCart(${index})">Remove</button>
      </div>
    `;
  });

  totalDiv.innerHTML = `<h2>Total: $${total}</h2>`;
}

function removeFromCart(index) {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

function goToCheckout() {
  window.location = "checkout.html";
}

document.addEventListener("DOMContentLoaded", displayCart);

window.removeFromCart = removeFromCart;
window.goToCheckout = goToCheckout;
