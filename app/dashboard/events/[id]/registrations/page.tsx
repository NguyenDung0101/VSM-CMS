"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Users, Mail, Phone, AlertCircle, CheckCircle, Clock, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api"
import Link from "next/link"

interface Registration {
  id: string
  fullName: string
  email: string
  phone: string
  emergencyContact: string
  medicalConditions?: string
  experience: string
  status: string
  registeredAt: string
  user?: {
    id: string
    name: string
    email: string
    avatar?: string
  }
}

interface Event {
  id: string
  title: string
  date: string
  location: string
  maxParticipants: number
  currentParticipants: number
}

export default function EventRegistrationsPage() {
  const params = useParams()
  const [event, setEvent] = useState<Event | null>(null)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchEventAndRegistrations()
  }, [params.id])

  const fetchEventAndRegistrations = async () => {
    try {
      setLoading(true)
      const [eventResponse, registrationsResponse] = await Promise.all([
        apiClient.getEvent(params.id as string),
        apiClient.getEventRegistrations(params.id as string),
      ])
      setEvent(eventResponse)
      setRegistrations(registrationsResponse)
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể tải thông tin sự kiện",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-500"
      case "PENDING":
        return "bg-yellow-500"
      case "CANCELLED":
        return "bg-red-500"
      case "WAITLIST":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "Đã xác nhận"
      case "PENDING":
        return "Chờ xác nhận"
      case "CANCELLED":
        return "Đã hủy"
      case "WAITLIST":
        return "Danh sách chờ"
      default:
        return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <CheckCircle className="h-4 w-4" />
      case "PENDING":
        return <Clock className="h-4 w-4" />
      case "CANCELLED":
        return <X className="h-4 w-4" />
      case "WAITLIST":
        return <AlertCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const getExperienceText = (experience: string) => {
    switch (experience) {
      case "BEGINNER":
        return "Người mới"
      case "INTERMEDIATE":
        return "Trung bình"
      case "ADVANCED":
        return "Nâng cao"
      default:
        return experience
    }
  }

  const updateRegistrationStatus = async (registrationId: string, newStatus: string) => {
    try {
      await apiClient.updateRegistrationStatus(params.id as string, registrationId, newStatus)

      setRegistrations((prev) => prev.map((reg) => (reg.id === registrationId ? { ...reg, status: newStatus } : reg)))

      toast({
        title: "Cập nhật thành công",
        description: "Trạng thái đăng ký đã được cập nhật.",
      })
    } catch (error: any) {
      toast({
        title: "Có lỗi xảy ra",
        description: error.message || "Không thể cập nhật trạng thái.",
        variant: "destructive",
      })
    }
  }

  const exportRegistrations = () => {
    const csvContent = [
      [
        "Họ tên",
        "Email",
        "Điện thoại",
        "Liên hệ khẩn cấp",
        "Kinh nghiệm",
        "Tình trạng sức khỏe",
        "Trạng thái",
        "Ngày đăng ký",
      ],
      ...registrations.map((reg) => [
        reg.fullName,
        reg.email,
        reg.phone,
        reg.emergencyContact,
        getExperienceText(reg.experience),
        reg.medicalConditions || "",
        getStatusText(reg.status),
        new Date(reg.registeredAt).toLocaleDateString("vi-VN"),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${event?.title}_registrations.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!event) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold">Không tìm thấy sự kiện</h2>
          <p className="text-muted-foreground mt-2">Sự kiện này có thể đã bị xóa hoặc không tồn tại.</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/events">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại danh sách sự kiện
            </Link>
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  const statusCounts = registrations.reduce(
    (acc, reg) => {
      acc[reg.status] = (acc[reg.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" className="mb-4" asChild>
              <Link href="/dashboard/events">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại danh sách sự kiện
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">{event.title}</h1>
            <p className="text-muted-foreground">
              {new Date(event.date).toLocaleDateString("vi-VN")} • {event.location}
            </p>
          </div>
          <Button onClick={exportRegistrations} variant="outline">
            Xuất Excel
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng đăng ký</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{registrations.length}</div>
              <p className="text-xs text-muted-foreground">/ {event.maxParticipants} tối đa</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đã xác nhận</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{statusCounts.CONFIRMED || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chờ xác nhận</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{statusCounts.PENDING || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Danh sách chờ</CardTitle>
              <AlertCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{statusCounts.WAITLIST || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Registrations Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách đăng ký ({registrations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thông tin người đăng ký</TableHead>
                  <TableHead>Liên hệ</TableHead>
                  <TableHead>Kinh nghiệm</TableHead>
                  <TableHead>Tình trạng sức khỏe</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày đăng ký</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map((registration) => (
                  <TableRow key={registration.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{registration.fullName}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {registration.email}
                        </div>
                        {registration.user && (
                          <div className="text-xs text-muted-foreground">Tài khoản: {registration.user.name}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {registration.phone}
                        </div>
                        <div className="text-sm text-muted-foreground">Khẩn cấp: {registration.emergencyContact}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getExperienceText(registration.experience)}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        {registration.medicalConditions ? (
                          <div
                            className="text-sm text-muted-foreground truncate"
                            title={registration.medicalConditions}
                          >
                            {registration.medicalConditions}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Không có</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(registration.status)} text-white`}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(registration.status)}
                          <span>{getStatusText(registration.status)}</span>
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{new Date(registration.registeredAt).toLocaleDateString("vi-VN")}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(registration.registeredAt).toLocaleTimeString("vi-VN")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={registration.status}
                        onValueChange={(value) => updateRegistrationStatus(registration.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Chờ xác nhận</SelectItem>
                          <SelectItem value="CONFIRMED">Xác nhận</SelectItem>
                          <SelectItem value="WAITLIST">Danh sách chờ</SelectItem>
                          <SelectItem value="CANCELLED">Hủy</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {registrations.length === 0 && (
              <div className="text-center py-16">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">Chưa có đăng ký nào</h3>
                <p className="text-muted-foreground">Sự kiện này chưa có người đăng ký tham gia.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  )
}
