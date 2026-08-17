// ============================================================
// api.js — thin wrapper around the Spring Boot REST API
// ============================================================

const API_BASE = 'http://localhost:8080/api';

async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  // No content responses (204)
  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = (data && (data.message || (data.errors && Object.values(data.errors)[0]))) || 'Something went wrong';
    throw new Error(message);
  }

  return data;
}

const Api = {
  // Auth
  register: (body) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  // Products
  getProducts: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiRequest(`/products${qs ? `?${qs}` : ''}`);
  },
  getProduct: (id) => apiRequest(`/products/${id}`),

  // Cart
  getCart: (userId) => apiRequest(`/cart/${userId}`),
  addToCart: (userId, productId, quantity) =>
    apiRequest(`/cart/${userId}`, { method: 'POST', body: JSON.stringify({ productId, quantity }) }),
  updateCartItem: (userId, cartItemId, quantity) =>
    apiRequest(`/cart/${userId}/item/${cartItemId}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),
  removeCartItem: (userId, cartItemId) =>
    apiRequest(`/cart/${userId}/item/${cartItemId}`, { method: 'DELETE' }),

  // Orders
  placeOrder: (userId, shippingAddress) =>
    apiRequest(`/orders/${userId}`, { method: 'POST', body: JSON.stringify({ shippingAddress }) }),
  getOrdersForUser: (userId) => apiRequest(`/orders/user/${userId}`),
};

// ------------------------------------------------------------
// Session helpers (lightweight — stores the logged-in user in
// localStorage; swap for real JWT/session auth in production)
// ------------------------------------------------------------

const Session = {
  save(user) {
    localStorage.setItem('ecommerce_user', JSON.stringify(user));
  },
  get() {
    const raw = localStorage.getItem('ecommerce_user');
    return raw ? JSON.parse(raw) : null;
  },
  clear() {
    localStorage.removeItem('ecommerce_user');
  },
  requireLogin() {
    const user = Session.get();
    if (!user) {
      window.location.href = 'login.html';
      return null;
    }
    return user;
  },
};

function formatPrice(amount) {
  return `₹${Number(amount).toFixed(2)}`;
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 2400);
}

function skuFor(id) {
  return `#${String(id).padStart(4, '0')}`;
}
