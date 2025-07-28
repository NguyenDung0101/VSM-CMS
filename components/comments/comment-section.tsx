"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { MessageCircle, Reply, Heart, Flag, Send } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { mockComments, type Comment } from "@/lib/mock-data"
import Link from "next/link"

const commentSchema = z.object({
  content: z.string().min(1, "Nội dung bình luận không được để trống"),
})

type CommentForm = z.infer<typeof commentSchema>

interface CommentSectionProps {
  postId: string
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [comments, setComments] = useState<Comment[]>([])
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  const form = useForm<CommentForm>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  })

  const replyForm = useForm<CommentForm>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  })

  useEffect(() => {
    // Filter comments for this post
    const postComments = mockComments.filter((comment) => comment.postId === postId)
    setComments(postComments)
  }, [postId])

  const onSubmit = async (data: CommentForm) => {
    if (!user) {
      toast({
        title: "Vui lòng đăng nhập",
        description: "Bạn cần đăng nhập để bình luận.",
        variant: "destructive",
      })
      return
    }

    try {
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        postId,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        content: data.content,
        createdAt: new Date().toISOString(),
        status: "pending",
      }

      setComments([newComment, ...comments])
      form.reset()

      toast({
        title: "Bình luận thành công",
        description: "Bình luận của bạn đang chờ duyệt.",
      })
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        description: "Không thể gửi bình luận. Vui lòng thử lại.",
        variant: "destructive",
      })
    }
  }

  const onReplySubmit = async (data: CommentForm) => {
    if (!user || !replyingTo) return

    try {
      const newReply: Comment = {
        id: `reply-${Date.now()}`,
        postId,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        content: data.content,
        createdAt: new Date().toISOString(),
        status: "pending",
        parentId: replyingTo,
      }

      setComments([newReply, ...comments])
      replyForm.reset()
      setReplyingTo(null)

      toast({
        title: "Trả lời thành công",
        description: "Trả lời của bạn đang chờ duyệt.",
      })
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        description: "Không thể gửi trả lời. Vui lòng thử lại.",
        variant: "destructive",
      })
    }
  }

  const approvedComments = comments.filter((comment) => comment.status === "approved")
  const pendingComments = comments.filter((comment) => comment.status === "pending" && comment.userId === user?.id)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="mr-2 h-5 w-5" />
            Bình luận ({approvedComments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Comment Form */}
          {user ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex items-start space-x-3">
                  <img
                    src={user.avatar || "/placeholder.svg?height=40&width=40"}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Viết bình luận của bạn..."
                              rows={3}
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end mt-2">
                      <Button type="submit" size="sm">
                        <Send className="mr-2 h-4 w-4" />
                        Gửi bình luận
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          ) : (
            <div className="text-center py-8 bg-muted/50 rounded-lg">
              <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Đăng nhập để tham gia thảo luận</p>
              <Button asChild>
                <Link href="/login">Đăng nhập</Link>
              </Button>
            </div>
          )}

          {/* Pending Comments */}
          {pendingComments.length > 0 && (
            <div className="mt-6 space-y-4">
              <h4 className="font-medium text-muted-foreground">Bình luận đang chờ duyệt:</h4>
              {pendingComments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200"
                >
                  <img
                    src={comment.userAvatar || "/placeholder.svg?height=40&width=40"}
                    alt={comment.userName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-sm">{comment.userName}</span>
                      <Badge variant="secondary" className="text-xs">
                        Chờ duyệt
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Approved Comments */}
          <div className="mt-6 space-y-6">
            {approvedComments.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
              </div>
            ) : (
              approvedComments.map((comment) => (
                <div key={comment.id} className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <img
                      src={comment.userAvatar || "/placeholder.svg?height=40&width=40"}
                      alt={comment.userName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium">{comment.userName}</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{comment.content}</p>
                      <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                          <Heart className="mr-1 h-4 w-4" />
                          Thích
                        </Button>
                        {user && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-primary"
                            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                          >
                            <Reply className="mr-1 h-4 w-4" />
                            Trả lời
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                          <Flag className="mr-1 h-4 w-4" />
                          Báo cáo
                        </Button>
                      </div>

                      {/* Reply Form */}
                      {replyingTo === comment.id && user && (
                        <div className="mt-4 ml-4 border-l-2 border-muted pl-4">
                          <Form {...replyForm}>
                            <form onSubmit={replyForm.handleSubmit(onReplySubmit)} className="space-y-3">
                              <div className="flex items-start space-x-3">
                                <img
                                  src={user.avatar || "/placeholder.svg?height=32&width=32"}
                                  alt={user.name}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                  <FormField
                                    control={replyForm.control}
                                    name="content"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Textarea
                                            placeholder={`Trả lời ${comment.userName}...`}
                                            rows={2}
                                            className="resize-none"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <div className="flex justify-end space-x-2 mt-2">
                                    <Button type="button" variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>
                                      Hủy
                                    </Button>
                                    <Button type="submit" size="sm">
                                      Trả lời
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </form>
                          </Form>
                        </div>
                      )}

                      {/* Replies */}
                      {comments
                        .filter((reply) => reply.parentId === comment.id && reply.status === "approved")
                        .map((reply) => (
                          <div key={reply.id} className="mt-4 ml-4 border-l-2 border-muted pl-4">
                            <div className="flex items-start space-x-3">
                              <img
                                src={reply.userAvatar || "/placeholder.svg?height=32&width=32"}
                                alt={reply.userName}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="font-medium text-sm">{reply.userName}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(reply.createdAt).toLocaleDateString("vi-VN")}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700">{reply.content}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
