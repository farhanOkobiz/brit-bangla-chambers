import axios from "axios";

export async function UseAxios(url, options = {}) {
  // Validate that URL is provided
  if (!url || typeof url !== "string") {
    console.error(
      "UseAxios: URL is required and must be a string. Received:",
      url
    );
    return {
      status: 400,
      ok: false,
      data: { message: "Invalid URL provided to UseAxios" },
    };
  }

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  // Validate that API base URL is configured
  if (!apiBaseUrl) {
    console.error(
      "UseAxios: VITE_API_BASE_URL environment variable is not set"
    );
    return {
      status: 500,
      ok: false,
      data: { message: "API base URL not configured" },
    };
  }

  const isFormData = options.data instanceof FormData;

  const instance = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
  });

  const makeRequest = () => {
    return instance({
      url,
      method: options.method || "GET",
      data: options.data || undefined,
      params: options.params || undefined,
    });
  };

  try {
    const res = await makeRequest();
    return { status: res.status, ok: true, data: res.data };
  } catch (error) {
    console.error(
      `Axios request to ${url} failed:`,
      error.response?.status,
      error.response?.data
    );

    if (error.response?.status === 401) {
      try {
        const refreshRes = await instance.post("/auth/refresh");

        if (refreshRes.status === 200) {
          const retryRes = await makeRequest();
    
          return { status: retryRes.status, ok: true, data: retryRes.data };
        }
      } catch (refreshError) {
        console.error(
          "Token refresh failed:",
          refreshError.response?.status,
          refreshError.response?.data
        );
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
