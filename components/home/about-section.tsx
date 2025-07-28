"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, Trophy, Heart } from "lucide-react";
import SportsCommunityStory from "@/components/home/SportsCommunityStory";

const features = [
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

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="py-20 bg-gradient-to-b from-background to-muted/20"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Giới thiệu về <span className="gradient-text">VSM</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-7xl mx-auto">
            VSM không chỉ là một giải chạy thường niên dành cho học sinh, sinh
            viên, mà còn là sân chơi của những bạn trẻ đam mê chạy bộ từ các
            trường đại học như: ĐH Kinh tế TP.HCM, UEF, ĐH Sư phạm, ĐH Văn
            Lang,… Đây là nơi bạn không chỉ thử sức qua từng cự ly chạy – mỗi cự
            ly là một thử thách, một cơ hội để bứt phá giới hạn bản thân – mà
            còn được rèn luyện ý chí, nâng cao sức khỏe và kết nối cộng đồng.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
