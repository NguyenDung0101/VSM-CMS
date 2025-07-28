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
import { Search, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: "apparel" | "accessories" | "equipment";
  rating: number;
  reviews: number;
  inStock: boolean;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockProducts: Product[] = [
      {
        id: "1",
        name: "SÂM CHẠY BỘ VSM",
        description: "Nhân sâm đen đến từ Mỹ",
        price: 350000,
        originalPrice: 499000,
        image: "img/store/coming.png",
        category: "apparel",
        rating: 4.8,
        reviews: 124,
        inStock: false,
      },
    ];
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);

  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (product) => product.category === categoryFilter
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, categoryFilter, sortBy]);

  const getCategoryText = (category: string) => {
    switch (category) {
      case "apparel":
        return "Sắp ra mắt";
      case "accessories":
        return "Phụ kiện";
      case "equipment":
        return "Thiết bị";
      default:
        return category;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

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
                VSM <span className="gradient-text">Store</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Khám phá bộ sưu tập sản phẩm chạy bộ chất lượng cao được thiết
                kế đặc biệt cho cộng đồng VSM.
              </p>
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
                  placeholder="Tìm kiếm sản phẩm..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="apparel">Trang phục</SelectItem>
                    <SelectItem value="accessories">Phụ kiện</SelectItem>
                    <SelectItem value="equipment">Thiết bị</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sắp xếp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Tên A-Z</SelectItem>
                    <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                    <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
                    <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16">
          <div className="container mx-auto px-9">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground">
                  Không tìm thấy sản phẩm nào.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden">
                      <div className="relative overflow-hidden">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.originalPrice && (
                          <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                            -
                            {Math.round(
                              (1 - product.price / product.originalPrice) * 100
                            )}
                            %
                          </Badge>
                        )}
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge variant="secondary">Hết hàng</Badge>
                          </div>
                        )}
                      </div>

                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">
                            {getCategoryText(product.category)}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">
                              {product.rating}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              ({product.reviews})
                            </span>
                          </div>
                        </div>
                        <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                          {product.name}
                        </CardTitle>
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {product.description}
                        </p>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-primary">
                              {formatPrice(product.price)}
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            className="flex-1"
                            asChild={product.inStock}
                            disabled={!product.inStock}
                          >
                            {product.inStock ? (
                              <Link href={`/shop/${product.id}`}>
                                Xem chi tiết
                              </Link>
                            ) : (
                              <span>Hết hàng</span>
                            )}
                          </Button>
                          {product.inStock && (
                            <Button size="icon" variant="outline">
                              <ShoppingCart className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
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
