"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  Users,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const eventSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  description: z.string().min(1, "Mô tả không được để trống"),
  date: z.string().min(1, "Ngày tổ chức không được để trống"),
  location: z.string().min(1, "Địa điểm không được để trống"),
  maxParticipants: z.number().min(1, "Số lượng tham gia phải lớn hơn 0"),
  category: z.enum(["marathon", "fun-run", "trail-run"]),
  distance: z.string().min(1, "Cự ly không được để trống"),
});

type EventForm = z.infer<typeof eventSchema>;

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
  category: "marathon" | "fun-run" | "trail-run";
  distance: string;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const form = useForm<EventForm>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      location: "",
      maxParticipants: 100,
      category: "fun-run",
      distance: "",
    },
  });

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
        category: "marathon",
        distance: "42.2km",
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
        category: "fun-run",
        distance: "5km",
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
        category: "trail-run",
        distance: "15km",
      },
    ];
    setEvents(mockEvents);
    setFilteredEvents(mockEvents);
  }, []);

  useEffect(() => {
    const filtered = events.filter(
      (event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [events, searchTerm]);

  const getCategoryText = (category: string) => {
    switch (category) {
      case "marathon":
        return "Marathon";
      case "fun-run":
        return "Fun Run";
      case "trail-run":
        return "Trail Run";
      default:
        return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "marathon":
        return "bg-red-500";
      case "fun-run":
        return "bg-blue-500";
      case "trail-run":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

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

  const onSubmit = async (data: EventForm) => {
    try {
      if (editingEvent) {
        // Update existing event
        const updatedEvents = events.map((event) =>
          event.id === editingEvent.id
            ? {
                ...event,
                ...data,
                participants: event.participants, // Keep existing participants
                image: event.image, // Keep existing image
                status: event.status, // Keep existing status
              }
            : event
        );
        setEvents(updatedEvents);
        toast({
          title: "Cập nhật thành công",
          description: "Sự kiện đã được cập nhật.",
        });
      } else {
        // Create new event
        const newEvent: Event = {
          id: Date.now().toString(),
          ...data,
          participants: 0,
          image: "/placeholder.svg?height=300&width=400",
          status: "upcoming",
        };
        setEvents([newEvent, ...events]);
        toast({
          title: "Tạo thành công",
          description: "Sự kiện mới đã được tạo.",
        });
      }

      setIsDialogOpen(false);
      setEditingEvent(null);
      form.reset();
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        description: "Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    form.reset({
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
      maxParticipants: event.maxParticipants,
      category: event.category,
      distance: event.distance,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (eventId: string) => {
    setEvents(events.filter((event) => event.id !== eventId));
    toast({
      title: "Xóa thành công",
      description: "Sự kiện đã được xóa.",
    });
  };

  const handleNewEvent = () => {
    setEditingEvent(null);
    form.reset();
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="flex">
        <AdminSidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
        <main
          className={`flex-1 transition-all duration-300 ${
            isCollapsed ? "ml-16" : "ml-64"
          }`}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">Quản lý sự kiện</h1>
                <p className="text-muted-foreground">
                  Tạo và quản lý các sự kiện chạy bộ
                </p>
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleNewEvent}>
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo sự kiện
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingEvent ? "Chỉnh sửa sự kiện" : "Tạo sự kiện mới"}
                    </DialogTitle>
                  </DialogHeader>

                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tiêu đề</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nhập tiêu đề sự kiện"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mô tả</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Nhập mô tả sự kiện"
                                rows={3}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ngày tổ chức</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Địa điểm</FormLabel>
                              <FormControl>
                                <Input placeholder="Nhập địa điểm" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="maxParticipants"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Số lượng tối đa</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="100"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      Number.parseInt(e.target.value) || 0
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Loại sự kiện</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chọn loại" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="marathon">
                                    Marathon
                                  </SelectItem>
                                  <SelectItem value="fun-run">
                                    Fun Run
                                  </SelectItem>
                                  <SelectItem value="trail-run">
                                    Trail Run
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="distance"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cự ly</FormLabel>
                              <FormControl>
                                <Input placeholder="5km" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-end space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Hủy
                        </Button>
                        <Button type="submit">
                          {editingEvent ? "Cập nhật" : "Tạo sự kiện"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Search */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm sự kiện..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Events Table */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Danh sách sự kiện ({filteredEvents.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sự kiện</TableHead>
                      <TableHead>Loại</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Tham gia</TableHead>
                      <TableHead>Ngày tổ chức</TableHead>
                      <TableHead>Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{event.title}</div>
                            <div className="text-sm text-muted-foreground flex items-center mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              {event.location}
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {event.distance}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getCategoryColor(
                              event.category
                            )} text-white`}
                          >
                            {getCategoryText(event.category)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getStatusColor(
                              event.status
                            )} text-white`}
                          >
                            {getStatusText(event.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {event.participants}/{event.maxParticipants}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1 mt-1">
                            <div
                              className="bg-primary h-1 rounded-full"
                              style={{
                                width: `${
                                  (event.participants / event.maxParticipants) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(event.date).toLocaleDateString("vi-VN")}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                // window.open(`/events/${event.id}`, "_blank")
                                window.open(`/admin/events/${event.id}`)
                              }
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEdit(event)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDelete(event.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
