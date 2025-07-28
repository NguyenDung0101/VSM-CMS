"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  Users,
  Trophy,
  Heart,
  Award,
  Globe,
  Calendar,
  MapPin,
} from "lucide-react";
import { HeroSection } from "@/components/home/hero-section";
import { AboutSection } from "@/components/home/about-section";
import PartnersSection from "@/components/common/partners-section";
import AboutFeatures from "@/components/home/about-features";
import ValuesSection from "@/components/common/values-section";

const stats = [
  { label: "Sinh viên tham gia qua các mùa", value: "1,000+", icon: Users },
  {
    label: "Trường đại học – cao đẳng đồng hành",
    value: "50+",
    icon: Calendar,
  },
  {
    label: "Mùa giải đã tổ chức thành công liên tiếp từ năm 2023",
    value: "4",
    icon: MapPin,
  },
  {
    label: "Cộng đồng chạy bộ sinh viên lớn nhất tại Việt Nam",
    value: "1",
    icon: Award,
  },
];

const timeline = [
  {
    year: "08/2023",
    title: "Thành lập VSM",
    description:
      "Vietnam Student Marathon chính thức ra đời với sứ mệnh kết nối cộng đồng sinh viên yêu chạy bộ trên khắp Việt Nam.",
  },
  {
    year: "14/10/2023",
    title: "Sự kiện đầu tiên",
    description: "VSM tổ chức giải Run For Green 2023 tại Tân Uyên, Bình Dương",
  },
  {
    year: "24/12/2023",
    title: "Vòng chung kết VSM 2023",
    description:
      "Diễn ra vào ngày 24/12/2023, vòng chung kết đầu tiên của VSM ghi dấu những bước chạy đầu tiên của “Câu chuyện ý chí” từ hàng trăm sinh viên trên cả nước.",
  },
  {
    year: "31/03/2024",
    title: "Vòng khởi động VSM 2024",
    description:
      "Ngày 31/03/2024, VSM khởi động mùa giải mới với quy mô mở rộng, tạo sân chơi lan tỏa mạnh mẽ đến các trường đại học trên địa bàn TP. Hồ Chí Minh.",
  },
  {
    year: "22/12/2024",
    title: "VSM 2024 - Run To Lampas",
    description:
      "Ngày 22/12/2024, hàng ngàn sinh viên cùng nhau viết nên hành trình “hướng đến ánh sáng”, nơi mỗi bước chạy là tuyên ngôn của ý chí, tinh thần chiến binh và khát vọng của thế hệ trẻ Việt Nam.",
  },
];

const team = [
  {
    name: "Phan Huỳnh Anh",
    role: "Cố vấn",
    avatar: "/placeholder.svg?height=200&width=200",
    description: "",
  },
  {
    name: "Dương Thế Khải",
    role: "Trưởng Ban Tổ Chức",
    avatar: "/placeholder.svg?height=200&width=200",
    description: "",
  },
  {
    name: "Lã Phương Uyên",
    role: "Phó Ban Tổ Chức",
    avatar: "/placeholder.svg?height=200&width=200",
    description: "",
  },
  {
    name: "Quách Thành Long",
    role: "Giám đốc Đường chạy",
    avatar: "/placeholder.svg?height=200&width=200",
    description: "",
  },
  {
    name: "Phan Huỳnh Anh",
    role: "Cố vấn",
    avatar: "/placeholder.svg?height=200&width=200",
    description: "",
  },
  {
    name: "Dương Thế Khải",
    role: "Trưởng Ban Tổ Chức",
    avatar: "/placeholder.svg?height=200&width=200",
    description: "",
  },
  {
    name: "Lã Phương Uyên",
    role: "Phó Ban Tổ Chức",
    avatar: "/placeholder.svg?height=200&width=200",
    description: "",
  },
  {
    name: "Quách Thành Long",
    role: "Giám đốc Đường chạy",
    avatar: "/placeholder.svg?height=200&width=200",
    description: "",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <AboutSection />

        {/* About Section */}
        <section className="py-12 sm:py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AboutFeatures />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12 lg:mb-20">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-4 sm:space-y-6"
              >
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                  THÔNG TIN GIẢI
                </h2>
                <div className="space-y-4 text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300">
                  <p>
                    Mỗi bước chạy trong Vietnam Student Marathon không chỉ là
                    hành trình thể lực, mà còn là hành trình của tinh thần và ý
                    chí. Như một chương nhỏ trong cuốn sách tuổi trẻ, mỗi giải
                    chạy là cơ hội để mỗi sinh viên viết nên câu chuyện vượt qua
                    chính mình – câu chuyện mang tên “Tôi đã không bỏ cuộc.”
                  </p>
                  <p>
                    Trên từng cây số, bạn sẽ đối diện với giới hạn của bản thân:
                    EAD: những phút giây đuối sức, những khoảng-optic khoảng
                    khắc muốn dừng lại, và rồi… bừng tỉnh bằng ý chí mạnh mẽ.
                    Chính lúc ấy, bạn sẽ hiểu: chiến thắng không nằm ở tốc độ,
                    mà nằm ở việc bạn đã dám bắt đầu và quyết tâm đi đến cùng.
                  </p>
                  <p>
                    Vietnam Student Marathon không đơn thuần là một cuộc đua –
                    mà là “sân chơi trưởng thành” dành cho thế hệ Gen Z. Bạn
                    không chỉ rèn luyện thể chất, mà còn học cách bền bỉ, kiên
                    trì, và chiến thắng bằng trí tuệ và tinh thần.
                  </p>
                  <p>
                    🎯 Hiểu rõ mục tiêu, chọn đúng cự ly, và sẵn sàng lộ trình
                    là cách bạn chuẩn bị cho một chặng đường đầy cảm hứng sắp
                    tới.
                  </p>
                  <p>
                    Hãy bắt đầu chuẩn bị cho giải chạy tiếp theo của bạn cùng
                    Vietnam Student Marathon – nơi ý chí sinh viên được viết
                    bằng từng nhịp tim và dấu chân trên đường đua!
                  </p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src="img/VSM/Gioi-thieu-VSM.jpeg"
                    alt="VSM Mission"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 sm:-bottom-6 -right-4 sm:-right-6 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-r from-primary to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-md">
                  <div className="text-center">
                    <Globe className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2" />
                    <div className="text-xs sm:text-sm font-semibold">
                      Toàn quốc
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}

        {/* Values Section */}

        {/* Timeline Section */}
        <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-muted/10 to-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                Hành trình phát triển
              </h2>
              <p className="mt-4 text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
                Từ những bước chân đầu tiên đến cộng đồng hàng nghìn thành viên
              </p>
            </motion.div>
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-primary to-purple-600 h-full hidden sm:block"></div>
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.3,
                    ease: "easeOut",
                  }}
                  className={`flex flex-col sm:flex-row items-center mb-8 sm:mb-12 relative ${
                    index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                  }`}
                >
                  <div
                    className={` ${
                      index % 2 === 0 ? "sm:pr-2" : "sm:pl-2"
                    } max-w-[400px] sm:w-[45%] `}
                  >
                    <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg hover:shadow-xl transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-center space-x-2 sm:space-x-4">
                          <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white text-xs sm:text-sm px-2 sm:px-3 py-1">
                            {item.year}
                          </Badge>
                          <CardTitle className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white">
                            {item.title}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="w-6 h-6 bg-primary rounded-full relative z-10 shadow-md sm:flex hidden">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex-1 sm:w-1/2 hidden sm:block"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-12 sm:py-16 md:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/5 opacity-50 animate-pulse-slow pointer-events-none"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Đội ngũ lãnh đạo
              </h2>
              <p className="mt-4 text-sm sm:text-base lg:text-lg text-muted-foreground">
                Những người đồng hành cùng VSM từ những ngày đầu
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{
                    scale: 1.05,
                    rotate: 1,
                    transition: { duration: 0.3 },
                  }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="transform-gpu"
                >
                  <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md overflow-hidden group">
                    <CardContent className="p-4 sm:p-6 text-center relative">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mx-auto mb-4 relative">
                        <motion.img
                          src={member.avatar || "/placeholder.svg"}
                          alt={member.name}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        />
                        <motion.div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full" />
                      </div>
                      <motion.h3
                        className="text-base sm:text-lg lg:text-xl font-semibold mb-2 text-gray-900 dark:text-white"
                        whileHover={{ color: "#9333ea" }}
                        transition={{ duration: 0.3 }}
                      >
                        {member.name}
                      </motion.h3>
                      <Badge
                        variant="secondary"
                        className="mb-3 text-xs sm:text-sm bg-secondary/80 hover:bg-secondary transition-colors duration-300"
                      >
                        {member.role}
                      </Badge>
                      <motion.p
                        className="text-sm sm:text-base text-muted-foreground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                      >
                        {member.description}
                      </motion.p>
                      <motion.div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-primary to-purple-600 rounded-full group-hover:w-1/3 transition-all duration-300" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <PartnersSection />
      </main>
      <Footer />
    </div>
  );
}
