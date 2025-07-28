"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
import { Plus, Search, Edit, Trash2, Eye, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "apparel" | "accessories" | "equipment";
  stock: number;
  featured: boolean;
  status: "active" | "inactive";
  createdAt: string;
}

const productSchema = z.object({
  name: z.string().min(1, "Tên sản phẩm không được để trống"),
  description: z.string().min(1, "Mô tả không được để trống"),
  price: z.number().min(0, "Giá phải lớn hơn 0"),
  category: z.enum(["apparel", "accessories", "equipment"]),
  stock: z.number().min(0, "Số lượng phải lớn hơn hoặc bằng 0"),
  featured: z.boolean().default(false),
  status: z.enum(["active", "inactive"]),
});

type ProductForm = z.infer<typeof productSchema>;

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Áo thun VSM Running",
    description: "Áo thun chạy bộ chất liệu thoáng mát",
    price: 299000,
    image: "/placeholder.svg?height=200&width=200",
    category: "apparel",
    stock: 50,
    featured: true,
    status: "active",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Giày chạy bộ VSM Pro",
    description: "Giày chạy bộ chuyên nghiệp với công nghệ đệm khí",
    price: 1299000,
    image: "/placeholder.svg?height=200&width=200",
    category: "equipment",
    stock: 25,
    featured: true,
    status: "active",
    createdAt: "2024-01-02T00:00:00Z",
  },
  {
    id: "3",
    name: "Túi đeo chạy bộ",
    description: "Túi đeo nhỏ gọn cho runner",
    price: 199000,
    image: "/placeholder.svg?height=200&width=200",
    category: "accessories",
    stock: 30,
    featured: false,
    status: "active",
    createdAt: "2024-01-03T00:00:00Z",
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const form = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "apparel",
      stock: 0,
      featured: false,
      status: "active",
    },
  });

  useEffect(() => {
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [products, searchTerm]);

  const getCategoryText = (category: string) => {
    switch (category) {
      case "apparel":
        return "Trang phục";
      case "accessories":
        return "Phụ kiện";
      case "equipment":
        return "Thiết bị";
      default:
        return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "apparel":
        return "bg-blue-500";
      case "accessories":
        return "bg-green-500";
      case "equipment":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const onSubmit = async (data: ProductForm) => {
    try {
      if (editingProduct) {
        const updatedProducts = products.map((product) =>
          product.id === editingProduct.id
            ? {
                ...product,
                ...data,
                image: "/placeholder.svg?height=200&width=200",
              }
            : product
        );
        setProducts(updatedProducts);
        toast({
          title: "Cập nhật thành công",
          description: "Sản phẩm đã được cập nhật.",
        });
      } else {
        const newProduct: Product = {
          id: Date.now().toString(),
          ...data,
          image: "/placeholder.svg?height=200&width=200",
          createdAt: new Date().toISOString(),
        };
        setProducts([newProduct, ...products]);
        toast({
          title: "Tạo thành công",
          description: "Sản phẩm mới đã được tạo.",
        });
      }

      setIsDialogOpen(false);
      setEditingProduct(null);
      form.reset();
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        description: "Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      featured: product.featured,
      status: product.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (productId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

    setProducts(products.filter((product) => product.id !== productId));
    toast({
      title: "Xóa thành công",
      description: "Sản phẩm đã được xóa.",
    });
  };

  const handleNewProduct = () => {
    setEditingProduct(null);
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
          <div className="max-w-[2000px] px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">Quản lý sản phẩm</h1>
                  <p className="text-muted-foreground">
                    Quản lý các sản phẩm VSM
                  </p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={handleNewProduct}>
                      <Plus className="mr-2 h-4 w-4" />
                      Thêm sản phẩm
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingProduct
                          ? "Chỉnh sửa sản phẩm"
                          : "Thêm sản phẩm mới"}
                      </DialogTitle>
                    </DialogHeader>

                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                      >
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tên sản phẩm</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Nhập tên sản phẩm"
                                  {...field}
                                />
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
                              <FormLabel>Mô tả</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Nhập mô tả sản phẩm"
                                  rows={3}
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
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Giá (VNĐ)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="0"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="stock"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Số lượng</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="0"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

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
                                    <SelectItem value="apparel">
                                      Trang phục
                                    </SelectItem>
                                    <SelectItem value="accessories">
                                      Phụ kiện
                                    </SelectItem>
                                    <SelectItem value="equipment">
                                      Thiết bị
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Trạng thái</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="active">
                                      Hoạt động
                                    </SelectItem>
                                    <SelectItem value="inactive">
                                      Tạm dừng
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
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
                              <FormLabel className="!mt-0">
                                Sản phẩm nổi bật
                              </FormLabel>
                            </FormItem>
                          )}
                        />

                        <div className="flex justify-end space-x-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                          >
                            Hủy
                          </Button>
                          <Button type="submit">
                            {editingProduct ? "Cập nhật" : "Thêm sản phẩm"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Search */}
              <Card>
                <CardContent className="p-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm kiếm sản phẩm..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Products Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="mr-2 h-5 w-5" />
                    Danh sách sản phẩm ({filteredProducts.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sản phẩm</TableHead>
                        <TableHead>Danh mục</TableHead>
                        <TableHead>Giá</TableHead>
                        <TableHead>Kho</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <img
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div>
                                <div className="font-medium">
                                  {product.name}
                                </div>
                                <div className="text-sm text-muted-foreground line-clamp-1">
                                  {product.description}
                                </div>
                                {product.featured && (
                                  <Badge className="mt-1 bg-yellow-500 text-white">
                                    Nổi bật
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${getCategoryColor(
                                product.category
                              )} text-white`}
                            >
                              {getCategoryText(product.category)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {product.price.toLocaleString("vi-VN")} VNĐ
                          </TableCell>
                          <TableCell>
                            <span
                              className={
                                product.stock > 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {product.stock} sản phẩm
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                product.status === "active"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {product.status === "active"
                                ? "Hoạt động"
                                : "Tạm dừng"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button size="icon" variant="ghost">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleEdit(product)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDelete(product.id)}
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

                  {filteredProducts.length === 0 && (
                    <div className="text-center py-8">
                      <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <p className="mt-2 text-muted-foreground">
                        Không có sản phẩm nào
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
