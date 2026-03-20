const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function fetchProducts() {
  const res = await fetch(`${API_URL}/api/products`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Error fetching products');
  return json.data;
}

export async function createProduct(product) {
  const res = await fetch(`${API_URL}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Error creating product');
  return json.data;
}

export async function updateProduct(id, product) {
  const res = await fetch(`${API_URL}/api/products/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Error updating product');
  return json.data;
}

export async function deleteProduct(id) {
  const res = await fetch(`${API_URL}/api/products/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Error deleting product');
  return json.data;
}

export async function fetchOrders(status) {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  const res = await fetch(`${API_URL}/api/orders${query}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Error fetching orders');
  return json.data;
}

export async function createOrder(order) {
  const res = await fetch(`${API_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Error creating order');
  return json.data;
}

export async function updateOrderStatus(id, status) {
  const res = await fetch(`${API_URL}/api/orders/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Error updating order status');
  return json.data;
}

// ===== Menu Items =====

export async function fetchMenuItems(filters = {}) {
  const params = new URLSearchParams();
  if (filters.menu) params.set('menu', filters.menu);
  if (filters.category) params.set('category', filters.category);
  const query = params.toString() ? `?${params}` : '';
  const res = await fetch(`${API_URL}/api/menu-items${query}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Error fetching menu items');
  return json.data;
}

export async function createMenuItem(item) {
  const res = await fetch(`${API_URL}/api/menu-items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Error creating menu item');
  return json.data;
}

export async function updateMenuItem(id, item) {
  const res = await fetch(`${API_URL}/api/menu-items/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Error updating menu item');
  return json.data;
}

export async function toggleMenuItemStock(id, inStock) {
  const res = await fetch(`${API_URL}/api/menu-items/${encodeURIComponent(id)}/stock`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ in_stock: inStock }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Error toggling stock');
  return json.data;
}

export async function deleteMenuItem(id) {
  const res = await fetch(`${API_URL}/api/menu-items/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Error deleting menu item');
  return json.data;
}
