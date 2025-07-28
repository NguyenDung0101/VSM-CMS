"use client"

import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/contexts/auth-context"

export function DashboardHeader() {
  const { user } = useAuth()

  return (
    <header className="bg-background border-b px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Tìm kiếm..." className="pl-10 w-64" />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <ThemeToggle />

          {user && (
            <div className="flex items-center space-x-2">
              <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-8 h-8 rounded-full" />
              <span className="font-medium">{user.name}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
