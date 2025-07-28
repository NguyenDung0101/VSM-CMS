"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Layout,
  Upload,
  House,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

const menuItems = [
  { href: "/admin", label: "Thống kê", icon: LayoutDashboard },
  { href: "/admin/homepage", label: "Quản lý trang chủ", icon: Layout },
  { href: "/admin/events", label: "Quản lý sự kiện", icon: Calendar },
  { href: "/admin/posts", label: "Quản lý bài viết", icon: FileText },
  { href: "/admin/products", label: "Quản lý sản phẩm", icon: ShoppingBag },
  { href: "/admin/users", label: "Quản lý người dùng", icon: Users },
  { href: "/admin/uploads", label: "Quản lý thư viện", icon: Upload },
  { href: "/admin/contacts", label: "Quản lý thư liên hệ", icon: Upload },
  { href: "/admin/messages", label: "Quản lý tin nhắn", icon: MessageCircle },
  { href: "/", label: "Về trang chủ", icon: House },
  { href: "/admin/settings", label: "Cài đặt", icon: Settings },
];

interface AdminSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export function AdminSidebar({
  isCollapsed,
  setIsCollapsed,
}: AdminSidebarProps) {
  // const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <motion.div
      className={`fixed left-0 top-0 h-full bg-card border-r z-50 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">VSM</span>
                </div>
                <span className="font-bold">Admin Panel</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={logout}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span className="ml-3">Đăng xuất</span>}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
