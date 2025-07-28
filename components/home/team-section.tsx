"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Member {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

const members: Member[] = [
  {
    id: "1",
    name: "42KM – Marathon",
    role: "ĐĂNG KÝ NGAY",
    avatar: "/img/VSM/42km.png",
  },
  {
    id: "2",
    name: "21KM – Half Marathon",
    role: "ĐĂNG KÝ NGAY",
    avatar: "/img/VSM/21km.png",
  },
  {
    id: "3",
    name: "10KM - Nâng cao",
    role: "ĐĂNG KÝ NGAY",
    avatar: "/img/VSM/10km.png",
  },
  {
    id: "4",
    name: "5KM – Khởi đầu",
    role: "ĐĂNG KÝ NGAY",
    avatar: "img/VSM/5km.png",
  },
];

export function TeamSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            CỰ LY <span className="gradient-text">ĐĂNG KÝ</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Lựa chọn hành trình phù hợp với bạn – mỗi bước chạy là một thử thách
            để vượt lên chính mình!
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {members.map((m, idx) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
            >
              <Card className="glass hover:shadow-lg transition-shadow">
                <img
                  src={m.avatar || "img/VSM/5km.png"}
                  alt={m.name}
                  className="w-full h-48 object-cover"
                />
                <CardHeader className="text-center">
                  <CardTitle>{m.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  {m.role}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
