"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Calendar, User, Eye, ArrowRight } from "lucide-react";
import Link from "next/link";

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
}

export default function NewsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockPosts: Post[] = [
      {
        id: "1",
        title: "Hướng dẫn chuẩn bị cho marathon đầu tiên",
        excerpt:
          "5 điều bạn không thể bỏ qua trước khi bắt đầu hành trình 42 km đầu tiên của mình.",
        content: "Nội dung chi tiết về cách chuẩn bị marathon...",
        cover: "/placeholder.svg?height=400&width=600",
        author: "Nguyễn Văn A",
        date: "2024-01-10",
        category: "training",
        views: 1250,
        featured: true,
      },
      {
        id: "2",
        title: "Bí quyết giữ phong độ khi chạy đường dài",
        excerpt:
          "Chuyên gia VSM chia sẻ các tip giúp bạn tránh chấn thương và duy trì hiệu suất.",
        content: "Nội dung chi tiết về cách giữ phong độ...",
        cover: "/placeholder.svg?height=400&width=600",
        author: "Trần Thị B",
        date: "2024-01-08",
        category: "tips",
        views: 980,
        featured: false,
      },
      {
        id: "3",
        title: "Chế độ dinh dưỡng cho vận động viên sinh viên",
        excerpt:
          "Ăn gì để tối ưu hiệu suất và hồi phục nhanh chóng? Hướng dẫn chi tiết từ chuyên gia.",
        content: "Nội dung chi tiết về dinh dưỡng...",
        cover: "/placeholder.svg?height=400&width=600",
        author: "Lê Văn C",
        date: "2024-01-05",
        category: "nutrition",
        views: 756,
        featured: true,
      },
      {
        id: "4",
        title: "Recap VSM Marathon Hà Nội 2023",
        excerpt:
          "Nhìn lại những khoảnh khắc đáng nhớ tại giải chạy lớn nhất năm của VSM.",
        content: "Nội dung chi tiết về sự kiện...",
        cover: "/placeholder.svg?height=400&width=600",
        author: "Phạm Thị D",
        date: "2024-01-03",
        category: "events",
        views: 2100,
        featured: false,
      },
      {
        id: "5",
        title: "Kỹ thuật thở đúng cách khi chạy bộ",
        excerpt:
          "Làm thế nào để thở hiệu quả và tăng sức bền trong quá trình chạy.",
        content: "Nội dung chi tiết về kỹ thuật thở...",
        cover: "/placeholder.svg?height=400&width=600",
        author: "Hoàng Văn E",
        date: "2024-01-01",
        category: "training",
        views: 634,
        featured: false,
      },
    ];
    setPosts(mockPosts);
    setFilteredPosts(mockPosts);
  }, []);

  useEffect(() => {
    let filtered = posts;

    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((post) => post.category === categoryFilter);
    }

    // Sort by date (newest first)
    filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    setFilteredPosts(filtered);
  }, [posts, searchTerm, categoryFilter]);

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

  const featuredPosts = filteredPosts.filter((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => !post.featured);

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-r from-primary/20 to-purple-500/20">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Tin tức <span className="gradient-text">VSM</span>
              </h1>
              {/* <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Cập nhật kiến thức, mẹo hay và hoạt động mới nhất từ cộng đồng chạy bộ sinh viên Việt Nam.
              </p> */}
            </motion.div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm bài viết..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="training">Huấn luyện</SelectItem>
                  <SelectItem value="nutrition">Dinh dưỡng</SelectItem>
                  <SelectItem value="events">Sự kiện</SelectItem>
                  <SelectItem value="tips">Mẹo hay</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8">Bài viết nổi bật</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden">
                      <div className="relative overflow-hidden">
                        <img
                          src={post.cover || "/placeholder.svg"}
                          alt={post.title}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <Badge
                          className={`absolute top-4 left-4 ${getCategoryColor(
                            post.category
                          )} text-white`}
                        >
                          {getCategoryText(post.category)}
                        </Badge>
                        <Badge className="absolute top-4 right-4 bg-yellow-500 text-white">
                          Nổi bật
                        </Badge>
                      </div>

                      <CardHeader>
                        <CardTitle className="group-hover:text-primary transition-colors text-xl">
                          {post.title}
                        </CardTitle>
                        <p className="text-muted-foreground line-clamp-3">
                          {post.excerpt}
                        </p>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {post.author}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(post.date).toLocaleDateString("vi-VN")}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {post.views.toLocaleString()}
                          </div>
                        </div>

                        <Button className="w-full" asChild>
                          <Link href={`/news/${post.id}`}>
                            Đọc tiếp
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Regular Posts */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Tất cả bài viết</h2>
            {regularPosts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground">
                  Không tìm thấy bài viết nào.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden">
                      <div className="relative overflow-hidden">
                        <img
                          src={post.cover || "/placeholder.svg"}
                          alt={post.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <Badge
                          className={`absolute top-4 left-4 ${getCategoryColor(
                            post.category
                          )} text-white`}
                        >
                          {getCategoryText(post.category)}
                        </Badge>
                      </div>

                      <CardHeader>
                        <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </CardTitle>
                        <p className="text-muted-foreground line-clamp-2">
                          {post.excerpt}
                        </p>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {post.author}
                          </div>
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {post.views.toLocaleString()}
                          </div>
                        </div>

                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(post.date).toLocaleDateString("vi-VN")}
                        </div>

                        <Button
                          className="w-full bg-transparent"
                          variant="outline"
                          asChild
                        >
                          <Link href={`/news/${post.id}`}>
                            Đọc tiếp
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
