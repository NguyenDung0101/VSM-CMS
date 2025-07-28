"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Layout,
  Eye,
  Book,
  ArrowRight,
  Sparkles,
  MousePointer,
  Save,
} from "lucide-react";
import Link from "next/link";

export default function HomepageDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            VSM Homepage Manager Demo
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Quản lý <span className="gradient-text">Homepage</span> dễ dàng
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Một công cụ mạnh mẽ cho phép bạn tùy chỉnh giao diện trang chủ với
            drag-and-drop, chỉnh sửa trực tuyến và preview thời gian thực.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <MousePointer className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>Drag & Drop</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Kéo thả các section để sắp xếp lại thứ tự hiển thị trên trang
                chủ
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Eye className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Xem trước thay đổi ngay lập tức trước khi lưu vào file
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Save className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>Auto Save</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Tự động cập nhật file app/page.tsx sau khi chỉnh sửa
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5" />
                Các tính năng chính
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">✓</Badge>
                <span>Sắp xếp lại thứ tự các section</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">✓</Badge>
                <span>Ẩn/hiện các section</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">✓</Badge>
                <span>Chỉnh sửa nội dung và styling</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">✓</Badge>
                <span>Thêm/xóa section mới</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">✓</Badge>
                <span>Preview thời gian thực</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">✓</Badge>
                <span>Chỉ hoạt động ở chế độ development</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sections có sẵn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Badge variant="outline" className="mr-2 mb-2">
                Hero Section
              </Badge>
              <Badge variant="outline" className="mr-2 mb-2">
                About Section
              </Badge>
              <Badge variant="outline" className="mr-2 mb-2">
                Events Section
              </Badge>
              <Badge variant="outline" className="mr-2 mb-2">
                News Section
              </Badge>
              <Badge variant="outline" className="mr-2 mb-2">
                Team Section
              </Badge>
              <Badge variant="outline" className="mr-2 mb-2">
                Gallery Section
              </Badge>
              <Badge variant="outline" className="mr-2 mb-2">
                CTA Section
              </Badge>
              <p className="text-sm text-muted-foreground mt-4">
                Mỗi section có thể được tùy chỉnh về nội dung, styling và media
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" asChild className="px-8 py-4">
            <Link href="/admin/homepage">
              <Layout className="mr-2 h-5 w-5" />
              Mở Homepage Manager
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>

          <Button size="lg" variant="outline" asChild className="px-8 py-4">
            <Link href="/admin/homepage/guide">
              <Book className="mr-2 h-5 w-5" />
              Xem hướng dẫn
            </Link>
          </Button>
        </div>

        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-muted/50">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Bắt đầu thử nghiệm</h3>
              <p className="text-muted-foreground text-sm">
                Truy cập{" "}
                <code className="bg-background px-2 py-1 rounded text-xs">
                  /admin/homepage
                </code>{" "}
                để bắt đầu quản lý giao diện trang chủ của bạn. Công cụ này chỉ
                hoạt động ở chế độ development để đảm bảo an toàn.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
