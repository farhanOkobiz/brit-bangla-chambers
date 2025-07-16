// Generic API client for making requests with credentials and JSON handling
export async function apiFetch(
  url: string,
  options: RequestInit & { headers?: Record<string, string> } = {}
) {
  let res = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
  // If 401, try to refresh token and retry once
  if (res.status === 401) {
    const refreshRes = await fetch("/api/v1/auth/refresh", {
      method: "POST",
      credentials: "include",
    });
    if (refreshRes.ok) {
      // Retry original request
      res = await fetch(url, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
        ...options,
      });
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
