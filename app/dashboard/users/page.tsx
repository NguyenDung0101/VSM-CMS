"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, Search, Edit, Trash2, UserCheck, UserX, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { mockUsers, type User } from "@/lib/mock-data"
import { useRouter } from "next/navigation"

const userSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  email: z
    .string()
    .email("Email không hợp lệ")
    .refine((email) => email.endsWith("@vsm.org.vn"), "Email phải có đuôi @vsm.org.vn"),
  role: z.enum(["user", "editor", "admin"]),
})

type UserForm = z.infer<typeof userSchema>

export default function UsersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const { toast } = useToast()

  const form = useForm<UserForm>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "user",
    },
  })

  useEffect(() => {
    if (user?.role !== "admin") {
      router.push("/dashboard")
      return
    }
    setUsers(mockUsers)
    setFilteredUsers(mockUsers)
  }, [user, router])

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredUsers(filtered)
  }, [users, searchTerm])

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500"
      case "editor":
        return "bg-blue-500"
      case "user":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case "admin":
        return "Quản trị viên"
      case "editor":
        return "Biên tập viên"
      case "user":
        return "Người dùng"
      default:
        return role
    }
  }

  const generateRandomAvatar = () => {
    const gender = Math.random() > 0.5 ? "men" : "women"
    const id = Math.floor(Math.random() * 99) + 1
    return `https://randomuser.me/api/portraits/${gender}/${id}.jpg`
  }

  const onSubmit = async (data: UserForm) => {
    try {
      if (editingUser) {
        // Update existing user
        const updatedUsers = users.map((user) =>
          user.id === editingUser.id
            ? {
                ...user,
                ...data,
              }
            : user,
        )
        setUsers(updatedUsers)
        toast({
          title: "Cập nhật thành công",
          description: "Thông tin người dùng đã được cập nhật.",
        })
      } else {
        // Create new user
        const newUser: User = {
          id: `user-${Date.now()}`,
          ...data,
          avatar: generateRandomAvatar(),
          createdAt: new Date().toISOString(),
          isActive: true,
        }
        setUsers([newUser, ...users])
        toast({
          title: "Tạo thành công",
          description: "Người dùng mới đã được tạo.",
        })
      }

      setIsDialogOpen(false)
      setEditingUser(null)
      form.reset()
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        description: "Vui lòng thử lại sau.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    form.reset({
      name: user.name,
      email: user.email,
      role: user.role,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (userId: string) => {
    if (userId === user?.id) {
      toast({
        title: "Không thể xóa",
        description: "Bạn không thể xóa tài khoản của chính mình.",
        variant: "destructive",
      })
      return
    }

    if (!confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return

    setUsers(users.filter((user) => user.id !== userId))
    toast({
      title: "Xóa thành công",
      description: "Người dùng đã được xóa.",
    })
  }

  const handleToggleStatus = (userId: string) => {
    const updatedUsers = users.map((user) => (user.id === userId ? { ...user, isActive: !user.isActive } : user))
    setUsers(updatedUsers)

    const targetUser = users.find((u) => u.id === userId)
    toast({
      title: "Cập nhật thành công",
      description: `Tài khoản đã được ${targetUser?.isActive ? "vô hiệu hóa" : "kích hoạt"}.`,
    })
  }

  const handleNewUser = () => {
    setEditingUser(null)
    form.reset()
    setIsDialogOpen(true)
  }

  if (user?.role !== "admin") {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Quản lý người dùng</h1>
            <p className="text-muted-foreground">Tạo và quản lý tài khoản người dùng trong hệ thống</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNewUser}>
                <Plus className="mr-2 h-4 w-4" />
                Tạo người dùng
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingUser ? "Chỉnh sửa người dùng" : "Tạo người dùng mới"}</DialogTitle>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ và tên</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập họ và tên" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="user@vsm.org.vn" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vai trò</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn vai trò" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="user">Người dùng</SelectItem>
                            <SelectItem value="editor">Biên tập viên</SelectItem>
                            <SelectItem value="admin">Quản trị viên</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Hủy
                    </Button>
                    <Button type="submit">{editingUser ? "Cập nhật" : "Tạo người dùng"}</Button>
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
                placeholder="Tìm kiếm người dùng..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Danh sách người dùng ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Người dùng</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.avatar || "/placeholder.svg?height=40&width=40"}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getRoleColor(user.role)} text-white`}>{getRoleText(user.role)}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? "Hoạt động" : "Vô hiệu hóa"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString("vi-VN")}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleToggleStatus(user.id)}
                          title={user.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                        >
                          {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleEdit(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(user.id)}
                          className="text-destructive hover:text-destructive"
                          disabled={user.id === user?.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-muted-foreground">Không có người dùng nào</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
