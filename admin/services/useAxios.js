import axios from 'axios';

export async function useAxios(url, options = {}) {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const instance = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const makeRequest = () =>
    instance({
      url,
      method: options.method || 'GET',
      data: options.data || undefined,     // ✅ Axios uses `data` for request body
      params: options.params || undefined,
    });

  try {
    const res = await makeRequest();
    console.log(`Axios request to ${url} successful:`, res.status, res.data);
    return { status: res.status, ok: true, data: res.data };
  } catch (error) {
    if (error.response?.status === 401) {
      try {
        const refreshRes = await instance.post('/auth/refresh'); // already under baseURL

        if (refreshRes.status === 200) {
          const retryRes = await makeRequest();
          return { status: retryRes.status, ok: true, data: retryRes.data };
        }
      } catch (refreshError) {
        return {
          status: refreshError.response?.status || 401,
          ok: false,
          data: refreshError.response?.data || null,
        };
      }
    }

    return {
      status: error.response?.status || 500,
      ok: false,
      data: error.response?.data || null,
    };
  }
}
