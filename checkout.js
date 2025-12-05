let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
let currentUserCheckout = JSON.parse(localStorage.getItem("currentUser"));
let orders = JSON.parse(localStorage.getItem("orders")) || [];

function loadCheckout() {
  cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const checkoutDiv = document.getElementById("checkoutItems");
  const checkoutTotal = document.getElementById("checkoutTotal");
  if (!checkoutDiv || !checkoutTotal) return;

  checkoutDiv.innerHTML = "";
  if (cartItems.length === 0) {
    checkoutDiv.innerHTML = "<p>Your cart is empty.</p>";
    checkoutTotal.innerHTML = "";
    return;
  }

  let total = 0;
  cartItems.forEach(item => {
    total += Number(item.price);
    checkoutDiv.innerHTML += `
      <div class="product-card">
        <img src="${item.image}" width="100" alt="${item.name}">
        <h3>${item.name}</h3>
        <p>$${item.price}</p>
      </div>
    `;
  });

  checkoutTotal.innerHTML = `<h3>Total Price: $${total}</h3>`;
}

document.addEventListener("DOMContentLoaded", loadCheckout);

function placeOrder() {
  cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  currentUserCheckout = JSON.parse(localStorage.getItem("currentUser"));
  orders = JSON.parse(localStorage.getItem("orders")) || [];

  if (!currentUserCheckout) {
    alert("You must be logged in to place an order.");
    window.location = "index.html";
    return;
  }

  if (cartItems.length === 0) {
    alert("Cart is empty!");
    return;
  }

  const newOrder = {
    id: Date.now(),
    userId: currentUserCheckout.id,
    items: cartItems,
    total: cartItems.reduce((s, p) => s + Number(p.price), 0),
    status: "active",
    createdAt: new Date().toISOString()
  };

  orders.push(newOrder);
  localStorage.setItem("orders", JSON.stringify(orders));

  localStorage.setItem("cart", JSON.stringify([]));
  alert("Order placed successfully!");
  window.location = "orders.html";
}

window.placeOrder = placeOrder;
