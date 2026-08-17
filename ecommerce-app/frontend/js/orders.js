// ============================================================
// orders.js — order history rendering
// ============================================================

const orderUser = Session.requireLogin();

async function loadOrders() {
  if (!orderUser) return;
  try {
    const orders = await Api.getOrdersForUser(orderUser.id);
    renderOrders(orders);
  } catch (err) {
    showToast(err.message || 'Could not load orders');
  }
}

function renderOrders(orders) {
  const list = document.getElementById('orders-list');
  const empty = document.getElementById('empty-orders');

  if (orders.length === 0) {
    list.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  list.innerHTML = orders.map((order) => `
    <div class="order-card">
      <div class="order-card-head">
        <div>
          <div class="order-id">Order #${String(order.id).padStart(5, '0')}</div>
          <div class="cart-line-meta">${new Date(order.createdAt).toLocaleString()}</div>
        </div>
        <span class="status-badge">${order.status}</span>
      </div>
      ${order.items.map((item) => `
        <div class="order-item-row">
          <span>${item.quantity} × ${item.product.name}</span>
          <span>${formatPrice(item.priceAtPurchase * item.quantity)}</span>
        </div>
      `).join('')}
      <div class="summary-row total" style="margin-top:10px;">
        <span>Total</span>
        <span>${formatPrice(order.totalAmount)}</span>
      </div>
    </div>
  `).join('');
}

loadOrders();
