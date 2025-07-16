import { useAxios } from '../services/useAxios';

// Check if user is authenticated
export async function checkAuth() {
  const res = await useAxios('/auth/check');
  if (res.ok && res.data) {
    return { ok: true, role: res.data.role }; 
  }
  return { ok: false, role: null };
}
// Login function
export async function login(email, password) {
  const res = await useAxios('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
  return res;
}

// Logout function (optional)
export async function logout() {
  const res = await useAxios('/auth/logout', {
    method: 'POST',
  });
  return res.ok;
}
