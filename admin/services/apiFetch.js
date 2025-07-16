export async function apiFetch(url, options = {}) {
  const fetchWithCreds = () =>
    fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });

  let res = await fetchWithCreds();

  if (res.status === 401) {
    const refreshRes = await fetch('/api/v1/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    if (refreshRes.ok) {
      res = await fetchWithCreds(); // Retry original request
    }
  }

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  return { status: res.status, ok: res.ok, data };
}
