"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { DashboardSidebar } from "./dashboard-sidebar"
import { DashboardHeader } from "./dashboard-header"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || (user.role !== "admin" && user.role !== "editor"))) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || (user.role !== "admin" && user.role !== "editor")) {
    return null
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="flex">
        <DashboardSidebar />
        <div className="flex-1 ml-64">
          <DashboardHeader />
          <main className="p-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}
