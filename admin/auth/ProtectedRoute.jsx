import { UseAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function ProtectedRoute({ children, requiredRole }) {
  const { authed, loading, role } = UseAuth();
  const navigate = useNavigate();
  const CLIENT_URL = import.meta.env.VITE_API_CLIENT_URL;

  useEffect(() => {
    if (!loading) {
      if (!authed) {
        window.location.href = `${CLIENT_URL}/login`; // Redirect to login page
      } else if (requiredRole && role !== requiredRole) {
        navigate("/unauthorized"); // or 403 page
      }
    }
  }, [loading, authed, role, requiredRole, navigate, CLIENT_URL]);

  if (loading) return <div>Checking authentication...</div>;

  if (!authed || (requiredRole && role !== requiredRole)) return null;

  return children;
}
