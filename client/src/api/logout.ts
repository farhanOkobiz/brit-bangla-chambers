import { apiFetch } from "./apiFetch";
import { toast } from "react-toastify";

export const logout = async () => {
  try {
    const response = await apiFetch("/auth/logout", { method: "POST" });
    if (response.ok) {
      toast.success("Logged out successfully");
      window.location.href = "/";
    } else {
      toast.error("Logout failed. Please try again.");
    }
  } catch (error) {
    console.error("Logout error:", error);
    toast.error("An error occurred while logging out.");
  }
}