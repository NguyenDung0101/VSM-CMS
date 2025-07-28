"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, Calendar, Eye, TrendingUp, Activity } from "lucide-react"
import { mockUsers, mockPosts, mockEvents } from "@/lib/mock-data"
import { useAuth } from "@/contexts/auth-context"

interface DashboardStats {
  totalUsers: number
  totalPosts: number
  totalEvents: number
  totalViews: number
  monthlyGrowth: number
  activeUsers: number
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPosts: 0,
    totalEvents: 0,
    totalViews: 0,
    monthlyGrowth: 0,
    activeUsers: 0,
  })

  useEffect(() => {
    // Calculate stats from mock data
    const totalViews = mockPosts.reduce((sum, post) => sum + post.views, 0)
    const activeUsers = mockUsers.filter((u) => u.isActive).length

    setStats({
      totalUsers: mockUsers.length,
      totalPosts: user?.role === "admin" ? mockPosts.length : mockPosts.filter((p) => p.authorId === user?.id).length,
      totalEvents: mockEvents.length,
      totalViews,
      monthlyGrowth: 12.5,
      activeUsers,
    })
  }, [user])

  const statCards = [
    {
      title: "Tổng người dùng",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      show: user?.role === "admin",
    },
    {
      title: user?.role === "admin" ? "Tổng bài viết" : "Bài viết của tôi",
      value: stats.totalPosts.toString(),
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-100",
      show: true,
    },
    {
      title: "Sự kiện",
      value: stats.totalEvents.toString(),
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      show: true,
    },
    {
      title: "Lượt xem",
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      show: true,
    },
    {
      title: "Tăng trưởng tháng",
      value: `${stats.monthlyGrowth}%`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      show: user?.role === "admin",
    },
    {
      title: "Người dùng hoạt động",
      value: stats.activeUsers.toString(),
      icon: Activity,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
      show: user?.role === "admin",
    },
  ].filter((card) => card.show)

  const recentPosts =
    user?.role === "admin" ? mockPosts.slice(0, 5) : mockPosts.filter((p) => p.authorId === user?.id).slice(0, 5)

  const recentUsers = mockUsers.slice(0, 5)

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Chào mừng {user?.name} quay trở lại! Đây là tổng quan về hệ thống VSM.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((card, index) => (
            <Card key={card.title} className="hover:shadow-lg transition-shadow">
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
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Bài viết gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <img
                        src={post.thumbnail || "/placeholder.svg"}
                        alt={post.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div>
                        <p className="font-medium line-clamp-1">{post.title}</p>
                        <p className="text-sm text-muted-foreground">Bởi {post.author.name}</p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">{post.views} lượt xem</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {user?.role === "admin" && (
            <Card>
              <CardHeader>
                <CardTitle>Người dùng mới nhất</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-sm font-medium capitalize">{user.role}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
