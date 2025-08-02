"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { apiFetch } from "@/api/apiFetch"
import { toast } from "react-toastify"
import ClientSidebar from "@/components/SideBar/ClientSideBar"

export default function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const checkClientRole = async () => {
      try {
        const res = await apiFetch("/auth/check", { method: "GET" })
        if (!res.ok || res.data?.role !== "client") {
          toast.warning("Unauthorized access")
          router.replace("/")
          return
        }
        if (isMounted) setLoading(false)
      } catch (error) {
        console.error("Auth error:", error)
        toast.error("Authentication failed")
        router.replace("/")
      }
    }

    checkClientRole()
    return () => {
      isMounted = false
    }
  }, [router])

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg text-gray-700">Checking access...</div>
      </section>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <ClientSidebar />
      <main className="flex-1 overflow-auto lg:ml-0">
        <div className="lg:pl-0 pl-0">{children}</div>
      </main>
    </div>
  )
}
