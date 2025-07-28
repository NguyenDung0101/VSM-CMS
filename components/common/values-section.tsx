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
const values = [
  {
    icon: Target,
    title: "Mục tiêu rõ ràng",
    description:
      "Xây dựng cộng đồng chạy bộ sinh viên mạnh mẽ và bền vững tại Việt Nam.",
  },
  {
    icon: Users,
    title: "Cộng đồng đoàn kết",
    description:
      "Kết nối hàng nghìn sinh viên có cùng đam mê chạy bộ trên khắp cả nước.",
  },
  {
    icon: Trophy,
    title: "Thành tựu xuất sắc",
    description:
      "Tổ chức thành công nhiều giải chạy lớn với sự tham gia của hàng nghìn vận động viên.",
  },
  {
    icon: Heart,
    title: "Tinh thần thể thao",
    description:
      "Lan tỏa tinh thần thể thao, sức khỏe và lối sống tích cực trong giới trẻ.",
  },
];
const ValuesSection = () => {
  return (
    <div>
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Giá trị cốt lõi
            </h2>
            <p className="mt-4 text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
              Những giá trị định hình hành trình của Vietnam Student Marathon
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-gray-800/80 backdrop-blur-md">
                  <CardContent className="p-6 text-center">
                    <value.icon className="h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-4 text-primary" />
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                      {value.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ValuesSection;
