"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Search, Filter, Eye, MessageCircle, Clock, CheckCircle, 
  XCircle, AlertCircle, Mail, Phone, Calendar, User,
  FileText, Send, Archive, Trash2, MoreHorizontal,
  Download, RefreshCw
} from "lucide-react"

// Mock data for contact messages
const mockContactMessages = [
  {
    id: "1",
    name: "Nguyễn Văn An",
    email: "an.nguyen@email.com",
    phone: "0901234567",
    subject: "Hỏi về sự kiện Marathon Hà Nội 2024",
    message: "Chào admin, tôi muốn hỏi về thời gian đăng ký và lệ phí tham gia sự kiện Marathon Hà Nội 2024. Tôi là người mới tham gia nên cần tư vấn thêm về chuẩn bị thể lực. Cảm ơn admin!",
    status: "pending",
    priority: "medium",
    createdAt: "2024-01-15T08:30:00Z",
    userId: "user1",
    tags: ["marathon", "registration"],
    adminNote: "",
    response: ""
  },
  {
    id: "2", 
    name: "Trần Thị Bình",
    email: "binh.tran@email.com",
    phone: "0987654321",
    subject: "Khiếu nại về quy trình đăng ký",
    message: "Tôi đã đăng ký sự kiện 5K Fun Run từ tuần trước nhưng chưa nhận được email xác nhận. Tôi đã thử liên hệ qua hotline nhưng không được. Vui lòng kiểm tra giúp tôi.",
    status: "in_progress",
    priority: "high",
    createdAt: "2024-01-14T14:20:00Z",
    userId: "user2",
    tags: ["registration", "support"],
    adminNote: "Đã kiểm tra hệ thống, đang xử lý",
    response: "Chào bạn Bình, chúng tôi đã kiểm tra và sẽ gửi lại email xác nhận trong 24h. Xin lỗi vì sự bất tiện này."
  },
  {
    id: "3",
    name: "Lê Minh Châu", 
    email: "chau.le@email.com",
    phone: "",
    subject: "Góp ý về website",
    message: "Website rất đẹp và dễ sử dụng. Tôi chỉ muốn góp ý là phần đăng ký sự kiện nên có thêm tùy chọn thanh toán bằng ví điện tử. Cảm ơn team đã làm ra sản phẩm tuyệt vời!",
    status: "resolved",
    priority: "low",
    createdAt: "2024-01-13T09:15:00Z",
    userId: "user3",
    tags: ["feedback", "website"],
    adminNote: "Feedback tích cực",
    response: "Cảm ơn bạn Châu đã góp ý! Chúng tôi sẽ cân nhắc thêm tính năng thanh toán ví điện tử trong phiên bản tiếp theo."
  },
  {
    id: "4",
    name: "Phạm Đức Duy",
    email: "duy.pham@email.com", 
    phone: "0912345678",
    subject: "Yêu cầu hủy đăng ký",
    message: "Do có việc đột xuất, tôi cần hủy đăng ký sự kiện Half Marathon ngày 25/1. Tôi đã thanh toán 500k. Vui lòng hỗ trợ hoàn tiền theo quy định. Cảm ơn!",
    status: "pending",
    priority: "medium",
    createdAt: "2024-01-12T16:45:00Z",
    userId: "user4", 
    tags: ["cancellation", "refund"],
    adminNote: "",
    response: ""
  },
  {
    id: "5",
    name: "Võ Thị Lan",
    email: "lan.vo@email.com",
    phone: "0903456789",
    subject: "Thắc mắc về quy định thi đấu",
    message: "Chào admin, tôi muốn hỏi về quy định đồng phục trong sự kiện Marathon. Có bắt buộc phải mặc áo BTC cung cấp không? Tôi có thể mặc áo của sponsor cá nhân được không?",
    status: "closed",
    priority: "low", 
    createdAt: "2024-01-10T11:30:00Z",
    userId: "user5",
    tags: ["rules", "uniform"],
    adminNote: "Đã giải đáp quy định",
    response: "Bạn có thể mặc áo cá nhân, chỉ cần không vi phạm quy định về quảng cáo. Vui lòng tham khảo mục 'Quy định trang phục' trong thể lệ."
  }
]

export default function AdminContactsPage() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<any>(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false)
  const [responseText, setResponseText] = useState("")

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return { 
          label: "Chờ xử lý", 
          color: "bg-yellow-500", 
          icon: Clock,
          textColor: "text-yellow-700"
        }
      case "in_progress":
        return { 
          label: "Đang xử lý", 
          color: "bg-blue-500", 
          icon: MessageCircle,
          textColor: "text-blue-700"
        }
      case "resolved":
        return { 
          label: "Đã giải quyết", 
          color: "bg-green-500", 
          icon: CheckCircle,
          textColor: "text-green-700"
        }
      case "closed":
        return { 
          label: "Đã đóng", 
          color: "bg-gray-500", 
          icon: Archive,
          textColor: "text-gray-700"
        }
      default:
        return { 
          label: status, 
          color: "bg-gray-500", 
          icon: AlertCircle,
          textColor: "text-gray-700"
        }
    }
  }

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "high":
        return { label: "Cao", color: "bg-red-100 text-red-800 border-red-200" }
      case "medium":
        return { label: "Trung bình", color: "bg-yellow-100 text-yellow-800 border-yellow-200" }
      case "low":
        return { label: "Thấp", color: "bg-green-100 text-green-800 border-green-200" }
      default:
        return { label: priority, color: "bg-gray-100 text-gray-800 border-gray-200" }
    }
  }

  // Filter messages
  const filteredMessages = mockContactMessages.filter(message => {
    const matchesStatus = statusFilter === "all" || message.status === statusFilter
    const matchesPriority = priorityFilter === "all" || message.priority === priorityFilter
    const matchesSearch = searchTerm === "" || 
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesStatus && matchesPriority && matchesSearch
  })

  const handleStatusChange = (messageId: string, newStatus: string) => {
    // In real app, this would update the database
    console.log(`Changing status of message ${messageId} to ${newStatus}`)
  }

  const handleSendResponse = () => {
    // In real app, this would send the response
    console.log("Sending response:", responseText)
    setResponseText("")
    setIsResponseDialogOpen(false)
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="flex">
        <AdminSidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
        
        <main className={`flex-1 transition-all duration-300 ${isCollapsed ? "ml-16" : "ml-64"}`}>
          <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-card px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Quản lý liên hệ</h1>
                  <p className="text-muted-foreground">Xử lý các tin nhắn từ người dùng</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Xuất Excel
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Làm mới
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Tổng tin nhắn</p>
                        <p className="text-2xl font-bold">{mockContactMessages.length}</p>
                      </div>
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Mail className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Chờ xử lý</p>
                        <p className="text-2xl font-bold text-yellow-600">
                          {mockContactMessages.filter(m => m.status === "pending").length}
                        </p>
                      </div>
                      <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Clock className="h-4 w-4 text-yellow-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Đang xử lý</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {mockContactMessages.filter(m => m.status === "in_progress").length}
                        </p>
                      </div>
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <MessageCircle className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Đã giải quyết</p>
                        <p className="text-2xl font-bold text-green-600">
                          {mockContactMessages.filter(m => m.status === "resolved").length}
                        </p>
                      </div>
                      <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters and Search */}
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Tìm kiếm theo tên, email, tiêu đề..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border rounded-md text-sm min-w-[140px]"
                    >
                      <option value="all">Tất cả trạng thái</option>
                      <option value="pending">Chờ xử lý</option>
                      <option value="in_progress">Đang xử lý</option>
                      <option value="resolved">Đã giải quyết</option>
                      <option value="closed">Đã đóng</option>
                    </select>

                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="px-3 py-2 border rounded-md text-sm min-w-[140px]"
                    >
                      <option value="all">Tất cả độ ưu tiên</option>
                      <option value="high">Cao</option>
                      <option value="medium">Trung bình</option>
                      <option value="low">Thấp</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Messages List */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Messages List */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        Danh sách tin nhắn ({filteredMessages.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y">
                        {filteredMessages.map((message) => {
                          const statusConfig = getStatusConfig(message.status)
                          const priorityConfig = getPriorityConfig(message.priority)
                          const StatusIcon = statusConfig.icon
                          
                          return (
                            <motion.div
                              key={message.id}
                              className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                                selectedMessage?.id === message.id ? "bg-muted/70" : ""
                              }`}
                              onClick={() => setSelectedMessage(message)}
                              whileHover={{ x: 4 }}
                            >
                              <div className="flex items-start gap-4">
                                <Avatar className="h-10 w-10 flex-shrink-0">
                                  <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                                  <AvatarFallback>{message.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2 mb-2">
                                    <div>
                                      <h3 className="font-medium text-sm">{message.name}</h3>
                                      <p className="text-xs text-muted-foreground">{message.email}</p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                      <Badge className={`text-xs px-2 py-1 ${priorityConfig.color}`}>
                                        {priorityConfig.label}
                                      </Badge>
                                      <Badge className={`${statusConfig.color} text-white text-xs px-2 py-1`}>
                                        {statusConfig.label}
                                      </Badge>
                                    </div>
                                  </div>
                                  
                                  <h4 className="font-medium text-sm mb-1 line-clamp-1">
                                    {message.subject}
                                  </h4>
                                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                    {message.message}
                                  </p>
                                  
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center text-xs text-muted-foreground">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      {new Date(message.createdAt).toLocaleDateString("vi-VN")}
                                    </div>
                                    
                                    {message.tags.length > 0 && (
                                      <div className="flex gap-1">
                                        {message.tags.slice(0, 2).map((tag) => (
                                          <Badge key={tag} variant="outline" className="text-xs">
                                            {tag}
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Message Detail */}
                <div className="lg:col-span-1">
                  <Card className="sticky top-6">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {selectedMessage ? "Chi tiết tin nhắn" : "Chọn tin nhắn"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedMessage ? (
                        <div className="space-y-6">
                          {/* Contact Info */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={`/placeholder.svg?height=48&width=48`} />
                                <AvatarFallback>{selectedMessage.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-medium">{selectedMessage.name}</h3>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {selectedMessage.email}
                                </div>
                                {selectedMessage.phone && (
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <Phone className="h-3 w-3 mr-1" />
                                    {selectedMessage.phone}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Subject & Message */}
                          <div className="space-y-3">
                            <div>
                              <Label className="text-xs font-medium text-muted-foreground">Tiêu đề</Label>
                              <p className="font-medium">{selectedMessage.subject}</p>
                            </div>
                            
                            <div>
                              <Label className="text-xs font-medium text-muted-foreground">Nội dung</Label>
                              <div className="bg-muted/30 rounded-lg p-3 mt-1">
                                <p className="text-sm whitespace-pre-wrap">{selectedMessage.message}</p>
                              </div>
                            </div>
                          </div>

                          {/* Meta Info */}
                          <div className="space-y-2 text-xs text-muted-foreground">
                            <div className="flex items-center justify-between">
                              <span>Ngày gửi:</span>
                              <span>{new Date(selectedMessage.createdAt).toLocaleString("vi-VN")}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Độ ưu tiên:</span>
                              <Badge className={getPriorityConfig(selectedMessage.priority).color}>
                                {getPriorityConfig(selectedMessage.priority).label}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Trạng thái:</span>
                              <Badge className={`${getStatusConfig(selectedMessage.status).color} text-white`}>
                                {getStatusConfig(selectedMessage.status).label}
                              </Badge>
                            </div>
                          </div>

                          {/* Admin Note */}
                          {selectedMessage.adminNote && (
                            <div>
                              <Label className="text-xs font-medium text-muted-foreground">Ghi chú admin</Label>
                              <p className="text-sm mt-1 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                                {selectedMessage.adminNote}
                              </p>
                            </div>
                          )}

                          {/* Response */}
                          {selectedMessage.response && (
                            <div>
                              <Label className="text-xs font-medium text-muted-foreground">Phản hồi</Label>
                              <p className="text-sm mt-1 p-2 bg-green-50 rounded border-l-4 border-green-400">
                                {selectedMessage.response}
                              </p>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="space-y-3 pt-3 border-t">
                            <div className="flex gap-2">
                              <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
                                <DialogTrigger asChild>
                                  <Button size="sm" className="flex-1">
                                    <Send className="h-4 w-4 mr-2" />
                                    Phản hồi
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>Gửi phản hồi</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <Label>Nội dung phản hồi</Label>
                                      <Textarea
                                        value={responseText}
                                        onChange={(e) => setResponseText(e.target.value)}
                                        placeholder="Nhập nội dung phản hồi..."
                                        rows={4}
                                      />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                      <Button variant="outline" onClick={() => setIsResponseDialogOpen(false)}>
                                        Hủy
                                      </Button>
                                      <Button onClick={handleSendResponse}>
                                        <Send className="h-4 w-4 mr-2" />
                                        Gửi
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <select
                                value={selectedMessage.status}
                                onChange={(e) => handleStatusChange(selectedMessage.id, e.target.value)}
                                className="px-2 py-1 border rounded text-xs"
                              >
                                <option value="pending">Chờ xử lý</option>
                                <option value="in_progress">Đang xử lý</option>
                                <option value="resolved">Đã giải quyết</option>
                                <option value="closed">Đã đóng</option>
                              </select>
                              
                              <Button variant="outline" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Mail className="mx-auto h-12 w-12 mb-3" />
                          <p>Chọn một tin nhắn để xem chi tiết</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
