"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { mockComments, mockPosts, type Comment } from "@/lib/mock-data"
import { Search, Check, X, Eye, MessageCircle, Clock, CheckCircle, XCircle } from "lucide-react"

export default function DashboardCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [filteredComments, setFilteredComments] = useState<Comment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setComments(mockComments)
  }, [])

  useEffect(() => {
    let filtered = comments

    // Filter by status
    if (selectedTab !== "all") {
      filtered = filtered.filter((comment) => comment.status === selectedTab)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (comment) =>
          comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          comment.userName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredComments(filtered)
  }, [comments, searchTerm, selectedTab])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Đã duyệt"
      case "pending":
        return "Chờ duyệt"
      case "rejected":
        return "Đã từ chối"
      default:
        return "Không xác định"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      default:
        return <MessageCircle className="h-4 w-4" />
    }
  }

  const handleApproveComment = async (commentId: string) => {
    try {
      const updatedComments = comments.map((comment) =>
        comment.id === commentId ? { ...comment, status: "approved" as const } : comment,
      )
      setComments(updatedComments)

      toast({
        title: "Duyệt thành công",
        description: "Bình luận đã được duyệt và hiển thị công khai",
      })
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        description: "Không thể duyệt bình luận",
        variant: "destructive",
      })
    }
  }

  const handleRejectComment = async (commentId: string) => {
    try {
      const updatedComments = comments.map((comment) =>
        comment.id === commentId ? { ...comment, status: "rejected" as const } : comment,
      )
      setComments(updatedComments)

      toast({
        title: "Từ chối thành công",
        description: "Bình luận đã bị từ chối",
      })
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        description: "Không thể từ chối bình luận",
        variant: "destructive",
      })
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bình luận này?")) return

    try {
      const updatedComments = comments.filter((comment) => comment.id !== commentId)
      setComments(updatedComments)

      toast({
        title: "Xóa thành công",
        description: "Bình luận đã được xóa",
      })
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        description: "Không thể xóa bình luận",
        variant: "destructive",
      })
    }
  }

  const handleViewComment = (comment: Comment) => {
    setSelectedComment(comment)
    setIsDialogOpen(true)
  }

  const getPostTitle = (postId: string) => {
    const post = mockPosts.find((p) => p.id === postId)
    return post?.title || "Bài viết không tồn tại"
  }

  const commentStats = {
    total: comments.length,
    approved: comments.filter((c) => c.status === "approved").length,
    pending: comments.filter((c) => c.status === "pending").length,
    rejected: comments.filter((c) => c.status === "rejected").length,
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div>
          <h1 className="text-3xl font-bold">Quản lý bình luận</h1>
          <p className="text-muted-foreground">Duyệt và quản lý bình luận từ người dùng</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageCircle className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Tổng số</p>
                  <p className="text-2xl font-bold">{commentStats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Đã duyệt</p>
                  <p className="text-2xl font-bold">{commentStats.approved}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Chờ duyệt</p>
                  <p className="text-2xl font-bold">{commentStats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Đã từ chối</p>
                  <p className="text-2xl font-bold">{commentStats.rejected}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm bình luận..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Comments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách bình luận</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">Tất cả ({commentStats.total})</TabsTrigger>
                <TabsTrigger value="pending">Chờ duyệt ({commentStats.pending})</TabsTrigger>
                <TabsTrigger value="approved">Đã duyệt ({commentStats.approved})</TabsTrigger>
                <TabsTrigger value="rejected">Đã từ chối ({commentStats.rejected})</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedTab} className="mt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Người dùng</TableHead>
                      <TableHead>Nội dung</TableHead>
                      <TableHead>Bài viết</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead>Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredComments.map((comment) => (
                      <TableRow key={comment.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={comment.userAvatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {comment.userName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{comment.userName}</p>
                              <p className="text-sm text-muted-foreground">ID: {comment.userId}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="line-clamp-2 text-sm">{comment.content}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="line-clamp-1 text-sm font-medium">{getPostTitle(comment.postId)}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(comment.status)} text-white`}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(comment.status)}
                              <span>{getStatusText(comment.status)}</span>
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(comment.createdAt).toLocaleDateString("vi-VN")}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button size="icon" variant="ghost" onClick={() => handleViewComment(comment)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {comment.status === "pending" && (
                              <>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleApproveComment(comment.id)}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleRejectComment(comment.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {comment.status === "approved" && (
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleRejectComment(comment.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                            {comment.status === "rejected" && (
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleApproveComment(comment.id)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredComments.length === 0 && (
                  <div className="text-center py-8">
                    <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-2 text-muted-foreground">Không có bình luận nào</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Comment Detail Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Chi tiết bình luận</DialogTitle>
            </DialogHeader>

            {selectedComment && (
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarImage src={selectedComment.userAvatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {selectedComment.userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{selectedComment.userName}</h3>
                      <Badge className={`${getStatusColor(selectedComment.status)} text-white`}>
                        {getStatusText(selectedComment.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {new Date(selectedComment.createdAt).toLocaleString("vi-VN")}
                    </p>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p>{selectedComment.content}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Bài viết:</h4>
                  <p className="text-sm text-muted-foreground">{getPostTitle(selectedComment.postId)}</p>
                </div>

                <div className="flex justify-end space-x-4">
                  {selectedComment.status === "pending" && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => {
                          handleRejectComment(selectedComment.id)
                          setIsDialogOpen(false)
                        }}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Từ chối
                      </Button>
                      <Button
                        onClick={() => {
                          handleApproveComment(selectedComment.id)
                          setIsDialogOpen(false)
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Duyệt
                      </Button>
                    </>
                  )}
                  {selectedComment.status === "approved" && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleRejectComment(selectedComment.id)
                        setIsDialogOpen(false)
                      }}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Từ chối
                    </Button>
                  )}
                  {selectedComment.status === "rejected" && (
                    <Button
                      onClick={() => {
                        handleApproveComment(selectedComment.id)
                        setIsDialogOpen(false)
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Duyệt
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </DashboardLayout>
  )
}
