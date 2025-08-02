// Generic API client for making requests with credentials and JSON handling
const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5001/api/v1";

export async function apiFetch(
  endpoint: string,
  options: RequestInit & { headers?: Record<string, string> } = {}
) {
  const url = `${BASE_URL}${
    endpoint.startsWith("/") ? endpoint : "/" + endpoint
  }`;

  const isFormData = options.body instanceof FormData;

  let res = await fetch(url, {
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
    ...options,
  });

  // Retry on 401
  if (res.status === 401) {
    const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      res = await fetch(url, {
        credentials: "include",
        headers: {
          ...(isFormData ? {} : { "Content-Type": "application/json" }),
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
