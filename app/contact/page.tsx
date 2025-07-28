"use client";

import { useState } from "react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Building,
  Navigation,
  ExternalLink,
  CheckCircle,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const contactFormSchema = z.object({
  fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z
    .string()
    .min(10, "Số điện thoại phải có ít nhất 10 số")
    .regex(/^[0-9]+$/, "Số điện thoại chỉ được chứa số")
    .optional()
    .or(z.literal("")),
  subject: z.string().min(5, "Chủ đề phải có ít nhất 5 ký tự"),
  message: z.string().min(10, "Nội dung phải có ít nhất 10 ký tự"),
});

type ContactForm = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactForm) => {
    try {
      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Contact form submitted:", data);
      setIsSubmitted(true);
      form.reset();
      toast({
        title: "Gửi tin nhắn thành công!",
        description: "Chúng tôi sẽ phản hồi bạn trong vòng 24 giờ.",
      });
    } catch (error) {
      toast({
        title: "Gửi tin nhắn thất bại",
        description: "Có lỗi xảy ra, vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = {
    address: "Tầng 15 - 279 Nguyễn Tri Phương, Phường Diên Hồng, TP. HCM",
    email: "khaiduong6722@gmail.com",
    phone: "0329.381.489",
    workingHours: "Thứ 2 - Thứ 7: 8:00 - 17:00",
    facebook: "facebook.com/VSMVietnam",
    instagram: "@vsm_vietnam",
    youtube: "VSM Vietnam Official",
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="flex items-center justify-center mb-6">
                <MessageCircle className="h-10 w-10 text-blue-600 dark:text-blue-400 mr-3" />
                <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Liên Hệ Với VSM
                </h1>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Có câu hỏi về sự kiện, muốn hợp tác hoặc cần hỗ trợ? Đội ngũ VSM
                luôn sẵn sàng lắng nghe và hỗ trợ bạn.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contact Information */}
              <div className="lg:col-span-1 space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    Thông Tin Liên Hệ
                  </h2>
                  <div className="space-y-6">
                    {/* Address */}
                    <Card className="border-l-4 border-blue-500 hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                            <Building className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                              Văn Phòng Đại Diện
                            </h3>
                            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                              <li className="flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                {contactInfo.address}
                              </li>
                              <li className="flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                VP2: Văn phòng SIHUB, 273 Điện Biên Phủ, P. Xuân
                                Hoà, TP. HCM
                              </li>
                              <li className="flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                Nam Quốc Building, 1267/22 Lê Đức Thọ, P. An Hội
                                Tây, TP. HCM
                              </li>
                            </ul>
                            <Button
                              variant="link"
                              className="p-0 h-auto mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                              asChild
                            >
                              <a
                                href={`https://maps.google.com/?q=${encodeURIComponent(
                                  contactInfo.address
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center"
                              >
                                <Navigation className="h-5 w-5 mr-2" />
                                Xem trên bản đồ
                                <ExternalLink className="h-4 w-4 ml-2" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Email */}
                    <Card className="border-l-4 border-green-500 hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                            <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                              Email
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                              {contactInfo.email}
                            </p>
                            <Button
                              variant="link"
                              className="p-0 h-auto mt-2 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                              asChild
                            >
                              <a href={`mailto:${contactInfo.email}`}>
                                Gửi email ngay
                              </a>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Phone */}
                    <Card className="border-l-4 border-purple-500 hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                            <Phone className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                              Hotline
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                              {contactInfo.phone}
                            </p>
                            <Button
                              variant="link"
                              className="p-0 h-auto mt-2 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
                              asChild
                            >
                              <a
                                href={`tel:${contactInfo.phone.replace(
                                  /\s/g,
                                  ""
                                )}`}
                              >
                                Gọi ngay
                              </a>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Working Hours */}
                    <Card className="border-l-4 border-orange-500 hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full">
                            <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                              Giờ Làm Việc
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                              {contactInfo.workingHours}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Chủ nhật: Nghỉ
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Social Media */}
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Kết Nối Với Chúng Tôi
                      </h3>
                      <div className="flex space-x-4">
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30"
                          asChild
                        >
                          <a
                            href={`https://${contactInfo.facebook}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Facebook className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </a>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full hover:bg-pink-100 dark:hover:bg-pink-900/30"
                          asChild
                        >
                          <a
                            href={`https://instagram.com/${contactInfo.instagram.replace(
                              "@",
                              ""
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Instagram className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                          </a>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full hover:bg-red-100 dark:hover:bg-red-900/30"
                          asChild
                        >
                          <a
                            href={`https://youtube.com/@${contactInfo.youtube.replace(
                              " ",
                              ""
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Youtube className="h-5 w-5 text-red-600 dark:text-red-400" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Card className="shadow-xl border border-gray-200 dark:border-gray-700">
                    <CardHeader className="text-center border-b border-gray-200 dark:border-gray-700">
                      <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                        {isSubmitted ? "Cảm Ơn Bạn!" : "Gửi Tin Nhắn"}
                      </CardTitle>
                      <p className="text-gray-600 dark:text-gray-300">
                        {isSubmitted
                          ? "Chúng tôi đã nhận được tin nhắn và sẽ phản hồi sớm nhất có thể."
                          : "Hãy điền thông tin bên dưới, chúng tôi sẽ liên hệ trong vòng 24 giờ."}
                      </p>
                    </CardHeader>
                    <CardContent className="p-8">
                      {isSubmitted ? (
                        <div className="text-center py-12">
                          <CheckCircle className="mx-auto h-20 w-20 text-green-500 mb-6" />
                          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                            Tin Nhắn Đã Gửi!
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Chúng tôi sẽ phản hồi bạn qua email trong vòng 24
                            giờ.
                          </p>
                          <Button
                            onClick={() => setIsSubmitted(false)}
                            variant="outline"
                            className="hover:bg-blue-50 dark:hover:bg-blue-900/30"
                          >
                            Gửi Tin Nhắn Khác
                          </Button>
                        </div>
                      ) : (
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
                                    <FormLabel className="text-gray-900 dark:text-white">
                                      Họ và Tên{" "}
                                      <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Nhập họ và tên"
                                        className="h-12 border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-colors rounded-lg"
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
                                    <FormLabel className="text-gray-900 dark:text-white">
                                      Email{" "}
                                      <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="email@example.com"
                                        type="email"
                                        className="h-12 border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-colors rounded-lg"
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
                                    <FormLabel className="text-gray-900 dark:text-white">
                                      Số Điện Thoại
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="0123456789"
                                        className="h-12 border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-colors rounded-lg"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="subject"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-gray-900 dark:text-white">
                                      Chủ Đề{" "}
                                      <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Chủ đề tin nhắn"
                                        className="h-12 border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-colors rounded-lg"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <FormField
                              control={form.control}
                              name="message"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-900 dark:text-white">
                                    Nội Dung Tin Nhắn{" "}
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Hãy chia sẻ câu hỏi, góp ý hoặc yêu cầu hỗ trợ..."
                                      rows={6}
                                      className="border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 transition-colors rounded-lg resize-none"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                              <div className="flex items-start">
                                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-1" />
                                <div className="text-sm text-blue-800 dark:text-blue-300">
                                  <p className="font-medium mb-1">
                                    Cam Kết Bảo Mật
                                  </p>
                                  <p>
                                    Thông tin của bạn được bảo mật tuyệt đối và
                                    chỉ sử dụng để phản hồi yêu cầu.
                                  </p>
                                </div>
                              </div>
                            </div>
                            <Button
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md"
                            >
                              {isSubmitting ? (
                                <div className="flex items-center">
                                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-2"></div>
                                  Đang Gửi...
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <Send className="h-5 w-5 mr-2" />
                                  Gửi Tin Nhắn
                                </div>
                              )}
                            </Button>
                          </form>
                        </Form>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 bg-gray-100 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Vị Trí Văn Phòng
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Ghé thăm văn phòng VSM để gặp gỡ đội ngũ và trải nghiệm không
                  gian của chúng tôi.
                </p>
              </div>
              <Card className="overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="aspect-video w-full">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.6244374077437!2d106.69197831533463!3d10.762622992332768!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1b7c3ed289%3A0xa06651894598e488!2zMjc5IE5ndXnhu4VuIFRyaSBQaMawxqFuZywgUGjGsOG7nW5nIDUsIFF1YW4gNSwgVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5oLCBWaWV0bmFt!5e0!3m2!1sen!2s!4v1647859234567!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-t-lg"
                  ></iframe>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        VSM Việt Nam
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        Văn phòng Vietnam Student Marathon
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="hover:bg-blue-50 dark:hover:bg-blue-900/30"
                      asChild
                    >
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(
                          contactInfo.address
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Navigation className="h-5 w-5 mr-2" />
                        Chỉ Đường
                      </a>
                    </Button>
                  </div>
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
