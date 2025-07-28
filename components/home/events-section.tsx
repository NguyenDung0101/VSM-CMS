"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  participants: number;
  maxParticipants: number;
  image: string;
  status: "upcoming" | "ongoing" | "completed";
}

export function EventsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockEvents: Event[] = [
      {
        id: "1",
        title: "VSM Talk 01 | Gen Z & Sức bền",
        description:
          "Buổi chia sẻ đầy cảm hứng về việc rèn luyện thể chất & tinh thần bền bỉ trong cuộc sống.",
        date: "Sắp diễn ra",
        location: "Tp. Hồ Chí Minh",
        participants: 0,
        maxParticipants: 100,
        image: "/img/image2.png", ///placeholder.svg?height=300&width=400
        status: "upcoming",
      },
      {
        id: "2",
        title: "VSM Long Run | 20/07/2025",
        description:
          "Sự kiện chạy dài định kỳ giao lưu cùng các anh chị Cà Khịa Bình Lợi Runner.",
        date: "2025-07-20",
        location: "KDC Bình Lợi , Bình Thành, TP. HCM",
        participants: 0,
        maxParticipants: 50,
        image: "/img/VSM/long-run-20_7_2025.png",
        status: "upcoming",
      },
      {
        id: "3",
        title: "VSM Long Run | 15/06/2025",
        description:
          "Sự kiện chạy dài định kỳ giao lưu cùng các anh chị Cà Khịa Bình Lợi Runner.",
        date: "2025-06-15",
        location: "KDC Bình Lợi , Bình Thành, TP. HCM",
        participants: 25,
        maxParticipants: 50,
        image: "/img/VSM/long-run-15_6_2025.png",
        status: "upcoming",
      },
    ];
    setEvents(mockEvents);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-green-500";
      case "ongoing":
        return "bg-yellow-500";
      case "completed":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming":
        return "Sắp diễn ra";
      case "ongoing":
        return "Đang diễn ra";
      case "completed":
        return "Đã kết thúc";
      default:
        return "Không xác định";
    }
  };

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
            Sự kiện <span className="gradient-text">sắp tới</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Tham gia các sự kiện chạy bộ hấp dẫn được tổ chức bởi VSM. Cùng nhau
            tạo nên những kỷ niệm đáng nhớ!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden">
                <div className="relative overflow-hidden">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge
                    className={`absolute top-4 right-4 ${getStatusColor(
                      event.status
                    )} text-white`}
                  >
                    {getStatusText(event.status)}
                  </Badge>
                </div>

                <CardHeader>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {event.title}
                  </CardTitle>
                  <p className="text-muted-foreground">{event.description}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(event.date).toLocaleDateString("vi-VN")}
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.location}
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    {event.participants}/{event.maxParticipants} người tham gia
                  </div>

                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          (event.participants / event.maxParticipants) * 100
                        }%`,
                      }}
                    />
                  </div>

                  <Button
                    className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                    asChild
                  >
                    <Link href={`/events/${event.id}`}>
                      Xem chi tiết
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center"
        >
          <Button size="lg" variant="outline" asChild>
            <Link href="/events">
              Xem tất cả sự kiện
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
