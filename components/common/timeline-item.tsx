// components/Timeline.tsx
"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

const timeline: TimelineItem[] = [
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

const Timeline: React.FC = () => {
  // Nhóm các mục theo năm
  const groupedTimeline = timeline.reduce((acc, item) => {
    const year = item.year.split("/")[1];
    if (!acc[year]) acc[year] = [];
    acc[year].push(item);
    return acc;
  }, {} as Record<string, TimelineItem[]>);

  return (
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
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-primary to-purple-600 h-full hidden sm:block" />
          {Object.keys(groupedTimeline).map((year, yearIndex) => (
            <div key={year} className="mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-center mb-6"
              >
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {year}
                </h3>
              </motion.div>
              {groupedTimeline[year].map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{
                    opacity: 0,
                    x: (yearIndex + index) % 2 === 0 ? -100 : 100,
                  }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: (yearIndex + index) * 0.3,
                    ease: "easeOut",
                  }}
                  className={`flex flex-col sm:flex-row items-center mb-8 sm:mb-12 relative ${
                    (yearIndex + index) % 2 === 0
                      ? "sm:flex-row"
                      : "sm:flex-row-reverse"
                  }`}
                >
                  <div
                    className={`${
                      (yearIndex + index) % 2 === 0 ? "sm:pr-2" : "sm:pl-2"
                    } max-w-[400px] sm:w-[45%]`}
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
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full animate-pulse" />
                  </div>
                  <div className="flex-1 sm:w-1/2 hidden sm:block" />
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Timeline;
