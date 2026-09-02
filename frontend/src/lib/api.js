const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const TOKEN_KEY = 'dyt_admin_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// Resolve an image value from the API (which may be a full URL, e.g. Unsplash,
// or a local backend path like "/uploads/packages/xyz.jpg") into a URL the
// browser can load directly.
export function resolveImageUrl(image) {
  if (!image) return '';
  if (/^https?:\/\//i.test(image)) return image;
  return `${API_BASE}${image.startsWith('/') ? '' : '/'}${image}`;
}

async function request(path, { method = 'GET', body, auth = false, isForm = false } = {}) {
  const headers = {};
  if (!isForm) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body (e.g. 204)
  }

  if (!res.ok) {
    const message = (data && data.error) || `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}

// --- Public ---

export const fetchPackages = () => request('/api/packages');
export const fetchPackage = (id) => request(`/api/packages/${id}`);

// --- Admin auth ---

export const adminLogin = (username, password) =>
  request('/api/admin/login', { method: 'POST', body: { username, password } });

export const verifyAdminToken = () => request('/api/admin/verify', { auth: true });

// --- Admin package management ---

export const createPackage = (payload) =>
  request('/api/packages', { method: 'POST', body: payload, auth: true });

export const updatePackage = (id, payload) =>
  request(`/api/packages/${id}`, { method: 'PUT', body: payload, auth: true });

export const deletePackage = (id) =>
  request(`/api/packages/${id}`, { method: 'DELETE', auth: true });

export const uploadImage = async (file) => {
  const form = new FormData();
  form.append('image', file);
  return request('/api/admin/upload', { method: 'POST', body: form, auth: true, isForm: true });
};
