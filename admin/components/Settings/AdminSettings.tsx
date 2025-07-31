import { useState } from "react";
import { UseAxios } from "../../services/UseAxios";

const AdminSettings = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    if (!oldPassword || !newPassword) {
      setError("Please fill all fields.");
      setLoading(false);
      return;
    }
    try {
      const res = await UseAxios("/auth/change-password", {
        method: "PUT",
        data: { oldPassword, newPassword },
      });
      if (res.ok) {
        setSuccess("Password changed successfully!");
        setOldPassword("");
        setNewPassword("");
      } else {
        setError(res.data?.message || "Failed to change password.");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Change Password
        </h1>
        <form onSubmit={handleChangePassword} className="space-y-6">
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Old Password
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-bold shadow-md transition bg-gray-600 text-white hover:bg-gray-700 cursor-pointer`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                <span>Processing...</span>
              </div>
            ) : (
              "Change Password"
            )}
          </button>
          {success && (
            <div className="mt-4 text-green-600 text-center font-semibold">
              {success}
            </div>
          )}
          {error && (
            <div className="mt-4 text-red-600 text-center font-semibold">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
export default AdminSettings;

