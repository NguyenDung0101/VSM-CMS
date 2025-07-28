"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Post {
  id: string
  title: string
  excerpt: string
  cover: string
  date: string
}

export function NewsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    // TODO: replace with real API
    setPosts([
      {
        id: "1",
        title: "Hướng dẫn chuẩn bị cho marathon đầu tiên",
        excerpt: "5 điều bạn không thể bỏ qua trước khi bắt đầu hành trình 42 km.",
        cover: "/placeholder.svg?height=300&width=400",
        date: "10/01/2024",
      },
      {
        id: "2",
        title: "Bí quyết giữ phong độ khi chạy đường dài",
        excerpt: "Chuyên gia VSM chia sẻ các tip giúp bạn tránh chấn thương.",
        cover: "/placeholder.svg?height=300&width=400",
        date: "08/01/2024",
      },
      {
        id: "3",
        title: "Chế độ dinh dưỡng cho vận động viên sinh viên",
        excerpt: "Ăn gì để tối ưu hiệu suất và hồi phục nhanh chóng?",
        cover: "/placeholder.svg?height=300&width=400",
        date: "05/01/2024",
      },
    ])
  }, [])

  return (
    <section ref={ref} className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Tin tức <span className="gradient-text">mới nhất</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Cập nhật kiến thức và hoạt động mới nhất từ cộng đồng VSM.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {posts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
            >
              <Card className="group hover:shadow-xl transition-shadow h-full overflow-hidden">
                <img
                  src={post.cover || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <CardHeader>
                  <CardTitle className="group-hover:text-primary transition-colors">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                  <Button variant="link" className="p-0" asChild>
                    <Link href={`/news/${post.id}`}>
                      Đọc thêm <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <Button size="lg" variant="outline" asChild>
            <Link href="/news">
              Xem tất cả bài viết
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
