import { apiFetch } from '../services/apiFetch';

// Check if user is authenticated
export async function checkAuth() {
  const res = await apiFetch('/api/v1/auth/check');
  return res.ok;
}

// Login function
export async function login(email, password) {
  const res = await apiFetch('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return res;
}

// Logout function (optional)
export async function logout() {
  const res = await apiFetch('/api/v1/auth/logout', {
    method: 'POST',
  });
  return res.ok;
}
