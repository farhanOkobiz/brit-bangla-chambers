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
    let isMounted = true;

    const checkClientRole = async () => {
      try {
        const res = await apiFetch("/auth/check", { method: "GET" });
        console.log("Client role check response:", res);

        if (!res.ok || res.data?.role !== "client") {
          toast.warning("Unauthorized access");
          router.replace("/");
          return;
        }

        if (isMounted) setLoading(false);
      } catch (error) {
        console.error("Auth error:", error);
        toast.error("Authentication failed");
        router.replace("/");
      }
    };

    checkClientRole();

    return () => {
      isMounted = false;
    };
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
