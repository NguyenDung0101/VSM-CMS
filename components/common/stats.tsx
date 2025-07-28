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
const Stats = () => {
  return (
    <div>
      <section className="py-12 sm:py-16 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Stats;
