import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function ProtectedRoute({ children, requiredRole }) {
  const { authed, loading, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!authed) {
        navigate("/login");
      } else if (requiredRole && role !== requiredRole) {
        navigate("/unauthorized"); // or 403 page
      }
    }
  }, [loading, authed, role, requiredRole, navigate]);

  if (loading) return <div>Checking authentication...</div>;

  if (!authed || (requiredRole && role !== requiredRole)) return null;

  return children;
}
