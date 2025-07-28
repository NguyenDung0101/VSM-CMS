"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, Save, Eye, Upload, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { mockPosts, type Post } from "@/lib/mock-data"
import Link from "next/link"

const postSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  description: z.string().min(1, "Mô tả không được để trống"),
  content: z.string().min(1, "Nội dung không được để trống"),
  thumbnail: z.string().optional(),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
})

type PostForm = z.infer<typeof postSchema>

export default function EditPostPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [post, setPost] = useState<Post | null>(null)
  const [newTag, setNewTag] = useState("")
  const [isPreview, setIsPreview] = useState(false)
  const [loading, setLoading] = useState(true)

  const form = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      thumbnail: "",
      tags: [],
      published: false,
    },
  })

  const watchedValues = form.watch()

  useEffect(() => {
    const postId = params.id as string
    const foundPost = mockPosts.find((p) => p.id === postId)

    if (!foundPost) {
      toast({
        title: "Không tìm thấy bài viết",
        description: "Bài viết không tồn tại hoặc đã bị xóa.",
        variant: "destructive",
      })
      router.push("/dashboard/posts")
      return
    }

    // Check permission
    if (user?.role !== "admin" && foundPost.authorId !== user?.id) {
      toast({
        title: "Không có quyền truy cập",
        description: "Bạn chỉ có thể chỉnh sửa bài viết của mình.",
        variant: "destructive",
      })
      router.push("/dashboard/posts")
      return
    }

    setPost(foundPost)
    form.reset({
      title: foundPost.title,
      description: foundPost.description,
      content: foundPost.content,
      thumbnail: foundPost.thumbnail,
      tags: foundPost.tags,
      published: foundPost.published,
    })
    setLoading(false)
  }, [params.id, user, form, router, toast])

  const onSubmit = async (data: PostForm) => {
    try {
      if (!user || !post) throw new Error("Dữ liệu không hợp lệ")

      const updatedPost: Post = {
        ...post,
        ...data,
        updatedAt: new Date().toISOString(),
      }

      // Update mock data
      const postIndex = mockPosts.findIndex((p) => p.id === post.id)
      if (postIndex !== -1) {
        mockPosts[postIndex] = updatedPost
      }

      toast({
        title: "Cập nhật thành công",
        description: `Bài viết đã được ${data.published ? "xuất bản" : "lưu dưới dạng bản nháp"}.`,
      })

      router.push("/dashboard/posts")
    } catch (error: any) {
      toast({
        title: "Có lỗi xảy ra",
        description: error.message || "Vui lòng thử lại sau.",
        variant: "destructive",
      })
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !watchedValues.tags.includes(newTag.trim())) {
      form.setValue("tags", [...watchedValues.tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    form.setValue(
      "tags",
      watchedValues.tags.filter((tag) => tag !== tagToRemove),
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!post) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/dashboard/posts">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Chỉnh sửa bài viết</h1>
              <p className="text-muted-foreground">Cập nhật nội dung bài viết của bạn</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => setIsPreview(!isPreview)}>
              <Eye className="mr-2 h-4 w-4" />
              {isPreview ? "Chỉnh sửa" : "Xem trước"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{isPreview ? "Xem trước bài viết" : "Nội dung bài viết"}</CardTitle>
              </CardHeader>
              <CardContent>
                {isPreview ? (
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-3xl font-bold mb-4">{watchedValues.title || "Tiêu đề bài viết"}</h1>
                      <p className="text-lg text-muted-foreground mb-6">
                        {watchedValues.description || "Mô tả bài viết"}
                      </p>
                      {watchedValues.thumbnail && (
                        <img
                          src={watchedValues.thumbnail || "/placeholder.svg"}
                          alt="Thumbnail"
                          className="w-full h-64 object-cover rounded-lg mb-6"
                        />
                      )}
                      <div className="prose max-w-none">
                        {watchedValues.content.split("\n").map((paragraph, index) => (
                          <p key={index} className="mb-4">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tiêu đề</FormLabel>
                            <FormControl>
                              <Input placeholder="Nhập tiêu đề bài viết..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mô tả ngắn</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Nhập mô tả ngắn về bài viết..." rows={3} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="thumbnail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ảnh đại diện (URL)</FormLabel>
                            <FormControl>
                              <div className="flex space-x-2">
                                <Input placeholder="https://example.com/image.jpg" {...field} />
                                <Button type="button" variant="outline">
                                  <Upload className="h-4 w-4" />
                                </Button>
                              </div>
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
                            <FormLabel>Nội dung</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Viết nội dung bài viết của bạn..."
                                rows={15}
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end space-x-4">
                        <Button type="submit" variant="outline" onClick={() => form.setValue("published", false)}>
                          <Save className="mr-2 h-4 w-4" />
                          Lưu nháp
                        </Button>
                        <Button type="submit" onClick={() => form.setValue("published", true)}>
                          <Save className="mr-2 h-4 w-4" />
                          Xuất bản
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Thêm tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Button type="button" onClick={handleAddTag} size="sm">
                    Thêm
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {watchedValues.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                      <span>{tag}</span>
                      <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Preview Thumbnail */}
            {watchedValues.thumbnail && (
              <Card>
                <CardHeader>
                  <CardTitle>Ảnh đại diện</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={watchedValues.thumbnail || "/placeholder.svg"}
                    alt="Thumbnail preview"
                    className="w-full h-32 object-cover rounded"
                  />
                </CardContent>
              </Card>
            )}

            {/* Post Info */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin bài viết</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Tác giả:</span> {post.author.name}
                </div>
                <div>
                  <span className="text-muted-foreground">Ngày tạo:</span>{" "}
                  {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                </div>
                <div>
                  <span className="text-muted-foreground">Cập nhật:</span>{" "}
                  {new Date(post.updatedAt).toLocaleDateString("vi-VN")}
                </div>
                <div>
                  <span className="text-muted-foreground">Lượt xem:</span> {post.views.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
