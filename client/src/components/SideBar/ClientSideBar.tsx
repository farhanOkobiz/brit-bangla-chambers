"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  User,
  FileText,
  LogOut,
  Menu,
  X,
  HelpCircle,
} from "lucide-react";
import { logout } from "@/api/logout";
import { toast } from "react-toastify";
import { useGetAuthQuery } from "@/redux/api/authApi";
import { apiFetch } from "@/api/apiFetch";
import Link from "next/link";

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const sidebarItems: SidebarItem[] = [
  { name: "Dashboard", href: "/client/dashboard", icon: Home },
  { name: "Profile", href: "/client/profile", icon: User },
  // {
  //   name: "Appointments",
  //   href: "/client/appointments",
  //   icon: Calendar,
  //   badge: "3",
  // },
  {
    name: "My case file",
    href: "/client/my-case-file",
    icon: FileText,
  },
  // { name: "Consultations", href: "/client/consultations", icon: MessageCircle },
  {
    name: "File Requests",
    href: "/client/file-request",
    icon: FileText,
  },
  // { name: "Billing", href: "/client/billing", icon: CreditCard },
  { name: "Help & Support", href: "/client/support", icon: HelpCircle },
  // { name: "Settings", href: "/client/settings", icon: Settings },
];

export default function ClientSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [file, setFile] = useState<number>(0);
  const router = useRouter();
  const pathname = usePathname();
  const { data: authData } = useGetAuthQuery(undefined);
  const user = authData?.data;
  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await apiFetch(`/file-request/clientId`, {
        method: "GET",
      });
      if (!response.ok) throw new Error("Failed to fetch requests.");
      setFile(response.data.length || 0);
    } catch (err) {
      console.error(err);
    }
  };

  const isActive = (href: string) => {
    return pathname === href;
  };

  useEffect(() => {
    fetchRequests();
  }, []);
  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md bg-white shadow-md border border-gray-200 hover:bg-gray-50"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-gray-600" />
          ) : (
            <Menu className="h-6 w-6 text-gray-600" />
          )}
        </button>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
              </Link>
            </div>
            <div className="ml-3">
              <h2 className="text-lg font-semibold text-gray-900">
                Client Portal
              </h2>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <button
                key={item.name}
                onClick={() => {
                  router.push(item.href);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  active
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center">
                  <Icon
                    className={`mr-3 h-5 w-5 ${
                      active ? "text-blue-700" : "text-gray-400"
                    }`}
                  />
                  {item.name}{" "}
                  {item.name === "File Requests" && file > 0 ? (
                    <span className="ml-2 text-red-600 font-bold">{file}</span>
                  ) : (
                    ""
                  )}
                </div>
                {item.badge && (
                  <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User info and logout */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-gray-600" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {user?.userName}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-700 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}
