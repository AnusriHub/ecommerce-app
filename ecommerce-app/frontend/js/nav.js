// ============================================================
// nav.js — renders the top bar's auth-aware right side + cart badge
// Include after api.js on every page.
// ============================================================

function renderNav() {
  const user = Session.get();
  const authSlot = document.getElementById('nav-auth-slot');
  if (!authSlot) return;

  if (user) {
    authSlot.innerHTML = `
      <a href="orders.html" class="${location.pathname.endsWith('orders.html') ? 'active' : ''}">Orders</a>
      <a href="cart.html" class="cart-pill ${location.pathname.endsWith('cart.html') ? 'active' : ''}">
        Cart <span class="cart-count" id="cart-count">0</span>
      </a>
      <a href="#" id="logout-link">Log out</a>
    `;
    document.getElementById('logout-link').addEventListener('click', (e) => {
      e.preventDefault();
      Session.clear();
      window.location.href = 'index.html';
    });
    refreshCartBadge();
  } else {
    authSlot.innerHTML = `
      <a href="login.html">Log in</a>
      <a href="register.html" class="btn btn-accent">Sign up</a>
    `;
  }
}

async function refreshCartBadge() {
  const user = Session.get();
  const badge = document.getElementById('cart-count');
  if (!user || !badge) return;
  try {
    const items = await Api.getCart(user.id);
    const total = items.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = total;
  } catch (err) {
    // stay quiet on the nav badge — surfaced elsewhere if relevant
  }
}

document.addEventListener('DOMContentLoaded', renderNav);
