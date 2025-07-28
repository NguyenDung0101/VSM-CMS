"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Users,
  MessageCircle,
  Upload,
  Settings,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  ShoppingBag,
  ImageIcon,
  Bell,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  className?: string
}

export function DashboardSidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const navigation = [
    {
      name: "Tổng quan",
      href: "/dashboard",
      icon: LayoutDashboard,
      current: pathname === "/dashboard",
    },
    {
      name: "Bài viết",
      href: "/dashboard/posts",
      icon: FileText,
      current: pathname.startsWith("/dashboard/posts"),
      badge: "12",
    },
    {
      name: "Sự kiện",
      href: "/dashboard/events",
      icon: Calendar,
      current: pathname.startsWith("/dashboard/events"),
      badge: "3",
    },
    {
      name: "Bình luận",
      href: "/dashboard/comments",
      icon: MessageCircle,
      current: pathname.startsWith("/dashboard/comments"),
      badge: "5",
      badgeVariant: "destructive" as const,
    },
    {
      name: "Người dùng",
      href: "/dashboard/users",
      icon: Users,
      current: pathname.startsWith("/dashboard/users"),
    },
    {
      name: "Thống kê",
      href: "/dashboard/analytics",
      icon: BarChart3,
      current: pathname.startsWith("/dashboard/analytics"),
    },
    {
      name: "Sản phẩm",
      href: "/dashboard/products",
      icon: ShoppingBag,
      current: pathname.startsWith("/dashboard/products"),
    },
    {
      name: "Tệp tin",
      href: "/dashboard/uploads",
      icon: Upload,
      current: pathname.startsWith("/dashboard/uploads"),
    },
    {
      name: "Thư viện",
      href: "/dashboard/media",
      icon: ImageIcon,
      current: pathname.startsWith("/dashboard/media"),
    },
    {
      name: "Thông báo",
      href: "/dashboard/notifications",
      icon: Bell,
      current: pathname.startsWith("/dashboard/notifications"),
      badge: "2",
      badgeVariant: "secondary" as const,
    },
  ]

  const secondaryNavigation = [
    {
      name: "Cài đặt",
      href: "/dashboard/settings",
      icon: Settings,
      current: pathname.startsWith("/dashboard/settings"),
    },
  ]

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r bg-background transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className,
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">VSM</span>
            </div>
            <span className="font-semibold">Dashboard</span>
          </Link>
        )}
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href}>
              <Button
                variant={item.current ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  collapsed && "justify-center px-2",
                  item.current && "bg-secondary",
                )}
              >
                <item.icon className={cn("h-4 w-4", !collapsed && "mr-3")} />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{item.name}</span>
                    {item.badge && (
                      <Badge variant={item.badgeVariant || "default"} className="ml-auto h-5 px-1.5 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            </Link>
          ))}
        </nav>

        <Separator className="my-4" />

        <nav className="space-y-2">
          {secondaryNavigation.map((item) => (
            <Link key={item.name} href={item.href}>
              <Button
                variant={item.current ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  collapsed && "justify-center px-2",
                  item.current && "bg-secondary",
                )}
              >
                <item.icon className={cn("h-4 w-4", !collapsed && "mr-3")} />
                {!collapsed && <span className="flex-1 text-left">{item.name}</span>}
              </Button>
            </Link>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      {!collapsed && (
        <div className="border-t p-4">
          <div className="text-xs text-muted-foreground">
            <p>VSM Dashboard v2.0</p>
            <p>© 2024 Vietnam Student Marathon</p>
          </div>
        </div>
      )}
    </div>
  )
}
