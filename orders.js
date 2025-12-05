let orders = JSON.parse(localStorage.getItem("orders")) || [];
let currentUserOrders = JSON.parse(localStorage.getItem("currentUser"));

function loadOrders() {
  orders = JSON.parse(localStorage.getItem("orders")) || [];
  currentUserOrders = JSON.parse(localStorage.getItem("currentUser"));
  const out = document.getElementById("ordersList");
  if (!out) return;
  out.innerHTML = "";

  const myOrders = orders.filter(o => o.userId === (currentUserOrders ? currentUserOrders.id : null));
  if (myOrders.length === 0) {
    out.innerHTML = "<p>No orders.</p>";
    return;
  }

  myOrders.forEach(o => {
    out.innerHTML += `
      <div class="order-card">
        <h4>Order #${o.id}</h4>
        <p>Created: ${new Date(o.createdAt).toLocaleString()}</p>
        <p>Status: ${o.status}</p>
        <p>Total: $${o.total}</p>
        <button onclick="cancelOrder(${o.id})" ${o.status === 'canceled' ? 'disabled' : ''}>Cancel Order</button>
      </div>
    `;
  });
}

function cancelOrder(orderId) {
  orders = JSON.parse(localStorage.getItem("orders")) || [];
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx === -1) return;
  orders[idx].status = 'canceled';
  localStorage.setItem("orders", JSON.stringify(orders));
  loadOrders();
}

document.addEventListener("DOMContentLoaded", loadOrders);
window.cancelOrder = cancelOrder;
