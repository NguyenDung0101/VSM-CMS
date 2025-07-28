"use client"

import type React from "react"

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
import { Plus, Search, Edit, Trash2, Eye, Download, Upload, FileSpreadsheet } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { mockPosts, type Post } from "@/lib/mock-data"
import { exportPostsToExcel, importFromExcel } from "@/lib/export-utils"

const postSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  excerpt: z.string().min(1, "Mô tả ngắn không được để trống"),
  content: z.string().min(1, "Nội dung không được để trống"),
  category: z.enum(["training", "nutrition", "events", "tips"]),
  featured: z.boolean().default(false),
  tags: z.string().optional(),
})

type PostForm = z.infer<typeof postSchema>

export default function DashboardPostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const { toast } = useToast()

  const form = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      category: "training",
      featured: false,
      tags: "",
    },
  })

  useEffect(() => {
    setPosts(mockPosts)
  }, [])

  useEffect(() => {
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredPosts(filtered)
  }, [posts, searchTerm])

  const getCategoryText = (category: string) => {
    switch (category) {
      case "training":
        return "Huấn luyện"
      case "nutrition":
        return "Dinh dưỡng"
      case "events":
        return "Sự kiện"
      case "tips":
        return "Mẹo hay"
      default:
        return category
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "training":
        return "bg-blue-500"
      case "nutrition":
        return "bg-green-500"
      case "events":
        return "bg-purple-500"
      case "tips":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const onSubmit = async (data: PostForm) => {
    try {
      const tags = data.tags ? data.tags.split(",").map((tag) => tag.trim()) : []

      if (editingPost) {
        // Update existing post
        const updatedPosts = posts.map((post) =>
          post.id === editingPost.id
            ? {
                ...post,
                ...data,
                tags,
                date: new Date().toISOString().split("T")[0],
              }
            : post,
        )
        setPosts(updatedPosts)
        toast({
          title: "Cập nhật thành công",
          description: "Bài viết đã được cập nhật.",
        })
      } else {
        // Create new post
        const newPost: Post = {
          id: Date.now().toString(),
          ...data,
          tags,
          cover: "/placeholder.svg?height=200&width=300",
          author: "Admin",
          authorId: "admin-1",
          date: new Date().toISOString().split("T")[0],
          views: 0,
          likes: 0,
          status: "published",
          commentsCount: 0,
        }
        setPosts([newPost, ...posts])
        toast({
          title: "Tạo thành công",
          description: "Bài viết mới đã được tạo.",
        })
      }

      setIsDialogOpen(false)
      setEditingPost(null)
      form.reset()
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        description: "Vui lòng thử lại sau.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (post: Post) => {
    setEditingPost(post)
    form.reset({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      featured: post.featured,
      tags: post.tags?.join(", ") || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (postId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return

    setPosts(posts.filter((post) => post.id !== postId))
    toast({
      title: "Xóa thành công",
      description: "Bài viết đã được xóa.",
    })
  }

  const handleNewPost = () => {
    setEditingPost(null)
    form.reset()
    setIsDialogOpen(true)
  }

  const handleExport = () => {
    try {
      exportPostsToExcel(filteredPosts)
      toast({
        title: "Xuất thành công",
        description: "Danh sách bài viết đã được xuất ra file Excel.",
      })
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        description: "Không thể xuất file Excel.",
        variant: "destructive",
      })
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    try {
      const data = await importFromExcel(file)

      // Process imported data (this is a simplified example)
      if (data["Bài viết"]) {
        const importedPosts = data["Bài viết"].map((row: any, index: number) => ({
          id: `imported-${Date.now()}-${index}`,
          title: row["Tiêu đề"] || "",
          excerpt: row["Mô tả"] || "",
          content: row["Nội dung"] || "",
          category: "training", // Default category
          author: row["Tác giả"] || "Admin",
          authorId: "admin-1",
          date: new Date().toISOString().split("T")[0],
          views: 0,
          likes: 0,
          featured: false,
          status: "draft" as const,
          tags: row["Tags"] ? row["Tags"].split(", ") : [],
          commentsCount: 0,
          cover: "/placeholder.svg?height=200&width=300",
        }))

        setPosts([...importedPosts, ...posts])
        toast({
          title: "Nhập thành công",
          description: `Đã nhập ${importedPosts.length} bài viết từ file Excel.`,
        })
      }
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        description: "Không thể đọc file Excel. Vui lòng kiểm tra định dạng file.",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
      // Reset input
      event.target.value = ""
    }
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
            <h1 className="text-3xl font-bold">Quản lý bài viết</h1>
            <p className="text-muted-foreground">Tạo và quản lý các bài viết trên website</p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Import Button */}
            <div className="relative">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleImport}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isImporting}
              />
              <Button variant="outline" disabled={isImporting}>
                <Upload className="mr-2 h-4 w-4" />
                {isImporting ? "Đang nhập..." : "Nhập Excel"}
              </Button>
            </div>

            {/* Export Button */}
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Xuất Excel
            </Button>

            {/* Create Post Button */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleNewPost}>
                  <Plus className="mr-2 h-4 w-4" />
                  Tạo bài viết
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingPost ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tiêu đề</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập tiêu đề bài viết" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="excerpt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mô tả ngắn</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Nhập mô tả ngắn" rows={3} {...field} />
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
                            <Textarea placeholder="Nhập nội dung bài viết" rows={10} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Danh mục</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn danh mục" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="training">Huấn luyện</SelectItem>
                                <SelectItem value="nutrition">Dinh dưỡng</SelectItem>
                                <SelectItem value="events">Sự kiện</SelectItem>
                                <SelectItem value="tips">Mẹo hay</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tags (phân cách bằng dấu phẩy)</FormLabel>
                            <FormControl>
                              <Input placeholder="marathon, training, beginner" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 pt-4">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="rounded"
                            />
                          </FormControl>
                          <FormLabel className="!mt-0">Bài viết nổi bật</FormLabel>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-4">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Hủy
                      </Button>
                      <Button type="submit">{editingPost ? "Cập nhật" : "Tạo bài viết"}</Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm bài viết..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Posts Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Danh sách bài viết ({filteredPosts.length})</span>
              <div className="flex items-center space-x-2">
                <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Hỗ trợ xuất/nhập Excel</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Lượt xem</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{post.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">{post.excerpt}</div>
                        {post.featured && <Badge className="mt-1 bg-yellow-500 text-white">Nổi bật</Badge>}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {post.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                            {post.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{post.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getCategoryColor(post.category)} text-white`}>
                        {getCategoryText(post.category)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={post.status === "published" ? "default" : "secondary"}>
                        {post.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                      </Badge>
                    </TableCell>
                    <TableCell>{post.views.toLocaleString()}</TableCell>
                    <TableCell>{new Date(post.date).toLocaleDateString("vi-VN")}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button size="icon" variant="ghost" onClick={() => window.open(`/news/${post.id}`, "_blank")}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleEdit(post)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(post.id)}
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

            {filteredPosts.length === 0 && (
              <div className="text-center py-8">
                <FileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-muted-foreground">Không có bài viết nào</p>
                <p className="text-sm text-muted-foreground">Tạo bài viết mới hoặc nhập từ file Excel</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  )
}
