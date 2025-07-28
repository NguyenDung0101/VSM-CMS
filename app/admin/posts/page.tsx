"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const postSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  excerpt: z.string().min(1, "Mô tả ngắn không được để trống"),
  content: z.string().min(1, "Nội dung không được để trống"),
  category: z.enum(["training", "nutrition", "events", "tips"]),
  featured: z.boolean().default(false),
});

type PostForm = z.infer<typeof postSchema>;

interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  cover: string;
  author: string;
  date: string;
  category: "training" | "nutrition" | "events" | "tips";
  views: number;
  featured: boolean;
  status: "published" | "draft";
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const form = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      category: "training",
      featured: false,
    },
  });

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockPosts: Post[] = [
      {
        id: "1",
        title: "Hướng dẫn chuẩn bị cho marathon đầu tiên",
        excerpt:
          "5 điều bạn không thể bỏ qua trước khi bắt đầu hành trình 42 km.",
        content: "Nội dung chi tiết...",
        cover: "/placeholder.svg?height=200&width=300",
        author: "Admin",
        date: "2024-01-10",
        category: "training",
        views: 1250,
        featured: true,
        status: "published",
      },
      {
        id: "2",
        title: "Bí quyết giữ phong độ khi chạy đường dài",
        excerpt: "Chuyên gia VSM chia sẻ các tip giúp bạn tránh chấn thương.",
        content: "Nội dung chi tiết...",
        cover: "/placeholder.svg?height=200&width=300",
        author: "Admin",
        date: "2024-01-08",
        category: "tips",
        views: 980,
        featured: false,
        status: "published",
      },
      {
        id: "3",
        title: "Chế độ dinh dưỡng cho vận động viên sinh viên",
        excerpt: "Ăn gì để tối ưu hiệu suất và hồi phục nhanh chóng?",
        content: "Nội dung chi tiết...",
        cover: "/placeholder.svg?height=200&width=300",
        author: "Admin",
        date: "2024-01-05",
        category: "nutrition",
        views: 756,
        featured: true,
        status: "draft",
      },
    ];
    setPosts(mockPosts);
    setFilteredPosts(mockPosts);
  }, []);

  useEffect(() => {
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [posts, searchTerm]);

  const getCategoryText = (category: string) => {
    switch (category) {
      case "training":
        return "Huấn luyện";
      case "nutrition":
        return "Dinh dưỡng";
      case "events":
        return "Sự kiện";
      case "tips":
        return "Mẹo hay";
      default:
        return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "training":
        return "bg-blue-500";
      case "nutrition":
        return "bg-green-500";
      case "events":
        return "bg-purple-500";
      case "tips":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const onSubmit = async (data: PostForm) => {
    try {
      if (editingPost) {
        // Update existing post
        const updatedPosts = posts.map((post) =>
          post.id === editingPost.id
            ? {
                ...post,
                ...data,
                date: new Date().toISOString().split("T")[0],
              }
            : post
        );
        setPosts(updatedPosts);
        toast({
          title: "Cập nhật thành công",
          description: "Bài viết đã được cập nhật.",
        });
      } else {
        // Create new post
        const newPost: Post = {
          id: Date.now().toString(),
          ...data,
          cover: "/placeholder.svg?height=200&width=300",
          author: "Admin",
          date: new Date().toISOString().split("T")[0],
          views: 0,
          status: "published",
        };
        setPosts([newPost, ...posts]);
        toast({
          title: "Tạo thành công",
          description: "Bài viết mới đã được tạo.",
        });
      }

      setIsDialogOpen(false);
      setEditingPost(null);
      form.reset();
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        description: "Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    form.reset({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      featured: post.featured,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (postId: string) => {
    setPosts(posts.filter((post) => post.id !== postId));
    toast({
      title: "Xóa thành công",
      description: "Bài viết đã được xóa.",
    });
  };

  const handleNewPost = () => {
    setEditingPost(null);
    form.reset();
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="flex">
        <AdminSidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
        <main
          className={`flex-1 transition-all duration-300 ${
            isCollapsed ? "ml-16" : "ml-64"
          }`}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">Quản lý bài viết</h1>
                <p className="text-muted-foreground">
                  Tạo và quản lý các bài viết trên website
                </p>
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleNewPost}>
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo bài viết
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingPost ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
                    </DialogTitle>
                  </DialogHeader>

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tiêu đề</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nhập tiêu đề bài viết"
                                {...field}
                              />
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
                              <Textarea
                                placeholder="Nhập mô tả ngắn"
                                rows={3}
                                {...field}
                              />
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
                                placeholder="Nhập nội dung bài viết"
                                rows={10}
                                {...field}
                              />
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
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chọn danh mục" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="training">
                                    Huấn luyện
                                  </SelectItem>
                                  <SelectItem value="nutrition">
                                    Dinh dưỡng
                                  </SelectItem>
                                  <SelectItem value="events">
                                    Sự kiện
                                  </SelectItem>
                                  <SelectItem value="tips">Mẹo hay</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="featured"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 pt-8">
                              <FormControl>
                                <input
                                  type="checkbox"
                                  checked={field.value}
                                  onChange={field.onChange}
                                  className="rounded"
                                />
                              </FormControl>
                              <FormLabel className="!mt-0">
                                Bài viết nổi bật
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-end space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Hủy
                        </Button>
                        <Button type="submit">
                          {editingPost ? "Cập nhật" : "Tạo bài viết"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Search */}
            <Card className="mb-6">
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
                <CardTitle>
                  Danh sách bài viết ({filteredPosts.length})
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
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {post.excerpt}
                            </div>
                            {post.featured && (
                              <Badge className="mt-1 bg-yellow-500 text-white">
                                Nổi bật
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getCategoryColor(
                              post.category
                            )} text-white`}
                          >
                            {getCategoryText(post.category)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              post.status === "published"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {post.status === "published"
                              ? "Đã xuất bản"
                              : "Bản nháp"}
                          </Badge>
                        </TableCell>
                        <TableCell>{post.views.toLocaleString()}</TableCell>
                        <TableCell>
                          {new Date(post.date).toLocaleDateString("vi-VN")}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                window.open(`/news/${post.id}`, "_blank")
                              }
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEdit(post)}
                            >
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
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
