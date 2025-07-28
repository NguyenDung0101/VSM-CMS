"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, Search, Edit, Trash2, Eye, Calendar, MapPin, Users, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api"
import Link from "next/link"

const eventSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  description: z.string().min(1, "Mô tả không được để trống"),
  content: z.string().optional(),
  date: z.string().min(1, "Ngày tổ chức không được để trống"),
  location: z.string().min(1, "Địa điểm không được để trống"),
  maxParticipants: z.number().min(1, "Số lượng tham gia phải lớn hơn 0"),
  category: z.enum(["MARATHON", "FUN_RUN", "TRAIL_RUN", "NIGHT_RUN"]),
  status: z.enum(["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"]),
  distance: z.string().optional(),
  registrationFee: z.number().optional(),
  requirements: z.string().optional(),
  published: z.boolean().default(false),
})

type EventForm = z.infer<typeof eventSchema>

interface Event {
  id: string
  title: string
  description: string
  content?: string
  date: string
  location: string
  maxParticipants: number
  currentParticipants: number
  category: string
  status: string
  distance?: string
  registrationFee?: number
  requirements?: string
  published: boolean
  author: {
    id: string
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

export default function DashboardEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })
  const { toast } = useToast()

  const form = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      date: "",
      location: "",
      maxParticipants: 100,
      category: "FUN_RUN",
      status: "UPCOMING",
      distance: "",
      registrationFee: 0,
      requirements: "",
      published: false,
    },
  })

  useEffect(() => {
    fetchEvents()
  }, [pagination.page])

  useEffect(() => {
    const filtered = events.filter(
      (event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredEvents(filtered)
  }, [events, searchTerm])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getEvents({
        page: pagination.page,
        limit: pagination.limit,
      })
      setEvents(response.events)
      setPagination(response.pagination)
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể tải danh sách sự kiện",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case "MARATHON":
        return "Marathon"
      case "FUN_RUN":
        return "Fun Run"
      case "TRAIL_RUN":
        return "Trail Run"
      case "NIGHT_RUN":
        return "Night Run"
      default:
        return category
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "MARATHON":
        return "bg-red-500"
      case "FUN_RUN":
        return "bg-blue-500"
      case "TRAIL_RUN":
        return "bg-green-500"
      case "NIGHT_RUN":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return "bg-green-500"
      case "ONGOING":
        return "bg-yellow-500"
      case "COMPLETED":
        return "bg-gray-500"
      case "CANCELLED":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return "Sắp diễn ra"
      case "ONGOING":
        return "Đang diễn ra"
      case "COMPLETED":
        return "Đã kết thúc"
      case "CANCELLED":
        return "Đã hủy"
      default:
        return "Không xác định"
    }
  }

  const onSubmit = async (data: EventForm) => {
    try {
      if (editingEvent) {
        await apiClient.updateEvent(editingEvent.id, data)
        toast({
          title: "Cập nhật thành công",
          description: "Sự kiện đã được cập nhật.",
        })
      } else {
        await apiClient.createEvent(data)
        toast({
          title: "Tạo thành công",
          description: "Sự kiện mới đã được tạo.",
        })
      }

      setIsDialogOpen(false)
      setEditingEvent(null)
      form.reset()
      fetchEvents()
    } catch (error: any) {
      toast({
        title: "Có lỗi xảy ra",
        description: error.message || "Vui lòng thử lại sau.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    form.reset({
      title: event.title,
      description: event.description,
      content: event.content || "",
      date: event.date.split("T")[0], // Format for date input
      location: event.location,
      maxParticipants: event.maxParticipants,
      category: event.category as any,
      status: event.status as any,
      distance: event.distance || "",
      registrationFee: event.registrationFee || 0,
      requirements: event.requirements || "",
      published: event.published,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (eventId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sự kiện này?")) return

    try {
      await apiClient.deleteEvent(eventId)
      toast({
        title: "Xóa thành công",
        description: "Sự kiện đã được xóa.",
      })
      fetchEvents()
    } catch (error: any) {
      toast({
        title: "Có lỗi xảy ra",
        description: error.message || "Không thể xóa sự kiện.",
        variant: "destructive",
      })
    }
  }

  const handleNewEvent = () => {
    setEditingEvent(null)
    form.reset()
    setIsDialogOpen(true)
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
            <h1 className="text-3xl font-bold">Quản lý sự kiện</h1>
            <p className="text-muted-foreground">Tạo và quản lý các sự kiện chạy bộ</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNewEvent}>
                <Plus className="mr-2 h-4 w-4" />
                Tạo sự kiện
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingEvent ? "Chỉnh sửa sự kiện" : "Tạo sự kiện mới"}</DialogTitle>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tiêu đề *</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập tiêu đề sự kiện" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Địa điểm *</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập địa điểm" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mô tả ngắn *</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Nhập mô tả ngắn về sự kiện" rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nội dung chi tiết</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Nhập nội dung chi tiết về sự kiện" rows={6} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ngày tổ chức *</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxParticipants"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số lượng tối đa *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="100"
                              {...field}
                              onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="distance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cự ly</FormLabel>
                          <FormControl>
                            <Input placeholder="5km" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loại sự kiện *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn loại" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="MARATHON">Marathon</SelectItem>
                              <SelectItem value="FUN_RUN">Fun Run</SelectItem>
                              <SelectItem value="TRAIL_RUN">Trail Run</SelectItem>
                              <SelectItem value="NIGHT_RUN">Night Run</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trạng thái *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn trạng thái" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="UPCOMING">Sắp diễn ra</SelectItem>
                              <SelectItem value="ONGOING">Đang diễn ra</SelectItem>
                              <SelectItem value="COMPLETED">Đã kết thúc</SelectItem>
                              <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="registrationFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phí tham gia (VNĐ)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="requirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Yêu cầu tham gia</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Nhập các yêu cầu để tham gia sự kiện" rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="published"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Xuất bản sự kiện</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Cho phép người dùng xem và đăng ký tham gia sự kiện
                          </div>
                        </div>
                        <FormControl>
                          <input type="checkbox" checked={field.value} onChange={field.onChange} className="h-4 w-4" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Hủy
                    </Button>
                    <Button type="submit">{editingEvent ? "Cập nhật" : "Tạo sự kiện"}</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm sự kiện..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Events Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách sự kiện ({filteredEvents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sự kiện</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Tham gia</TableHead>
                  <TableHead>Ngày tổ chức</TableHead>
                  <TableHead>Xuất bản</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-muted-foreground flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {event.location}
                        </div>
                        {event.distance && (
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {event.distance}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getCategoryColor(event.category)} text-white`}>
                        {getCategoryText(event.category)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(event.status)} text-white`}>
                        {getStatusText(event.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {event.currentParticipants}/{event.maxParticipants}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1 mt-1">
                        <div
                          className="bg-primary h-1 rounded-full"
                          style={{ width: `${(event.currentParticipants / event.maxParticipants) * 100}%` }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>{new Date(event.date).toLocaleDateString("vi-VN")}</TableCell>
                    <TableCell>
                      <Badge variant={event.published ? "default" : "secondary"}>
                        {event.published ? "Đã xuất bản" : "Nháp"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => window.open(`/events/${event.id}`, "_blank")}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" asChild>
                          <Link href={`/dashboard/events/${event.id}/registrations`}>
                            <FileText className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleEdit(event)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(event.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  Hiển thị {(pagination.page - 1) * pagination.limit + 1} đến{" "}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} trong tổng số {pagination.total} sự
                  kiện
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                  >
                    Trước
                  </Button>
                  <div className="text-sm">
                    Trang {pagination.page} / {pagination.pages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.pages}
                  >
                    Sau
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  )
}
