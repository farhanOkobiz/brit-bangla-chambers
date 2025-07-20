"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/api/apiFetch";
import { toast } from "react-toastify";

export default function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkClientRole = async () => {
      try {
        const res = await apiFetch("/auth/check", { method: "GET" });
        console.log("Client role check response:", res);
        if (!res.ok || res.data?.role !== "client") {
          router.replace("/");
          return;
        }
        setLoading(false);
      } catch {
        toast.warning("Authentication failed");
        router.replace("/");
      }
    };
    checkClientRole();
  }, [router]);

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg text-gray-700">Checking access...</div>
      </section>
    );
  }

  return <>{children}</>;
}
