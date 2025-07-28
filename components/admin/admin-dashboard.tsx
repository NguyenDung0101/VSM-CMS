"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, FileText, ShoppingBag, TrendingUp, Eye } from "lucide-react"

interface DashboardStats {
  totalUsers: number
  totalEvents: number
  totalPosts: number
  totalProducts: number
  monthlyGrowth: number
  totalViews: number
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalEvents: 0,
    totalPosts: 0,
    totalProducts: 0,
    monthlyGrowth: 0,
    totalViews: 0,
  })

  useEffect(() => {
    // Mock data - replace with actual API call
    setStats({
      totalUsers: 5247,
      totalEvents: 24,
      totalPosts: 156,
      totalProducts: 89,
      monthlyGrowth: 12.5,
      totalViews: 125430,
    })
  }, [])

  const statCards = [
    {
      title: "Tổng người dùng",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Sự kiện",
      value: stats.totalEvents.toString(),
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Bài viết",
      value: stats.totalPosts.toString(),
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Sản phẩm",
      value: stats.totalProducts.toString(),
      icon: ShoppingBag,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Tăng trưởng tháng",
      value: `${stats.monthlyGrowth}%`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Lượt xem",
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Tổng quan về hệ thống VSM</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                <div className={`p-2 rounded-full ${card.bgColor}`}>
                  <card.icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sự kiện gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "VSM Marathon Hà Nội 2024", date: "15/03/2024", participants: 1250 },
                { name: "VSM Fun Run TP.HCM", date: "28/02/2024", participants: 800 },
                { name: "VSM Trail Run Đà Lạt", date: "20/04/2024", participants: 300 },
              ].map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{event.name}</p>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                  </div>
                  <div className="text-sm font-medium">{event.participants} người</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bài viết mới nhất</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: "Hướng dẫn chuẩn bị cho marathon", author: "Admin", date: "10/01/2024" },
                { title: "Lợi ích của việc chạy bộ", author: "Admin", date: "08/01/2024" },
                { title: "Kỹ thuật chạy đúng cách", author: "Admin", date: "05/01/2024" },
              ].map((post, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{post.title}</p>
                    <p className="text-sm text-muted-foreground">Bởi {post.author}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">{post.date}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
