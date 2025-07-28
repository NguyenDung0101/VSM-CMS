"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  Share2,
  Heart,
  UserPlus,
  CheckCircle,
  Info,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { mockEvents, type Event } from "@/lib/mock-data";

const registrationSchema = z.object({
  fullName: z.string().min(1, "Họ tên không được để trống"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  emergencyContact: z.string().min(10, "Số điện thoại khẩn cấp không hợp lệ"),
  medicalConditions: z.string().optional(),
  experience: z.enum(["beginner", "intermediate", "advanced"]),
});

type RegistrationForm = z.infer<typeof registrationSchema>;

export default function EventDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [event, setEvent] = useState<Event | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  const form = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: user?.name || "",
      email: user?.email || "",
      phone: "",
      emergencyContact: "",
      medicalConditions: "",
      experience: "beginner",
    },
  });

  useEffect(() => {
    const eventId = params.id as string;
    const foundEvent = mockEvents.find((e) => e.id === eventId);
    if (foundEvent) {
      setEvent(foundEvent);
      // Check if user is already registered
      setIsRegistered(foundEvent.registeredUsers.includes(user?.id || ""));
    }
  }, [params.id, user]);

  const onSubmit = async (data: RegistrationForm) => {
    try {
      if (!user || !event) {
        toast({
          title: "Vui lòng đăng nhập",
          description: "Bạn cần đăng nhập để đăng ký tham gia sự kiện.",
          variant: "destructive",
        });
        return;
      }

      // Simulate registration
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update event data
      const updatedEvent = {
        ...event,
        currentParticipants: event.currentParticipants + 1,
        registeredUsers: [...event.registeredUsers, user.id],
      };

      // Update mock data
      const eventIndex = mockEvents.findIndex((e) => e.id === event.id);
      if (eventIndex !== -1) {
        mockEvents[eventIndex] = updatedEvent;
      }

      setEvent(updatedEvent);
      setIsRegistered(true);
      setIsRegistrationOpen(false);

      toast({
        title: "Đăng ký thành công!",
        description:
          "Bạn đã đăng ký tham gia sự kiện thành công. Chúng tôi sẽ liên hệ với bạn sớm.",
      });
    } catch (error) {
      toast({
        title: "Đăng ký thất bại",
        description: "Có lỗi xảy ra, vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isEventFull = event.currentParticipants >= event.maxParticipants;
  const eventDate = new Date(event.date);
  const isEventPast = eventDate < new Date();
  const canRegister = !isEventPast && !isEventFull && !isRegistered;

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Button variant="ghost" className="mb-6" asChild>
                <Link href="/events">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Quay lại danh sách sự kiện
                </Link>
              </Button>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Event Header */}
                  <div>
                    <div className="aspect-video rounded-xl overflow-hidden mb-6">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex items-start justify-between mb-4">
                      <h1 className="text-3xl md:text-4xl font-bold">
                        {event.name}
                      </h1>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="icon">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mb-6">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        {eventDate.toLocaleDateString("vi-VN", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2" />
                        {eventDate.toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        {event.location}
                      </div>
                    </div>

                    {isEventPast && (
                      <div className="bg-muted p-4 rounded-lg mb-6">
                        <div className="flex items-center">
                          <Info className="h-5 w-5 text-muted-foreground mr-2" />
                          <span className="text-muted-foreground">
                            Sự kiện này đã kết thúc
                          </span>
                        </div>
                      </div>
                    )}

                    {isRegistered && (
                      <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                          <span className="text-green-800 font-medium">
                            Bạn đã đăng ký tham gia sự kiện này
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Event Description */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Về sự kiện</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none">
                        <p>{event.description}</p>

                        <h3>Thông tin chi tiết</h3>
                        <ul>
                          <li>
                            Thời gian tập trung:{" "}
                            {eventDate.toLocaleTimeString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </li>
                          <li>Địa điểm: {event.location}</li>
                          <li>
                            Số lượng tham gia tối đa: {event.maxParticipants}{" "}
                            người
                          </li>
                          <li>Phí tham gia: Miễn phí</li>
                        </ul>

                        <h3>Yêu cầu tham gia</h3>
                        <ul>
                          <li>Độ tuổi từ 16 trở lên</li>
                          <li>Có sức khỏe tốt, không có bệnh lý tim mạch</li>
                          <li>Mang theo giấy tờ tùy thân</li>
                          <li>Trang phục thể thao phù hợp</li>
                        </ul>

                        <h3>Lưu ý quan trọng</h3>
                        <ul>
                          <li>
                            Người tham gia phải có trách nhiệm với sức khỏe của
                            bản thân
                          </li>
                          <li>
                            Ban tổ chức sẽ cung cấp nước uống và y tế cơ bản
                          </li>
                          <li>
                            Sự kiện có thể bị hoãn hoặc hủy do thời tiết xấu
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Event Timeline */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Lịch trình sự kiện</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { time: "06:00", activity: "Tập trung, check-in" },
                          { time: "06:30", activity: "Khởi động tập thể" },
                          { time: "07:00", activity: "Xuất phát chính thức" },
                          { time: "09:00", activity: "Về đích, nghỉ ngơi" },
                          { time: "09:30", activity: "Trao giải và kết thúc" },
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-4"
                          >
                            <div className="w-16 text-sm font-medium text-primary">
                              {item.time}
                            </div>
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <div className="flex-1">{item.activity}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Registration Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <UserPlus className="mr-2 h-5 w-5" />
                        Đăng ký tham gia
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Đã đăng ký:
                        </span>
                        <span className="font-medium">
                          {event.currentParticipants}/{event.maxParticipants}
                        </span>
                      </div>

                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${
                              (event.currentParticipants /
                                event.maxParticipants) *
                              100
                            }%`,
                          }}
                        />
                      </div>

                      {canRegister ? (
                        <Button className="w-full" asChild>
                          <Link href={`/events/${event.id}/register`}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Đăng ký ngay
                          </Link>
                        </Button>
                      ) : (
                        <Button className="w-full" disabled>
                          {isRegistered
                            ? "Đã đăng ký"
                            : isEventFull
                            ? "Đã đầy"
                            : isEventPast
                            ? "Đã kết thúc"
                            : "Không thể đăng ký"}
                        </Button>
                      )}

                      {!user && (
                        <p className="text-sm text-muted-foreground text-center">
                          <Link
                            href="/login"
                            className="text-primary hover:underline"
                          >
                            Đăng nhập
                          </Link>{" "}
                          để đăng ký tham gia
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Event Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Thông tin sự kiện</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Ngày tổ chức:
                        </span>
                        <span className="text-sm font-medium">
                          {eventDate.toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Thời gian:
                        </span>
                        <span className="text-sm font-medium">
                          {eventDate.toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Địa điểm:
                        </span>
                        <span className="text-sm font-medium">
                          {event.location}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Phí tham gia:
                        </span>
                        <span className="text-sm font-medium text-green-600">
                          Miễn phí
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Contact Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Liên hệ</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Email:</p>
                        <p className="text-sm font-medium">events@vsm.org.vn</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Hotline:
                        </p>
                        <p className="text-sm font-medium">1900 1234</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Fanpage:
                        </p>
                        <p className="text-sm font-medium">
                          facebook.com/VSMVietnam
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
