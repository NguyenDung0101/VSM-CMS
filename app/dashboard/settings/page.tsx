"use client"

import { Badge } from "@/components/ui/badge"

import { useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Settings, Globe, Bell, Shield, Database } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

const siteSettingsSchema = z.object({
  siteName: z.string().min(1, "Tên website không được để trống"),
  siteDescription: z.string().min(1, "Mô tả website không được để trống"),
  siteUrl: z.string().url("URL không hợp lệ"),
  contactEmail: z.string().email("Email không hợp lệ"),
  contactPhone: z.string().min(1, "Số điện thoại không được để trống"),
  address: z.string().min(1, "Địa chỉ không được để trống"),
})

const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  newUserNotification: z.boolean(),
  newPostNotification: z.boolean(),
  eventNotification: z.boolean(),
})

const securitySchema = z.object({
  requireEmailVerification: z.boolean(),
  enableTwoFactor: z.boolean(),
  sessionTimeout: z.number().min(15).max(1440),
  maxLoginAttempts: z.number().min(3).max(10),
})

type SiteSettingsForm = z.infer<typeof siteSettingsSchema>
type NotificationForm = z.infer<typeof notificationSchema>
type SecurityForm = z.infer<typeof securitySchema>

export default function SettingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const siteForm = useForm<SiteSettingsForm>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      siteName: "Vietnam Student Marathon",
      siteDescription: "Nơi kết nối cộng đồng chạy bộ sinh viên Việt Nam",
      siteUrl: "https://vsm.org.vn",
      contactEmail: "info@vsm.org.vn",
      contactPhone: "+84 123 456 789",
      address: "Hà Nội, Việt Nam",
    },
  })

  const notificationForm = useForm<NotificationForm>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      newUserNotification: true,
      newPostNotification: true,
      eventNotification: true,
    },
  })

  const securityForm = useForm<SecurityForm>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      requireEmailVerification: true,
      enableTwoFactor: false,
      sessionTimeout: 60,
      maxLoginAttempts: 5,
    },
  })

  useEffect(() => {
    if (user?.role !== "admin") {
      router.push("/dashboard")
    }
  }, [user, router])

  const onSiteSettingsSubmit = async (data: SiteSettingsForm) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Cập nhật thành công",
        description: "Cài đặt website đã được cập nhật.",
      })
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        description: "Vui lòng thử lại sau.",
        variant: "destructive",
      })
    }
  }

  const onNotificationSubmit = async (data: NotificationForm) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Cập nhật thành công",
        description: "Cài đặt thông báo đã được cập nhật.",
      })
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        description: "Vui lòng thử lại sau.",
        variant: "destructive",
      })
    }
  }

  const onSecuritySubmit = async (data: SecurityForm) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Cập nhật thành công",
        description: "Cài đặt bảo mật đã được cập nhật.",
      })
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        description: "Vui lòng thử lại sau.",
        variant: "destructive",
      })
    }
  }

  if (user?.role !== "admin") {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Settings className="mr-3 h-8 w-8" />
            Cài đặt hệ thống
          </h1>
          <p className="text-muted-foreground">Quản lý cài đặt và cấu hình hệ thống VSM</p>
        </div>

        <Tabs defaultValue="site" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="site" className="flex items-center">
              <Globe className="mr-2 h-4 w-4" />
              Website
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center">
              <Bell className="mr-2 h-4 w-4" />
              Thông báo
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              Bảo mật
            </TabsTrigger>
            <TabsTrigger value="backup" className="flex items-center">
              <Database className="mr-2 h-4 w-4" />
              Sao lưu
            </TabsTrigger>
          </TabsList>

          <TabsContent value="site">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="mr-2 h-5 w-5" />
                  Cài đặt website
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...siteForm}>
                  <form onSubmit={siteForm.handleSubmit(onSiteSettingsSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={siteForm.control}
                        name="siteName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tên website</FormLabel>
                            <FormControl>
                              <Input placeholder="Vietnam Student Marathon" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={siteForm.control}
                        name="siteUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>URL website</FormLabel>
                            <FormControl>
                              <Input placeholder="https://vsm.org.vn" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={siteForm.control}
                      name="siteDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mô tả website</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Mô tả ngắn về website..." rows={3} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={siteForm.control}
                        name="contactEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email liên hệ</FormLabel>
                            <FormControl>
                              <Input placeholder="info@vsm.org.vn" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={siteForm.control}
                        name="contactPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Số điện thoại</FormLabel>
                            <FormControl>
                              <Input placeholder="+84 123 456 789" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={siteForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Địa chỉ</FormLabel>
                          <FormControl>
                            <Input placeholder="Hà Nội, Việt Nam" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit">Lưu cài đặt</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Cài đặt thông báo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...notificationForm}>
                  <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Kênh thông báo</h3>

                      <FormField
                        control={notificationForm.control}
                        name="emailNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Email</FormLabel>
                              <FormDescription>Nhận thông báo qua email</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={notificationForm.control}
                        name="pushNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Push Notification</FormLabel>
                              <FormDescription>Nhận thông báo đẩy trên trình duyệt</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={notificationForm.control}
                        name="smsNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">SMS</FormLabel>
                              <FormDescription>Nhận thông báo qua tin nhắn SMS</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Loại thông báo</h3>

                      <FormField
                        control={notificationForm.control}
                        name="newUserNotification"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Người dùng mới</FormLabel>
                              <FormDescription>Thông báo khi có người dùng mới đăng ký</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={notificationForm.control}
                        name="newPostNotification"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Bài viết mới</FormLabel>
                              <FormDescription>Thông báo khi có bài viết mới được đăng</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={notificationForm.control}
                        name="eventNotification"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Sự kiện</FormLabel>
                              <FormDescription>Thông báo về sự kiện sắp diễn ra</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit">Lưu cài đặt</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Cài đặt bảo mật
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...securityForm}>
                  <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-6">
                    <FormField
                      control={securityForm.control}
                      name="requireEmailVerification"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Xác thực email</FormLabel>
                            <FormDescription>Yêu cầu xác thực email khi đăng ký tài khoản mới</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={securityForm.control}
                      name="enableTwoFactor"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Xác thực 2 bước</FormLabel>
                            <FormDescription>Bật xác thực 2 bước cho tài khoản admin</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={securityForm.control}
                        name="sessionTimeout"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Thời gian hết hạn phiên (phút)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="15"
                                max="1440"
                                {...field}
                                onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>Từ 15 phút đến 24 giờ (1440 phút)</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={securityForm.control}
                        name="maxLoginAttempts"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Số lần đăng nhập tối đa</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="3"
                                max="10"
                                {...field}
                                onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>Từ 3 đến 10 lần thử</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit">Lưu cài đặt</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backup">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="mr-2 h-5 w-5" />
                  Sao lưu dữ liệu
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Sao lưu tự động</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Kích hoạt sao lưu tự động</span>
                        <Switch defaultChecked />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Tần suất sao lưu</label>
                        <select className="w-full mt-1 p-2 border border-input rounded-md bg-background">
                          <option value="daily">Hàng ngày</option>
                          <option value="weekly">Hàng tuần</option>
                          <option value="monthly">Hàng tháng</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Số bản sao lưu giữ lại</label>
                        <Input type="number" defaultValue="7" min="1" max="30" className="mt-1" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Sao lưu thủ công</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Tạo bản sao lưu ngay lập tức cho toàn bộ dữ liệu hệ thống.
                      </p>
                      <Button className="w-full">
                        <Database className="mr-2 h-4 w-4" />
                        Tạo bản sao lưu
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Lịch sử sao lưu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { date: "2024-01-15 02:00", size: "245 MB", status: "Thành công" },
                        { date: "2024-01-14 02:00", size: "243 MB", status: "Thành công" },
                        { date: "2024-01-13 02:00", size: "241 MB", status: "Thành công" },
                        { date: "2024-01-12 02:00", size: "238 MB", status: "Lỗi" },
                      ].map((backup, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{backup.date}</p>
                            <p className="text-sm text-muted-foreground">Kích thước: {backup.size}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={backup.status === "Thành công" ? "default" : "destructive"}>
                              {backup.status}
                            </Badge>
                            {backup.status === "Thành công" && (
                              <Button size="sm" variant="outline">
                                Tải xuống
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
