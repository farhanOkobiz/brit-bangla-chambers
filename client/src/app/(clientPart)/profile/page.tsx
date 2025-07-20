"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/api/apiFetch";

function ProfilePage() {
  const router = useRouter();
  type User = {
    full_name: string;
    email: string;
    phone: string;
    role: string;
    otp_verified: boolean;
  };
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiFetch("/auth/profile", {
          method: "GET",
        });
        if (!res.ok) {
          setError(res.data?.message || "Not authenticated");
          setLoading(false);
          router.push("/login");
          return;
        }
        setUser(res.data.user);
        setLoading(false);
      } catch {
        setError("Failed to fetch profile");
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg text-gray-700">Loading profile...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-red-600 text-lg">{error}</div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-10">
        <h2 className="text-gray-700 text-2xl font-bold mb-6 text-center">
          Welcome, {user?.full_name || "User"}!
        </h2>
        <div className="space-y-4 text-gray-700">
          <div>
            <strong>Email:</strong> {user?.email}
          </div>
          <div>
            <strong>Phone:</strong> {user?.phone}
          </div>
          <div>
            <strong>Role:</strong> {user?.role}
          </div>
          <div>
            <strong>OTP Verified:</strong> {user?.otp_verified ? "Yes" : "No"}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;
