import { UseAxios } from "../services/UseAxios";

// Check if user is authenticated
export async function checkAuth() {
  const res = await UseAxios("/auth/check");
  if (res.ok && res.data) {
    return {
      ok: true,
      role: res.data.role,
      userName: res.data.userName || null,
      profilePhoto: res.data.profilePhoto || null, // New field for profile photo
      id : res.data.userId, // Include user ID if needed
    };
  }
  return { ok: false, role: null };
}
// Login function
export async function login(email, password) {
  const res = await UseAxios("/auth/login", {
    method: "POST",
    body: { email, password },
  });
  return res;
}

// Logout function (optional)
export async function logout() {
  const res = await UseAxios("/auth/logout", {
    method: "POST",
  });
  return res.ok;
}

//category functions
export async function createCategory(name, image, description, link) {
  const res = await UseAxios(
    "http://localhost:5000/api/v1/category/create-specialization",
    {
      method: "POST",
      body: { name, image, description, link },
    }
  );
  return res;
}
