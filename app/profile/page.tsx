"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  FileText,
  Calendar,
  Settings,
  Eye,
  Edit,
  Camera,
  User,
  MapPin,
  Clock,
  Mail,
  Phone,
  Trophy,
  Target,
  Activity,
  MessageSquare,
  Heart,
  Share2,
  Download,
  Filter,
  Search,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { mockPosts, mockEvents, mockEventRegistrations } from "@/lib/mock-data";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const profileSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().optional(),
  bio: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function AccountPage() {
  const { user, updateProfile, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [eventFilter, setEventFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      bio: user?.bio || "",
    },
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        bio: user.bio || "",
      });
    }
  }, [user, form]);

  const onSubmit = async (data: ProfileForm) => {
    try {
      await updateProfile(data);
      setIsEditing(false);
      toast({
        title: "Cập nhật thành công",
        description: "Thông tin cá nhân đã được cập nhật.",
      });
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        description: "Không thể cập nhật thông tin.",
        variant: "destructive",
      });
    }
  };

  const handleAvatarChange = async (avatarUrl: string) => {
    try {
      await updateProfile({ avatar: avatarUrl });
      setIsAvatarDialogOpen(false);
      toast({
        title: "Cập nhật thành công",
        description: "Avatar đã được thay đổi.",
      });
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        description: "Không thể cập nhật avatar.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary dark:border-primary-foreground"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Get user's data
  const userPosts = mockPosts.filter((post) => post.authorId === user.id);
  const userRegistrations = mockEventRegistrations.filter(
    (reg) => reg.userId === user.id
  );
  const registeredEvents = mockEvents.filter((event) =>
    userRegistrations.some((reg) => reg.eventId === event.id)
  );

  // Filter events based on status and search
  const filteredEvents = registeredEvents.filter((event) => {
    const registration = userRegistrations.find(
      (reg) => reg.eventId === event.id
    );
    const matchesFilter =
      eventFilter === "all" ||
      (eventFilter === "upcoming" && new Date(event.date) > new Date()) ||
      (eventFilter === "past" && new Date(event.date) <= new Date()) ||
      (eventFilter === "confirmed" && registration?.status === "confirmed");

    const matchesSearch =
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getRoleText = (role: string) => {
    switch (role) {
      case "admin":
        return "Quản trị viên";
      case "editor":
        return "Biên tập viên";
      case "user":
        return "Thành viên";
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500 dark:bg-red-600";
      case "editor":
        return "bg-blue-500 dark:bg-blue-600";
      case "user":
        return "bg-green-500 dark:bg-green-600";
      default:
        return "bg-gray-500 dark:bg-gray-600";
    }
  };

  const getRegistrationStatus = (status: string) => {
    switch (status) {
      case "confirmed":
        return { text: "Đã xác nhận", color: "bg-green-500 dark:bg-green-600" };
      case "pending":
        return {
          text: "Chờ xác nhận",
          color: "bg-yellow-500 dark:bg-yellow-600",
        };
      case "waitlist":
        return {
          text: "Danh sách chờ",
          color: "bg-orange-500 dark:bg-orange-600",
        };
      case "cancelled":
        return { text: "Đã hủy", color: "bg-red-500 dark:bg-red-600" };
      default:
        return { text: status, color: "bg-gray-500 dark:bg-gray-600" };
    }
  };

  // Generate random avatars for selection
  const avatarOptions = [
    "https://randomuser.me/api/portraits/men/1.jpg",
    "https://randomuser.me/api/portraits/women/1.jpg",
    "https://randomuser.me/api/portraits/men/2.jpg",
    "https://randomuser.me/api/portraits/women/2.jpg",
    "https://randomuser.me/api/portraits/men/3.jpg",
    "https://randomuser.me/api/portraits/women/3.jpg",
    "https://randomuser.me/api/portraits/men/4.jpg",
    "https://randomuser.me/api/portraits/women/4.jpg",
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-8 bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 dark:from-primary/20 dark:via-blue-600/20 dark:to-purple-600/20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Profile Header Card */}
              <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                    {/* Avatar Section */}
                    <div className="relative flex-shrink-0">
                      <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-700 shadow-lg">
                        <AvatarImage
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.name}
                        />
                        <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground dark:bg-primary-foreground dark:text-primary">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <Dialog
                        open={isAvatarDialogOpen}
                        onOpenChange={setIsAvatarDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            size="icon"
                            className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 shadow-lg bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                          >
                            <Camera className="h-5 w-5 text-gray-900 dark:text-gray-100" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
                          <DialogHeader>
                            <DialogTitle className="text-gray-900 dark:text-gray-100">
                              Chọn avatar mới
                            </DialogTitle>
                          </DialogHeader>
                          <div className="grid grid-cols-4 gap-4 p-4">
                            {avatarOptions.map((avatar, index) => (
                              <button
                                key={index}
                                onClick={() => handleAvatarChange(avatar)}
                                className="relative group"
                              >
                                <Avatar className="w-16 h-16 hover:ring-2 hover:ring-primary dark:hover:ring-primary-foreground transition-all">
                                  <AvatarImage
                                    src={avatar}
                                    alt={`Avatar ${index + 1}`}
                                  />
                                  <AvatarFallback className="bg-gray-200 dark:bg-gray-700">
                                    #{index + 1}
                                  </AvatarFallback>
                                </Avatar>
                              </button>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1 text-center lg:text-left">
                      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                        {user.name}
                      </h1>
                      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-4">
                        <div className="flex items-center text-muted-foreground dark:text-gray-300">
                          <Mail className="h-4 w-4 mr-2" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center text-muted-foreground dark:text-gray-300">
                            <Phone className="h-4 w-4 mr-2" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6">
                        <Badge
                          className={`${getRoleColor(
                            user.role
                          )} text-white px-3 py-1`}
                        >
                          {getRoleText(user.role)}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="px-3 py-1 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                        >
                          Tham gia từ {new Date(user.createdAt).getFullYear()}
                        </Badge>
                      </div>

                      {user.bio && (
                        <p className="text-muted-foreground dark:text-gray-300 mb-6 max-w-2xl">
                          {user.bio}
                        </p>
                      )}
                    </div>

                    {/* Quick Stats */}
                    <div className="flex lg:flex-col gap-4">
                      <Card className="p-4 text-center min-w-[100px] bg-white dark:bg-gray-800">
                        <div className="text-2xl font-bold text-primary dark:text-primary-foreground">
                          {registeredEvents.length}
                        </div>
                        <div className="text-xs text-muted-foreground dark:text-gray-300">
                          Sự kiện
                        </div>
                      </Card>

                      {(user.role === "admin" || user.role === "editor") && (
                        <Card className="p-4 text-center min-w-[100px] bg-white dark:bg-gray-800">
                          <div className="text-2xl font-bold text-primary dark:text-primary-foreground">
                            {userPosts.length}
                          </div>
                          <div className="text-xs text-muted-foreground dark:text-gray-300">
                            Bài viết
                          </div>
                        </Card>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-6">
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 bg-primary hover:bg-primary/90 dark:bg-primary-foreground dark:hover:bg-primary-foreground/90 text-primary-foreground dark:text-primary"
                    >
                      <Edit className="h-4 w-4" />
                      Chỉnh sửa hồ sơ
                    </Button>

                    {(user.role === "admin" || user.role === "editor") && (
                      <Button
                        variant="outline"
                        asChild
                        className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Link href="/dashboard">
                          <Settings className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      asChild
                      className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Link href="/chat">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Hỗ trợ
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="events" className="space-y-8">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-12 bg-gray-100 dark:bg-gray-800">
                <TabsTrigger
                  value="events"
                  className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                >
                  <Calendar className="h-4 w-4" />
                  Sự kiện ({registeredEvents.length})
                </TabsTrigger>
                <TabsTrigger
                  value="info"
                  className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                >
                  <User className="h-4 w-4" />
                  Thông tin
                </TabsTrigger>
                {(user.role === "admin" || user.role === "editor") && (
                  <TabsTrigger
                    value="posts"
                    className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                  >
                    <FileText className="h-4 w-4" />
                    Bài viết ({userPosts.length})
                  </TabsTrigger>
                )}
                <TabsTrigger
                  value="activity"
                  className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                >
                  <Activity className="h-4 w-4" />
                  Hoạt động
                </TabsTrigger>
              </TabsList>

              {/* Events Tab */}
              <TabsContent value="events" className="space-y-6">
                <Card className="bg-white dark:bg-gray-800">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                        <Calendar className="h-5 w-5 text-primary dark:text-primary-foreground" />
                        Sự kiện đã đăng ký
                      </CardTitle>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-300" />
                          <Input
                            placeholder="Tìm kiếm sự kiện..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-full sm:w-64 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                          />
                        </div>

                        <select
                          value={eventFilter}
                          onChange={(e) => setEventFilter(e.target.value)}
                          className="px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                        >
                          <option value="all">Tất cả</option>
                          <option value="upcoming">Sắp tới</option>
                          <option value="past">Đã qua</option>
                          <option value="confirmed">Đã xác nhận</option>
                        </select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {filteredEvents.length === 0 ? (
                      <div className="text-center py-12">
                        <Calendar className="mx-auto h-16 w-16 text-muted-foreground dark:text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">
                          {searchTerm || eventFilter !== "all"
                            ? "Không tìm thấy sự kiện"
                            : "Chưa có sự kiện nào"}
                        </h3>
                        <p className="text-muted-foreground dark:text-gray-300 mb-6">
                          {searchTerm || eventFilter !== "all"
                            ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
                            : "Khám phá và đăng ký các sự kiện thú vị của VSM"}
                        </p>
                        <Button
                          asChild
                          className="bg-primary hover:bg-primary/90 dark:bg-primary-foreground dark:hover:bg-primary-foreground/90 text-primary-foreground dark:text-primary"
                        >
                          <Link href="/events">Khám phá sự kiện</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="grid gap-6">
                        {filteredEvents.map((event) => {
                          const registration = userRegistrations.find(
                            (reg) => reg.eventId === event.id
                          );
                          const status = getRegistrationStatus(
                            registration?.status || ""
                          );
                          const isUpcoming = new Date(event.date) > new Date();

                          return (
                            <Card
                              key={event.id}
                              className="hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800"
                            >
                              <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                  <div className="md:w-48 flex-shrink-0">
                                    <img
                                      src={
                                        event.image ||
                                        "/placeholder.svg?height=120&width=192"
                                      }
                                      alt={event.name}
                                      className="w-full h-32 object-cover rounded-lg"
                                    />
                                  </div>

                                  <div className="flex-1">
                                    <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                                      <h3 className="text-xl font-bold hover:text-primary dark:hover:text-primary-foreground transition-colors">
                                        <Link href={`/events/${event.id}`}>
                                          {event.name}
                                        </Link>
                                      </h3>
                                      <Badge
                                        className={`${status.color} text-white`}
                                      >
                                        {status.text}
                                      </Badge>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm text-muted-foreground dark:text-gray-300">
                                      <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        {new Date(
                                          event.date
                                        ).toLocaleDateString("vi-VN", {
                                          weekday: "long",
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        })}
                                      </div>
                                      <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-2" />
                                        {new Date(
                                          event.date
                                        ).toLocaleTimeString("vi-VN", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </div>
                                      <div className="flex items-center">
                                        <MapPin className="h-4 w-4 mr-2" />
                                        {event.location}
                                      </div>
                                      <div className="flex items-center">
                                        <User className="h-4 w-4 mr-2" />
                                        {event.currentParticipants}/
                                        {event.maxParticipants} người
                                      </div>
                                    </div>

                                    {registration && (
                                      <div className="text-xs text-muted-foreground dark:text-gray-300 mb-4">
                                        Đăng ký:{" "}
                                        {new Date(
                                          registration.registeredAt
                                        ).toLocaleDateString("vi-VN")}
                                      </div>
                                    )}

                                    <div className="flex flex-wrap gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        asChild
                                        className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                                      >
                                        <Link href={`/events/${event.id}`}>
                                          <Eye className="h-4 w-4 mr-2" />
                                          Xem chi tiết
                                        </Link>
                                      </Button>

                                      {isUpcoming && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                          <Download className="h-4 w-4 mr-2" />
                                          Tải vé
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Profile Info Tab */}
              <TabsContent value="info">
                <Card className="bg-white dark:bg-gray-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                        <User className="h-5 w-5 text-primary dark:text-primary-foreground" />
                        Thông tin cá nhân
                      </CardTitle>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex items-center gap-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Edit className="h-4 w-4" />
                        {isEditing ? "Hủy" : "Chỉnh sửa"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="space-y-6"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-900 dark:text-gray-100">
                                    Họ và tên *
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                                    />
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
                                  <FormLabel className="text-gray-900 dark:text-gray-100">
                                    Email *
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      disabled
                                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-900 dark:text-gray-100">
                                    Số điện thoại
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="Nhập số điện thoại"
                                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-900 dark:text-gray-100">
                                  Giới thiệu bản thân
                                </FormLabel>
                                <FormControl>
                                  <textarea
                                    {...field}
                                    className="w-full min-h-[100px] px-3 py-2 border rounded-md resize-none bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                                    placeholder="Chia sẻ về bản thân, sở thích chạy bộ..."
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="flex justify-end space-x-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsEditing(false)}
                              className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              Hủy
                            </Button>
                            <Button
                              type="submit"
                              className="bg-primary hover:bg-primary/90 dark:bg-primary-foreground dark:hover:bg-primary-foreground/90 text-primary-foreground dark:text-primary"
                            >
                              Lưu thay đổi
                            </Button>
                          </div>
                        </form>
                      </Form>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <div>
                            <label className="text-sm font-medium text-muted-foreground dark:text-gray-300">
                              Họ và tên
                            </label>
                            <p className="text-lg mt-1 text-gray-900 dark:text-gray-100">
                              {user.name}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground dark:text-gray-300">
                              Email
                            </label>
                            <p className="text-lg mt-1 text-gray-900 dark:text-gray-100">
                              {user.email}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground dark:text-gray-300">
                              Số điện thoại
                            </label>
                            <p className="text-lg mt-1 text-gray-900 dark:text-gray-100">
                              {user.phone || "Chưa cập nhật"}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div>
                            <label className="text-sm font-medium text-muted-foreground dark:text-gray-300">
                              Vai trò
                            </label>
                            <p className="text-lg mt-1 text-gray-900 dark:text-gray-100">
                              {getRoleText(user.role)}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground dark:text-gray-300">
                              Ngày tham gia
                            </label>
                            <p className="text-lg mt-1 text-gray-900 dark:text-gray-100">
                              {new Date(user.createdAt).toLocaleDateString(
                                "vi-VN",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground dark:text-gray-300">
                              Giới thiệu
                            </label>
                            <p className="text-lg mt-1 text-gray-900 dark:text-gray-100">
                              {user.bio || "Chưa có giới thiệu"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Posts Tab (for editors/admins) */}
              {(user.role === "admin" || user.role === "editor") && (
                <TabsContent value="posts">
                  <Card className="bg-white dark:bg-gray-800">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                        <FileText className="h-5 w-5 text-primary dark:text-primary-foreground" />
                        Bài viết của tôi ({userPosts.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {userPosts.length === 0 ? (
                        <div className="text-center py-12">
                          <FileText className="mx-auto h-16 w-16 text-muted-foreground dark:text-gray-300 mb-4" />
                          <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">
                            Chưa có bài viết nào
                          </h3>
                          <p className="text-muted-foreground dark:text-gray-300 mb-6">
                            Bắt đầu chia sẻ kiến thức và kinh nghiệm của bạn
                          </p>
                          <Button
                            asChild
                            className="bg-primary hover:bg-primary/90 dark:bg-primary-foreground dark:hover:bg-primary-foreground/90 text-primary-foreground dark:text-primary"
                          >
                            <Link href="/dashboard/posts/create">
                              Tạo bài viết đầu tiên
                            </Link>
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {userPosts.map((post) => (
                            <Card
                              key={post.id}
                              className="hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
                            >
                              <CardContent className="p-4">
                                <div className="flex gap-4">
                                  <img
                                    src={
                                      post.image ||
                                      "/placeholder.svg?height=80&width=80"
                                    }
                                    alt={post.title}
                                    className="w-20 h-20 rounded object-cover flex-shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-medium line-clamp-1 mb-2 text-gray-900 dark:text-gray-100">
                                      {post.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground dark:text-gray-300 line-clamp-2 mb-3">
                                      {post.excerpt}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground dark:text-gray-300">
                                      <span>
                                        {new Date(post.date).toLocaleDateString(
                                          "vi-VN"
                                        )}
                                      </span>
                                      <span className="flex items-center">
                                        <Eye className="mr-1 h-3 w-3" />
                                        {post.views}
                                      </span>
                                      <span className="flex items-center">
                                        <Heart className="mr-1 h-3 w-3" />
                                        {post.likes}
                                      </span>
                                      <Badge
                                        variant={
                                          post.status === "published"
                                            ? "default"
                                            : "secondary"
                                        }
                                        className={
                                          post.status === "published"
                                            ? "bg-primary dark:bg-primary-foreground text-primary-foreground dark:text-primary"
                                            : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        }
                                      >
                                        {post.status === "published"
                                          ? "Đã xuất bản"
                                          : "Bản nháp"}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      asChild
                                      className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                      <Link
                                        href={`/news/${post.id}`}
                                        target="_blank"
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Link>
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      asChild
                                      className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                      <Link
                                        href={`/dashboard/posts/edit/${post.id}`}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Link>
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {/* Activity Tab */}
              <TabsContent value="activity">
                <Card className="bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                      <Activity className="h-5 w-5 text-primary dark:text-primary-foreground" />
                      Hoạt động gần đây
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Activity className="mx-auto h-16 w-16 text-muted-foreground dark:text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">
                        Sắp ra mắt
                      </h3>
                      <p className="text-muted-foreground dark:text-gray-300">
                        Tính năng theo dõi hoạt động đang được phát triển
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
