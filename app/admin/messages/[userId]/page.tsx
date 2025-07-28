"use client"

import { useState, useRef, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { 
  Send, ArrowLeft, MoreVertical, Search, Filter, CheckCheck, 
  Check, Clock, Ban, Flag, Archive, Trash2, Phone, Mail,
  MessageSquare, AlertTriangle, Info, Settings, UserCheck,
  Calendar, MapPin, Star, StarOff
} from "lucide-react"

// Mock users with conversations
const mockUsers = [
  {
    id: "user1",
    name: "Nguyễn Văn An",
    email: "an.nguyen@email.com",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Cảm ơn admin đã hỗ trợ!",
    lastMessageTime: "2024-01-15T10:30:00Z",
    unreadCount: 0,
    status: "active",
    isOnline: false,
    priority: "normal",
    tags: ["registered", "runner"]
  },
  {
    id: "user2", 
    name: "Trần Thị Bình",
    email: "binh.tran@email.com",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Tôi vẫn chưa nhận được email xác nhận",
    lastMessageTime: "2024-01-15T09:15:00Z",
    unreadCount: 2,
    status: "pending",
    isOnline: true,
    priority: "high",
    tags: ["support", "urgent"]
  },
  {
    id: "user3",
    name: "Lê Minh Châu", 
    email: "chau.le@email.com",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Website rất tuyệt vời!",
    lastMessageTime: "2024-01-14T16:20:00Z", 
    unreadCount: 0,
    status: "resolved",
    isOnline: false,
    priority: "low",
    tags: ["feedback", "positive"]
  },
  {
    id: "user4",
    name: "Phạm Đức Duy",
    email: "duy.pham@email.com",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Tôi muốn hủy đăng ký sự kiện",
    lastMessageTime: "2024-01-14T11:45:00Z",
    unreadCount: 1,
    status: "active", 
    isOnline: true,
    priority: "medium",
    tags: ["cancellation", "refund"]
  }
]

// Mock conversation messages
const mockConversations = {
  user1: [
    {
      id: "1",
      sender: "user",
      content: "Chào admin! Tôi muốn hỏi về sự kiện Marathon Hà Nội 2024",
      timestamp: "2024-01-15T08:00:00Z",
      status: "read"
    },
    {
      id: "2", 
      sender: "admin",
      content: "Xin chào! Sự kiện Marathon Hà Nội 2024 sẽ diễn ra vào ngày 15/3/2024. Bạn có thể tham khảo thông tin chi tiết tại trang sự kiện của chúng tôi.",
      timestamp: "2024-01-15T08:05:00Z",
      status: "read"
    },
    {
      id: "3",
      sender: "user", 
      content: "Lệ phí tham gia là bao nhiêu ạ? Và tôi cần chuẩn bị gì?",
      timestamp: "2024-01-15T08:10:00Z",
      status: "read"
    },
    {
      id: "4",
      sender: "admin",
      content: "Lệ phí là 800k bao gồm áo, số báo và medal. Bạn cần có giấy chứng nhận sức khỏe và kinh nghiệm chạy Half Marathon trước đó.",
      timestamp: "2024-01-15T08:15:00Z", 
      status: "read"
    },
    {
      id: "5",
      sender: "user",
      content: "Cảm ơn admin đã hỗ trợ!",
      timestamp: "2024-01-15T10:30:00Z",
      status: "read"
    }
  ],
  user2: [
    {
      id: "1", 
      sender: "user",
      content: "Admin ơi, tôi đã đăng ký sự kiện 5K Fun Run từ tuần trước nhưng chưa nhận được email xác nhận",
      timestamp: "2024-01-15T08:30:00Z",
      status: "read"
    },
    {
      id: "2",
      sender: "admin", 
      content: "Chào bạn! Tôi sẽ kiểm tra hệ thống ngay. Bạn có thể cung cấp email đăng ký không?",
      timestamp: "2024-01-15T08:35:00Z",
      status: "read"
    },
    {
      id: "3",
      sender: "user",
      content: "Email của tôi là binh.tran@email.com ạ",
      timestamp: "2024-01-15T08:40:00Z", 
      status: "read"
    },
    {
      id: "4",
      sender: "user",
      content: "Tôi vẫn chưa nhận được email xác nhận", 
      timestamp: "2024-01-15T09:15:00Z",
      status: "delivered"
    }
  ]
}

export default function AdminMessagePage() {
  const params = useParams()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const userId = params.userId as string
    if (userId && userId !== "new") {
      const user = mockUsers.find(u => u.id === userId)
      setSelectedUser(user)
      setMessages(mockConversations[userId as keyof typeof mockConversations] || [])
    }
  }, [params.userId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = searchTerm === "" || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return

    const message = {
      id: Date.now().toString(),
      sender: "admin",
      content: newMessage,
      timestamp: new Date().toISOString(),
      status: "sent"
    }

    setMessages(prev => [...prev, message])
    setNewMessage("")

    // Update last message in user list
    const userIndex = mockUsers.findIndex(u => u.id === selectedUser.id)
    if (userIndex !== -1) {
      mockUsers[userIndex].lastMessage = newMessage
      mockUsers[userIndex].lastMessageTime = new Date().toISOString()
    }

    // Simulate status update
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, status: "delivered" } : msg
      ))
    }, 1000)
  }

  const handleUserSelect = (user: any) => {
    router.push(`/admin/messages/${user.id}`)
  }

  const handleMarkAsResolved = () => {
    if (selectedUser) {
      const userIndex = mockUsers.findIndex(u => u.id === selectedUser.id)
      if (userIndex !== -1) {
        mockUsers[userIndex].status = "resolved"
        mockUsers[userIndex].unreadCount = 0
        setSelectedUser({...selectedUser, status: "resolved", unreadCount: 0})
      }
    }
  }

  const handleBlockUser = () => {
    if (selectedUser) {
      const userIndex = mockUsers.findIndex(u => u.id === selectedUser.id)
      if (userIndex !== -1) {
        mockUsers[userIndex].status = "blocked"
        setSelectedUser({...selectedUser, status: "blocked"})
      }
    }
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return { label: "Đang hoạt động", color: "bg-green-500", textColor: "text-green-700" }
      case "pending": 
        return { label: "Chờ phản hồi", color: "bg-yellow-500", textColor: "text-yellow-700" }
      case "resolved":
        return { label: "Đã giải quyết", color: "bg-blue-500", textColor: "text-blue-700" }
      case "blocked":
        return { label: "Đã chặn", color: "bg-red-500", textColor: "text-red-700" }
      default:
        return { label: status, color: "bg-gray-500", textColor: "text-gray-700" }
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "medium":
        return <Info className="h-4 w-4 text-yellow-500" />
      case "low":
        return <CheckCheck className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffHours < 1) {
      return "Vừa xong"
    } else if (diffHours < 24) {
      return `${diffHours}h trước`
    } else {
      return date.toLocaleDateString("vi-VN")
    }
  }

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="flex">
        <AdminSidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
        
        <main className={`flex-1 transition-all duration-300 ${isCollapsed ? "ml-16" : "ml-64"}`}>
          <div className="min-h-screen bg-background flex">
            
            {/* Users Sidebar */}
            <div className="w-80 bg-card border-r flex flex-col">
              {/* Header */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Tin nhắn</h2>
                  <Button variant="outline" size="sm" onClick={() => router.push("/admin")}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Về admin
                  </Button>
                </div>
                
                {/* Search */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm người dùng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Đang hoạt động</option>
                  <option value="pending">Chờ phản hồi</option>
                  <option value="resolved">Đã giải quyết</option>
                  <option value="blocked">Đã chặn</option>
                </select>
              </div>

              {/* User List */}
              <div className="flex-1 overflow-y-auto">
                {filteredUsers.map((user) => {
                  const statusConfig = getStatusConfig(user.status)
                  const isSelected = selectedUser?.id === user.id
                  
                  return (
                    <motion.div
                      key={user.id}
                      className={`p-4 border-b cursor-pointer transition-colors ${
                        isSelected 
                          ? "bg-primary/10 border-l-4 border-l-primary" 
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => handleUserSelect(user)}
                      whileHover={{ x: isSelected ? 0 : 4 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {user.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-sm truncate">{user.name}</h3>
                            <div className="flex items-center gap-1">
                              {getPriorityIcon(user.priority)}
                              {user.unreadCount > 0 && (
                                <Badge className="bg-primary text-white text-xs px-2 py-1 min-w-[20px] h-5">
                                  {user.unreadCount}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-xs text-muted-foreground mb-2 truncate">
                            {user.email}
                          </p>
                          
                          <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                            {user.lastMessage}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <Badge className={`${statusConfig.color} text-white text-xs px-2 py-1`}>
                              {statusConfig.label}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(user.lastMessageTime)}
                            </span>
                          </div>
                          
                          {user.tags.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {user.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedUser ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b bg-card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={selectedUser.avatar} />
                          <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <h3 className="font-semibold flex items-center gap-2">
                            {selectedUser.name}
                            {selectedUser.isOnline && (
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            )}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {selectedUser.email}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleMarkAsResolved}>
                          <UserCheck className="h-4 w-4 mr-2" />
                          Đã giải quyết
                        </Button>
                        
                        <Button variant="outline" size="sm">
                          <Star className="h-4 w-4" />
                        </Button>
                        
                        <Button variant="outline" size="sm" onClick={handleBlockUser}>
                          <Ban className="h-4 w-4" />
                        </Button>
                        
                        <Button variant="outline" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* User Info Tags */}
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <Badge className={`${getStatusConfig(selectedUser.status).color} text-white`}>
                        {getStatusConfig(selectedUser.status).label}
                      </Badge>
                      
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        Tham gia từ 2023
                      </div>
                      
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        Hà Nội
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
                    <AnimatePresence>
                      {messages.map((message, index) => {
                        const isAdmin = message.sender === "admin"
                        const isConsecutive = index > 0 && messages[index - 1].sender === message.sender
                        
                        return (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${isAdmin ? "justify-end" : "justify-start"} ${
                              isConsecutive ? "mt-1" : "mt-4"
                            }`}
                          >
                            <div className={`flex gap-2 max-w-[80%] ${isAdmin ? "flex-row-reverse" : "flex-row"}`}>
                              {!isConsecutive && (
                                <Avatar className="h-8 w-8 flex-shrink-0">
                                  <AvatarImage 
                                    src={isAdmin 
                                      ? "/placeholder.svg?height=32&width=32"
                                      : selectedUser.avatar
                                    } 
                                  />
                                  <AvatarFallback className={isAdmin ? "bg-primary text-white" : "bg-gray-200"}>
                                    {isAdmin ? "A" : selectedUser.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              
                              <div className={`${!isConsecutive ? "" : isAdmin ? "mr-10" : "ml-10"}`}>
                                <div
                                  className={`rounded-2xl px-4 py-2 relative ${
                                    isAdmin
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-white border text-gray-900 shadow-sm"
                                  }`}
                                >
                                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                    {message.content}
                                  </p>
                                  
                                  {!isConsecutive && (
                                    <div
                                      className={`absolute top-2 w-3 h-3 rotate-45 ${
                                        isAdmin
                                          ? "bg-primary -right-1"
                                          : "bg-white border-r border-b -left-1"
                                      }`}
                                    />
                                  )}
                                </div>
                                
                                <div className={`flex items-center gap-1 mt-1 text-xs text-muted-foreground ${
                                  isAdmin ? "justify-end" : "justify-start"
                                }`}>
                                  <span>{formatMessageTime(message.timestamp)}</span>
                                  {isAdmin && (
                                    message.status === "read" ? (
                                      <CheckCheck className="h-3 w-3 text-blue-500" />
                                    ) : message.status === "delivered" ? (
                                      <CheckCheck className="h-3 w-3 text-gray-400" />
                                    ) : (
                                      <Check className="h-3 w-3 text-gray-400" />
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </AnimatePresence>

                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="flex gap-2 max-w-[80%]">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={selectedUser.avatar} />
                            <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          
                          <div className="bg-white border rounded-2xl px-4 py-3 relative shadow-sm">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                            </div>
                            <div className="absolute top-2 w-3 h-3 bg-white border-r border-b rotate-45 -left-1" />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t bg-card">
                    <div className="flex items-end gap-3">
                      <div className="flex-1">
                        <Textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Nhập phản hồi..."
                          className="resize-none min-h-[80px] border-2 focus:border-primary"
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault()
                              handleSendMessage()
                            }
                          }}
                        />
                        <div className="mt-2 text-xs text-muted-foreground">
                          Enter để gửi, Shift + Enter để xuống dòng
                        </div>
                      </div>

                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="px-6 py-6"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50/30">
                  <div className="text-center">
                    <MessageSquare className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Chọn cuộc trò chuyện</h3>
                    <p className="text-muted-foreground">
                      Chọn một người dùng từ danh sách để bắt đầu trò chuyện
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
