"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  UserPlus,
  Flag,
  CheckCircle,
  Info,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { mockEvents, type Event } from "@/lib/mock-data";

const registrationSchema = z.object({
  fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z
    .string()
    .min(10, "Số điện thoại phải có ít nhất 10 số")
    .regex(/^[0-9]+$/, "Số điện thoại chỉ được chứa số"),
  emergencyContact: z
    .string()
    .min(2, "Tên người liên hệ khẩn cấp không được để trống"),
  emergencyPhone: z
    .string()
    .min(10, "Số điện thoại khẩn cấp phải có ít nhất 10 số")
    .regex(/^[0-9]+$/, "Số điện thoại chỉ được chứa số"),
  medicalConditions: z.string().optional(),
  experience: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
});

type RegistrationForm = z.infer<typeof registrationSchema>;

export default function EventRegistrationPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [event, setEvent] = useState<Event | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: user?.name || "",
      email: user?.email || "",
      phone: "",
      emergencyContact: "",
      emergencyPhone: "",
      medicalConditions: "",
      experience: "BEGINNER",
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

      setIsSubmitting(true);

      // Simulate registration API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

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

      toast({
        title: "Đăng ký thành công!",
        description:
          "Bạn đã đăng ký tham gia sự kiện thành công. Chúng tôi sẽ gửi email xác nhận trong vòng 24 giờ.",
      });

      // Redirect back to event page after 2 seconds
      setTimeout(() => {
        router.push(`/events/${event.id}`);
      }, 2000);
    } catch (error) {
      toast({
        title: "Đăng ký thất bại",
        description: "Có lỗi xảy ra, vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const isEventFull = event.currentParticipants >= event.maxParticipants;
  const isEventPast = eventDate < new Date();
  const canRegister = !isEventPast && !isEventFull && !isRegistered;

  if (isRegistered) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-16">
          <section className="py-12">
            <div className="container mx-auto px-4 max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Button variant="ghost" className="mb-6" asChild>
                  <Link href={`/events/${event.id}`}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại trang sự kiện
                  </Link>
                </Button>

                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="mb-6">
                      <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                      <h1 className="text-2xl font-bold mb-2">
                        Đã đăng ký thành công!
                      </h1>
                      <p className="text-muted-foreground">
                        Bạn đã đăng ký tham gia sự kiện{" "}
                        <strong>{event.name}</strong>
                      </p>
                    </div>

                    <div className="bg-muted p-4 rounded-lg mb-6">
                      <h3 className="font-semibold mb-2">Thông tin sự kiện</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {eventDate.toLocaleDateString("vi-VN", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                        <div className="flex items-center justify-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {eventDate.toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="flex items-center justify-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {event.location}
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
                      <div className="flex items-start">
                        <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                        <div className="text-left">
                          <p className="text-sm text-blue-800">
                            <strong>Lưu ý quan trọng:</strong>
                          </p>
                          <ul className="text-sm text-blue-700 mt-1 space-y-1">
                            <li>
                              • Chúng tôi sẽ gửi email xác nhận trong vòng 24
                              giờ
                            </li>
                            <li>
                              • Vui lòng mang theo giấy tờ tùy thân khi tham gia
                            </li>
                            <li>
                              • Đến trước giờ tập trung 30 phút để check-in
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <Button asChild>
                      <Link href={`/events/${event.id}`}>
                        Quay lại trang sự kiện
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (!canRegister) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-16">
          <section className="py-12">
            <div className="container mx-auto px-4 max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Button variant="ghost" className="mb-6" asChild>
                  <Link href={`/events/${event.id}`}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại trang sự kiện
                  </Link>
                </Button>

                <Card className="text-center">
                  <CardContent className="pt-6">
                    <AlertCircle className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
                    <h1 className="text-2xl font-bold mb-2">
                      Không thể đăng ký
                    </h1>
                    <p className="text-muted-foreground mb-6">
                      {isEventPast
                        ? "Sự kiện này đã kết thúc"
                        : isEventFull
                        ? "Sự kiện đã đầy, vui lòng thử sự kiện khác"
                        : "Không thể đăng ký vào lúc này"}
                    </p>
                    <Button asChild>
                      <Link href="/events">Xem các sự kiện khác</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-16">
        <section className="py-12">
          <div className="container mx-auto px-4 ">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Button variant="ghost" className="mb-6" asChild>
                <Link href={`/events/${event.id}`}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Quay lại trang sự kiện
                </Link>
              </Button>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Registration Form */}
                <div className="lg:col-span-2">
                  <Card className="shadow-lg border-2 border-border/50">
                    <CardHeader className="text-center border-b border-border/50">
                      <CardTitle className="flex items-center justify-center text-2xl">
                        <UserPlus className="mr-3 h-6 w-6 text-primary" />
                        Đăng ký tham gia sự kiện
                      </CardTitle>
                      <p className="text-muted-foreground mt-2">
                        Vui lòng điền đầy đủ thông tin để đăng ký tham gia{" "}
                        <strong>{event.name}</strong>
                      </p>
                    </CardHeader>
                    <CardContent className="p-8">
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="space-y-6"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="fullName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium">
                                    Họ và tên{" "}
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Nhập họ và tên đầy đủ"
                                      className="h-11 border-2 focus:border-primary transition-colors"
                                      {...field}
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
                                  <FormLabel className="text-sm font-medium">
                                    Email{" "}
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="your-email@example.com"
                                      type="email"
                                      className="h-11 border-2 focus:border-primary transition-colors"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium">
                                    Số điện thoại{" "}
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="0123456789"
                                      className="h-11 border-2 focus:border-primary transition-colors"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="experience"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium">
                                    Kinh nghiệm chạy bộ{" "}
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="h-11 border-2 focus:border-primary transition-colors">
                                        <SelectValue placeholder="Chọn mức độ kinh nghiệm" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="BEGINNER">
                                        Người mới bắt đầu
                                      </SelectItem>
                                      <SelectItem value="INTERMEDIATE">
                                        Trung bình (đã chạy &gt; 6 tháng)
                                      </SelectItem>
                                      <SelectItem value="ADVANCED">
                                        Nâng cao (đã tham gia nhiều giải)
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="bg-muted/50 p-6 rounded-lg border border-border/50">
                            <h3 className="font-semibold mb-4 flex items-center">
                              <AlertCircle className="h-5 w-5 mr-2 text-orange-500" />
                              Thông tin liên hệ khẩn cấp
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <FormField
                                control={form.control}
                                name="emergencyContact"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-medium">
                                      Người liên hệ khẩn cấp{" "}
                                      <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Tên người thân"
                                        className="h-11 border-2 focus:border-primary transition-colors"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="emergencyPhone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-sm font-medium">
                                      Số điện thoại khẩn cấp{" "}
                                      <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="0987654321"
                                        className="h-11 border-2 focus:border-primary transition-colors"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>

                          <FormField
                            control={form.control}
                            name="medicalConditions"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium">
                                  Tình trạng sức khỏe (không bắt buộc)
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Ghi chú về tình trạng sức khỏe đặc biệt, dị ứng, thuốc đang sử dụng... (nếu có)"
                                    rows={4}
                                    className="border-2 focus:border-primary transition-colors resize-none"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                            <div className="flex items-start">
                              <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                              <div className="text-sm text-blue-800">
                                <p className="font-medium mb-1">
                                  Lưu ý quan trọng:
                                </p>
                                <ul className="space-y-1">
                                  <li>
                                    • Người tham gia phải có sức khỏe tốt, không
                                    có bệnh lý tim mạch
                                  </li>
                                  <li>
                                    • Mang theo giấy tờ tùy thân khi tham gia
                                  </li>
                                  <li>
                                    • Đến trước giờ tập trung 30 phút để
                                    check-in
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>

                          <div className="pt-4">
                            <Button
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 transition-all duration-300 shadow-lg"
                            >
                              {isSubmitting ? (
                                <div className="flex items-center">
                                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                  Đang xử lý...
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <Flag className="mr-2 h-5 w-5" />
                                  Đăng ký tham gia ngay
                                </div>
                              )}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </div>

                {/* Event Info Sidebar */}
                <div className="space-y-6">
                  <Card className="sticky top-24">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Thông tin sự kiện
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="aspect-video rounded-lg overflow-hidden">
                        <img
                          src={event.image || "/placeholder.svg"}
                          alt={event.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg mb-2">
                          {event.name}
                        </h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-primary" />
                            <span>
                              {eventDate.toLocaleDateString("vi-VN", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-primary" />
                            <span>
                              {eventDate.toLocaleTimeString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-primary" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">
                            Đã đăng ký:
                          </span>
                          <span className="font-medium">
                            {event.currentParticipants}/{event.maxParticipants}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-primary to-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${
                                (event.currentParticipants /
                                  event.maxParticipants) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Còn{" "}
                          {event.maxParticipants - event.currentParticipants}{" "}
                          chỗ trống
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
