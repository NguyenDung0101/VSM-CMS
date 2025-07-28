"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="py-20 bg-gradient-to-r from-primary/20 to-purple-500/20"
    >
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Sẵn sàng <span className="gradient-text">bứt phá?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Đăng ký ngay để tham gia sự kiện chạy bộ cùng cộng đồng sinh viên
            trên toàn quốc!
          </p>
          <Button size="lg" asChild className="px-8 py-4">
            <Link href="/events">
              Đăng ký ngay
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
