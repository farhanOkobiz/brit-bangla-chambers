import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UseAxios } from "../services/UseAxios";
import { UseAuth } from "../auth/AuthContext";
import { useEffect } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { authed, role, setAuthed, setRole, setUserName } = UseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authed) {
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "advocate") {
        navigate("/advocate/dashboard");
      }
    }
  }, [authed, role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await UseAxios("/auth/login", {
        method: "POST",
        data: { email, password },
      });

      if (res.ok) {
        const { role } = res.data.user;
        setAuthed(true);
        setRole(role);
        setUserName(res.data.user.full_name || email); // Set user name from response
        // Redirect based on role
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else if (role === "advocate") {
          navigate("/advocate/dashboard");
        } else {
          // navigate('/unauthorized');
        }
      } else {
        setError(res.data?.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
