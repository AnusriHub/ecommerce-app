// ============================================================
// shop.js — catalog listing, search, category filter, add-to-cart
// ============================================================

let allProducts = [];
let activeCategory = '';

async function loadProducts() {
  try {
    allProducts = await Api.getProducts();
    buildCategoryChips();
    renderProducts(allProducts);
  } catch (err) {
    showToast(err.message || 'Could not load products');
  }
}

function buildCategoryChips() {
  const wrap = document.getElementById('category-chips');
  const categories = [...new Set(allProducts.map((p) => p.category).filter(Boolean))];
  wrap.innerHTML = categories
    .map((c) => `<button class="chip" data-category="${c}">${c}</button>`)
    .join('');

  document.querySelectorAll('.chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      activeCategory = chip.dataset.category;
      applyFilters();
    });
  });
}

function applyFilters() {
  const keyword = document.getElementById('search-input').value.trim().toLowerCase();
  let filtered = allProducts;
  if (activeCategory) filtered = filtered.filter((p) => p.category === activeCategory);
  if (keyword) filtered = filtered.filter((p) => p.name.toLowerCase().includes(keyword));
  renderProducts(filtered);
}

function renderProducts(products) {
  const grid = document.getElementById('product-grid');
  const empty = document.getElementById('empty-state');

  if (products.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  grid.innerHTML = products.map((p) => `
    <article class="card">
      <div class="card-media">
        <span class="card-sku">${skuFor(p.id)}</span>
        <img src="${p.imageUrl || 'https://via.placeholder.com/300x300?text=' + encodeURIComponent(p.name)}" alt="${p.name}" loading="lazy">
      </div>
      <div class="card-body">
        <div class="card-category">${p.category || 'General'}</div>
        <h3 class="card-title">${p.name}</h3>
        <p class="card-desc">${p.description || ''}</p>
        <div class="card-footer">
          <span class="price">${formatPrice(p.price)}</span>
          ${p.stockQuantity <= 5 ? `<span class="stock-low">${p.stockQuantity} left</span>` : ''}
        </div>
        <button class="btn btn-primary btn-block" data-add="${p.id}" ${p.stockQuantity === 0 ? 'disabled' : ''}>
          ${p.stockQuantity === 0 ? 'Out of stock' : 'Add to cart'}
        </button>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('[data-add]').forEach((btn) => {
    btn.addEventListener('click', () => handleAddToCart(Number(btn.dataset.add)));
  });
}

async function handleAddToCart(productId) {
  const user = Session.get();
  if (!user) {
    window.location.href = 'login.html';
    return;
  }
  try {
    await Api.addToCart(user.id, productId, 1);
    showToast('Added to cart');
    refreshCartBadge();
  } catch (err) {
    showToast(err.message || 'Could not add to cart');
  }
}

document.getElementById('search-input').addEventListener('input', applyFilters);

loadProducts();
