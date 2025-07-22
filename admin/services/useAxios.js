import axios from "axios";

export async function useAxios(url, options = {}) {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const isFormData = options.data instanceof FormData;

  const instance = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
  });

  const makeRequest = () =>
    instance({
      url,
      method: options.method || "GET",
      data: options.data || undefined,
      params: options.params || undefined,
    });

  try {
    const res = await makeRequest();
    console.log(`Axios request to ${url} successful:`, res.status, res.data);
    return { status: res.status, ok: true, data: res.data };
  } catch (error) {
    console.error(
      `Axios request to ${url} failed:`,
      error.response?.status,
      error.response?.data
    );

    if (error.response?.status === 401) {
      console.log("401 error, attempting token refresh...");
      try {
        const refreshRes = await instance.post("/auth/refresh");
        console.log("Token refresh successful:", refreshRes.status);

        if (refreshRes.status === 200) {
          console.log("Retrying original request...");
          const retryRes = await makeRequest();
          console.log(
            `Retry request to ${url} successful:`,
            retryRes.status,
            retryRes.data
          );
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
