"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  showAnimations?: boolean;
  [key: string]: any;
}

export function HeroSection({
  title = "CHUNG KẾT VIETNAM STUDENT MARATHON 2025",
  subtitle = "Chạy chung kết Việt tương lai 2025",
  backgroundImage = "/img/image1.jpg",
  primaryButtonText = "Tham gia sự kiện",
  secondaryButtonText = "Xem video",
  showAnimations = true,
  ...props
}: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image + Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="VSM Hero Background"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Floating Lights */}
      <div className="absolute inset-0 z-10">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full blur-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.8, 0.1],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-20 container mx-auto px-6 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className=" mx-auto mb-12"
        >
          <motion.h1
            className="flex flex-col md:leading-tight text-5xl md:text-6xl font-extrabold mb-6 mt-20  tracking-tight"
            initial={
              showAnimations ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {title.split(" ").slice(0, 2).join(" ")}
            <span>{title.split(" ").slice(2, -3).join(" ")}</span>
            <span className="bg-gradient-to-r block gradient-text bg-clip-text text-transparent drop-shadow-lg">
              {title.split(" ").slice(-3).join(" ")}
            </span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-2xl mb-10 text-gray-300 max-w-2xl mx-auto"
            initial={
              showAnimations ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {subtitle}
          </motion.p>

          {props.showOrganizer !== false && (
            <motion.div
              initial={
                showAnimations ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-xl w-fit mx-auto"
            >
              <p className="text-base text-gray-800 mb-2 font-semibold">
                Đơn vị tổ chức
              </p>
              <div className="flex justify-center items-center">
                <Image
                  src="/img/logo-vsm.png"
                  alt="VNExpress"
                  width={100}
                  height={50}
                  className="object-contain"
                />
              </div>
            </motion.div>
          )}

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6"
            initial={
              showAnimations ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Button
              size="lg"
              className="bg-gradient-to-r bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg shadow-lg"
              asChild
            >
              <Link href="/events">
                {primaryButtonText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            {secondaryButtonText && (
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-black px-8 py-3 text-lg shadow-lg"
                asChild
              >
                <Link href="/video">{secondaryButtonText}</Link>
              </Button>
            )}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {/* <div className="w-3 h-3 rounded-full bg-white/80 shadow-lg animate-pulse" /> */}
        </motion.div>
      </div>
    </section>
  );
}
