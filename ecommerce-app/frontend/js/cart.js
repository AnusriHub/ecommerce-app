// ============================================================
// cart.js — cart rendering, quantity updates, checkout
// ============================================================

const user = Session.requireLogin();
let cartItems = [];

async function loadCart() {
  if (!user) return;
  try {
    cartItems = await Api.getCart(user.id);
    renderCart();
  } catch (err) {
    showToast(err.message || 'Could not load cart');
  }
}

function renderCart() {
  const wrap = document.getElementById('cart-items');
  const layout = document.querySelector('.cart-layout');
  const empty = document.getElementById('empty-cart');

  if (cartItems.length === 0) {
    layout.style.display = 'none';
    empty.style.display = 'block';
    return;
  }
  layout.style.display = 'grid';
  empty.style.display = 'none';

  wrap.innerHTML = cartItems.map((item) => `
    <div class="cart-line" data-item-id="${item.id}">
      <img src="${item.product.imageUrl || 'https://via.placeholder.com/72'}" alt="${item.product.name}">
      <div>
        <div class="cart-line-name">${item.product.name}</div>
        <div class="cart-line-meta">${skuFor(item.product.id)} · ${formatPrice(item.product.price)} each</div>
      </div>
      <div class="qty-control">
        <button data-action="dec">−</button>
        <input type="text" value="${item.quantity}" readonly>
        <button data-action="inc">+</button>
      </div>
      <button class="btn-danger" data-action="remove">Remove</button>
    </div>
  `).join('');

  wrap.querySelectorAll('.cart-line').forEach((line) => {
    const itemId = Number(line.dataset.itemId);
    const item = cartItems.find((i) => i.id === itemId);

    line.querySelector('[data-action="inc"]').addEventListener('click', () =>
      updateQuantity(item, item.quantity + 1));
    line.querySelector('[data-action="dec"]').addEventListener('click', () => {
      if (item.quantity <= 1) return removeItem(item);
      updateQuantity(item, item.quantity - 1);
    });
    line.querySelector('[data-action="remove"]').addEventListener('click', () => removeItem(item));
  });

  renderSummary();
}

function renderSummary() {
  const count = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const total = cartItems.reduce((sum, i) => sum + i.quantity * i.product.price, 0);
  document.getElementById('summary-count').textContent = count;
  document.getElementById('summary-total').textContent = formatPrice(total);
}

async function updateQuantity(item, quantity) {
  try {
    await Api.updateCartItem(user.id, item.id, quantity);
    await loadCart();
    refreshCartBadge();
  } catch (err) {
    showToast(err.message || 'Could not update quantity');
  }
}

async function removeItem(item) {
  try {
    await Api.removeCartItem(user.id, item.id);
    await loadCart();
    refreshCartBadge();
    showToast('Removed from cart');
  } catch (err) {
    showToast(err.message || 'Could not remove item');
  }
}

document.getElementById('checkout-btn').addEventListener('click', async () => {
  try {
    await Api.placeOrder(user.id, user.address);
    showToast('Order placed!');
    setTimeout(() => (window.location.href = 'orders.html'), 700);
  } catch (err) {
    showToast(err.message || 'Could not place order');
  }
});

loadCart();
