"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Send, Paperclip, Smile, MoreVertical, Phone, Video,
  Info, ArrowLeft, CheckCheck, Check, Clock, Zap,
  MessageSquare, Headphones, Users
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

// Mock chat messages
const mockMessages = [
  {
    id: "1",
    sender: "admin",
    content: "Xin chào! Tôi là Admin VSM. Tôi có thể giúp gì cho bạn hôm nay?",
    timestamp: "2024-01-15T08:00:00Z",
    status: "read",
    type: "text"
  },
  {
    id: "2", 
    sender: "user",
    content: "Chào admin! Tôi muốn hỏi về việc đăng ký sự kiện Marathon Hà Nội 2024",
    timestamp: "2024-01-15T08:02:00Z",
    status: "read",
    type: "text"
  },
  {
    id: "3",
    sender: "admin", 
    content: "Sự kiện Marathon Hà Nội 2024 sẽ diễn ra vào ngày 15/3/2024. Hiện tại chúng tôi vẫn đang mở đăng ký với giá 800k/người. Bạn có muốn tôi hướng dẫn cách đăng ký không?",
    timestamp: "2024-01-15T08:03:00Z",
    status: "read",
    type: "text"
  },
  {
    id: "4",
    sender: "user",
    content: "Vâng, xin admin hướng dẫn ạ. Tôi cần chuẩn bị gì trước khi đăng ký?",
    timestamp: "2024-01-15T08:05:00Z", 
    status: "read",
    type: "text"
  },
  {
    id: "5",
    sender: "admin",
    content: "Để đăng ký Marathon, bạn cần:\n1. Giấy chứng nhận sức khỏe (trong vòng 6 tháng)\n2. Kinh nghiệm chạy ít nhất 1 Half Marathon\n3. Đóng lệ phí 800k\n4. Điền đầy đủ thông tin cá nhân\n\nBạn có thể truy cập /events để đăng ký ngay!",
    timestamp: "2024-01-15T08:07:00Z",
    status: "delivered",
    type: "text"
  }
]

export default function ChatPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message = {
      id: Date.now().toString(),
      sender: "user",
      content: newMessage,
      timestamp: new Date().toISOString(),
      status: "sending",
      type: "text"
    }

    setMessages(prev => [...prev, message])
    setNewMessage("")

    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, status: "sent" } : msg
      ))
    }, 500)

    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, status: "delivered" } : msg
      ))
    }, 1000)

    // Simulate admin typing and response
    setTimeout(() => {
      setIsTyping(true)
    }, 2000)

    setTimeout(() => {
      setIsTyping(false)
      const adminResponse = {
        id: (Date.now() + 1).toString(),
        sender: "admin",
        content: "Cảm ơn bạn đã liên hệ! Tôi sẽ xem xét và phản hồi sớm nhất có thể.",
        timestamp: new Date().toISOString(),
        status: "read",
        type: "text"
      }
      setMessages(prev => [...prev, adminResponse])
    }, 4000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getMessageStatus = (status: string) => {
    switch (status) {
      case "sending":
        return <Clock className="h-3 w-3 text-muted-foreground" />
      case "sent":
        return <Check className="h-3 w-3 text-muted-foreground" />
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-blue-500" />
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-500" />
      default:
        return null
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      <main className="pt-16">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-xl overflow-hidden"
            style={{ height: "calc(100vh - 140px)" }}
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Link href="/account">
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  </Link>
                  
                  <Avatar className="h-10 w-10 border-2 border-white/30">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback className="bg-white/20 text-white">VSM</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h2 className="font-semibold">Hỗ trợ VSM</h2>
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Đang hoạt động</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                    <Info className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Headphones className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Chào mừng đến với hỗ trợ VSM!</p>
                  <p className="text-xs text-muted-foreground">
                    Chúng tôi sẽ phản hồi trong vòng 15 phút trong giờ hành chính
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: "calc(100% - 200px)" }}>
              <AnimatePresence>
                {messages.map((message, index) => {
                  const isUser = message.sender === "user"
                  const isConsecutive = index > 0 && messages[index - 1].sender === message.sender
                  
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex ${isUser ? "justify-end" : "justify-start"} ${
                        isConsecutive ? "mt-1" : "mt-4"
                      }`}
                    >
                      <div className={`flex gap-2 max-w-[80%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                        {!isConsecutive && (
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage 
                              src={isUser 
                                ? user?.avatar || "/placeholder.svg?height=32&width=32"
                                : "/placeholder.svg?height=32&width=32"
                              } 
                            />
                            <AvatarFallback className={isUser ? "bg-primary text-white" : "bg-gray-200"}>
                              {isUser ? user?.name?.charAt(0) || "U" : "VSM"}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div className={`${!isConsecutive ? "" : isUser ? "mr-10" : "ml-10"}`}>
                          <div
                            className={`rounded-2xl px-4 py-2 relative ${
                              isUser
                                ? "bg-gradient-to-r from-primary to-blue-600 text-white"
                                : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap leading-relaxed">
                              {message.content}
                            </p>
                            
                            {/* Message tail */}
                            {!isConsecutive && (
                              <div
                                className={`absolute top-2 w-3 h-3 rotate-45 ${
                                  isUser
                                    ? "bg-gradient-to-r from-primary to-blue-600 -right-1"
                                    : "bg-gray-100 -left-1"
                                }`}
                              />
                            )}
                          </div>
                          
                          <div className={`flex items-center gap-1 mt-1 text-xs text-muted-foreground ${
                            isUser ? "justify-end" : "justify-start"
                          }`}>
                            <span>{formatTime(message.timestamp)}</span>
                            {isUser && getMessageStatus(message.status)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>

              {/* Typing Indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex justify-start"
                  >
                    <div className="flex gap-2 max-w-[80%]">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback className="bg-gray-200">VSM</AvatarFallback>
                      </Avatar>
                      
                      <div className="bg-gray-100 rounded-2xl px-4 py-3 relative">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        </div>
                        <div className="absolute top-2 w-3 h-3 bg-gray-100 rotate-45 -left-1" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-2 border-t bg-gray-50/50">
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setNewMessage("Tôi muốn hỏi về sự kiện sắp tới")}
                >
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Sự kiện sắp tới
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setNewMessage("Hướng dẫn đăng ký tham gia")}
                >
                  <Users className="h-3 w-3 mr-1" />
                  Hướng dẫn đăng ký
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setNewMessage("Thông tin liên hệ")}
                >
                  <Phone className="h-3 w-3 mr-1" />
                  Thông tin liên hệ
                </Button>
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex items-end gap-3">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  <Paperclip className="h-5 w-5" />
                </Button>
                
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập tin nhắn..."
                    className="resize-none border-2 border-gray-200 focus:border-primary pr-12 py-3 rounded-xl"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="rounded-xl px-6 py-3 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mt-2 text-xs text-muted-foreground text-center">
                Nhấn Enter để gửi, Shift + Enter để xuống dòng
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
