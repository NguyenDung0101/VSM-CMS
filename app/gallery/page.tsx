"use client";

import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { motion, AnimatePresence } from "framer-motion";
import Flicking from "@egjs/react-flicking";
import "@egjs/react-flicking/dist/flicking.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Images,
  Calendar,
  MapPin,
  ZoomIn,
  X,
  Filter,
  Camera,
  Trophy,
  Users,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface GalleryImage {
  id: string;
  src: string;
  title: string;
  event: string;
  location: string;
  year: number;
  category: "marathon" | "fun-run" | "trail-run" | "night-run";
  description?: string;
  participants?: number;
}

const mockGalleryImages: GalleryImage[] = [
  {
    id: "1",
    src: "/img/Gallery/img1.jpg",
    title: "Khoảnh khắc xuất phát VSM Marathon 2023",
    event: "VSM Marathon 2023",
    location: "Hà Nội",
    year: 2023,
    category: "marathon",
    description: "Hơn 5000 VĐV tham gia cự ly marathon 42.195km tại Hà Nội",
    participants: 5000,
  },
  {
    id: "2",
    src: "/img/Gallery/img2.jpg",
    title: "Runners tại km 21 VSM Marathon",
    event: "VSM Marathon 2023",
    location: "Hà Nội",
    year: 2023,
    category: "marathon",
    description: "Tinh thần kiên cường của các runner tại cột mốc nửa marathon",
  },
  {
    id: "3",
    src: "/img/Gallery/img3.jpg",
    title: "Fun Run cùng gia đình",
    event: "VSM Family Fun Run",
    location: "TP.HCM",
    year: 2023,
    category: "fun-run",
    description: "Sự kiện chạy bộ gia đình với cự ly 5km tại TP.HCM",
    participants: 2000,
  },
  {
    id: "4",
    src: "/img/Gallery/img4.jpg",
    title: "Trail Run Sa Pa 2023",
    event: "VSM Trail Sa Pa",
    location: "Sa Pa, Lào Cai",
    year: 2023,
    category: "trail-run",
    description: "Thử thách trail running trên địa hình núi Sa Pa",
    participants: 800,
  },
  {
    id: "5",
    src: "/img/Gallery/img4.jpg",
    title: "Về đích Marathon 2023",
    event: "VSM Marathon 2023",
    location: "Hà Nội",
    year: 2023,
    category: "marathon",
    description: "Niềm vui của các finisher về đích marathon",
  },
  {
    id: "6",
    src: "/img/Gallery/img5.jpg",
    title: "Night Run Landmark 81",
    event: "VSM Night Run",
    location: "TP.HCM",
    year: 2023,
    category: "night-run",
    description: "Chạy đêm quanh khu vực Landmark 81",
    participants: 1500,
  },
  {
    id: "7",
    src: "/img/Gallery/img6.jpg",
    title: "Marathon 2024 - Cầu Rồng",
    event: "VSM Marathon 2024",
    location: "Đà Nẵng",
    year: 2024,
    category: "marathon",
    description: "Runners chạy qua Cầu Rồng nổi tiếng Đà Nẵng",
    participants: 4500,
  },
  {
    id: "8",
    src: "/img/Gallery/DSC04302.JPG",
    title: "Trao giải Marathon 2024",
    event: "VSM Marathon 2024",
    location: "Đà Nẵng",
    year: 2024,
    category: "marathon",
    description: "Lễ trao giải cho các VĐV xuất sắc",
  },
  {
    id: "9",
    src: "/img/Gallery/DSC04244.JPG",
    title: "Fun Run Phú Quốc",
    event: "VSM Fun Run Phú Quốc",
    location: "Phú Quốc",
    year: 2024,
    category: "fun-run",
    description: "Chạy bộ trên bãi biển Phú Quốc",
    participants: 1200,
  },
  {
    id: "10",
    src: "/img/Gallery/DSC04139.JPG",
    title: "Trail Run Đà Lạt 2024",
    event: "VSM Trail Đà Lạt",
    location: "Đà Lạt",
    year: 2024,
    category: "trail-run",
    description: "Thách thức trail running tại thành phố ngàn hoa",
    participants: 600,
  },
  {
    id: "11",
    src: "/img/Gallery/DSC03758.JPG",
    title: "Marathon 2024 - Khởi động",
    event: "VSM Marathon 2024",
    location: "Hà Nội",
    year: 2024,
    category: "marathon",
    description: "Buổi khởi động tập thể trước marathon",
    participants: 3000,
  },
  {
    id: "12",
    src: "/img/Gallery/img5.jpg",
    title: "Finish Line Marathon 2024",
    event: "VSM Marathon 2024",
    location: "Hà Nội",
    year: 2024,
    category: "marathon",
    description: "Cảm xúc về đích của các marathon runner",
  },
  {
    id: "13",
    src: "/img/Gallery/img5.jpg",
    title: "Night Run Hà Nội 2025",
    event: "VSM Night Run 2025",
    location: "Hà Nội",
    year: 2025,
    category: "night-run",
    description: "Chạy đêm quanh Hồ Hoàn Kiếm với ánh đèn rực rỡ",
    participants: 1800,
  },
  {
    id: "14",
    src: "/img/Gallery/img5.jpg",
    title: "Fun Run Đà Nẵng 2025",
    event: "VSM Family Fun Run 2025",
    location: "Đà Nẵng",
    year: 2025,
    category: "fun-run",
    description: "Sự kiện chạy bộ gia đình bên bãi biển Mỹ Khê",
    participants: 2500,
  },
  {
    id: "15",
    src: "/img/Gallery/img5.jpg",
    title: "Trail Run Cát Bà 2025",
    event: "VSM Trail Cát Bà",
    location: "Cát Bà, Hải Phòng",
    year: 2025,
    category: "trail-run",
    description: "Chinh phục địa hình đồi núi và rừng Cát Bà",
    participants: 700,
  },
  {
    id: "16",
    src: "/img/Gallery/img5.jpg",
    title: "Marathon TP.HCM 2025",
    event: "VSM Marathon 2025",
    location: "TP.HCM",
    year: 2025,
    category: "marathon",
    description: "Marathon lớn nhất năm tại trung tâm TP.HCM",
    participants: 6000,
  },
  {
    id: "17",
    src: "/img/Gallery/img5.jpg",
    title: "Fun Run Hội An 2024",
    event: "VSM Fun Run Hội An",
    location: "Hội An, Quảng Nam",
    year: 2024,
    category: "fun-run",
    description: "Chạy bộ qua các con phố cổ Hội An",
    participants: 1500,
  },
  {
    id: "18",
    src: "/img/Gallery/img5.jpg",
    title: "Night Run Vũng Tàu 2023",
    event: "VSM Night Run Vũng Tàu",
    location: "Vũng Tàu",
    year: 2023,
    category: "night-run",
    description: "Chạy đêm dọc bờ biển Vũng Tàu",
    participants: 1200,
  },
];

const categoryLabels = {
  marathon: "Marathon",
  "fun-run": "Fun Run",
  "trail-run": "Trail Run",
  "night-run": "Night Run",
};

const categoryColors = {
  marathon: "bg-red-500",
  "fun-run": "bg-green-500",
  "trail-run": "bg-orange-500",
  "night-run": "bg-purple-500",
};

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>(mockGalleryImages);
  const [filteredImages, setFilteredImages] =
    useState<GalleryImage[]>(mockGalleryImages);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const years = Array.from(new Set(images.map((img) => img.year))).sort(
    (a, b) => b - a
  );
  const locations = Array.from(
    new Set(images.map((img) => img.location))
  ).sort();
  const categories = Array.from(new Set(images.map((img) => img.category)));

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  useEffect(() => {
    let filtered = images;
    if (yearFilter !== "all") {
      filtered = filtered.filter((img) => img.year.toString() === yearFilter);
    }
    if (categoryFilter !== "all") {
      filtered = filtered.filter((img) => img.category === categoryFilter);
    }
    if (locationFilter !== "all") {
      filtered = filtered.filter((img) => img.location === locationFilter);
    }
    setFilteredImages(filtered);
  }, [images, yearFilter, categoryFilter, locationFilter]);

  const groupedImages = years.reduce((acc, year) => {
    acc[year] = filteredImages.filter((img) => img.year === year);
    return acc;
  }, {} as Record<number, GalleryImage[]>);

  const openLightbox = (image: GalleryImage) => {
    setSelectedImage(image);
    const index = filteredImages.findIndex((img) => img.id === image.id);
    setCurrentImageIndex(index);
  };

  const navigateImage = (direction: "prev" | "next") => {
    const newIndex =
      direction === "prev"
        ? currentImageIndex > 0
          ? currentImageIndex - 1
          : filteredImages.length - 1
        : currentImageIndex < filteredImages.length - 1
        ? currentImageIndex + 1
        : 0;
    setCurrentImageIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  const resetFilters = () => {
    setYearFilter("all");
    setCategoryFilter("all");
    setLocationFilter("all");
  };

  const isMobile = useMediaQuery({ maxWidth: 639 });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="pt-16">
          <section className="py-16 bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-blue-900 dark:via-gray-900 dark:to-purple-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <div className="flex items-center justify-center mb-6">
                  <Camera className="h-10 w-10 text-blue-600 dark:text-blue-400 mr-4" />
                  <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Thư viện ảnh VSM
                  </h1>
                </div>
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Khám phá những khoảnh khắc đáng nhớ từ các sự kiện chạy bộ của
                  Vietnam Student Marathon.
                </p>
                <div className="flex items-center justify-center mt-8 space-x-6 sm:space-x-10 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  <div className="flex items-center">
                    <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                    <span>{images.length} ảnh kỷ niệm</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                    <span>2023 - 2025</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-green-500" />
                    <span>Hàng nghìn runner</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Đang tải thư viện ảnh...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-blue-900 dark:via-gray-900 dark:to-purple-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="flex items-center justify-center mb-6">
                <Camera className="h-10 w-10 text-blue-600 dark:text-blue-400 mr-4" />
                <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Thư viện ảnh VSM
                </h1>
              </div>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Khám phá những khoảnh khắc đáng nhớ từ các sự kiện chạy bộ của
                Vietnam Student Marathon, nơi tinh thần thể thao và cộng đồng
                hòa quyện.
              </p>
              <div className="flex items-center justify-center mt-8 space-x-6 sm:space-x-10 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                <div className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                  <span>{images.length} ảnh kỷ niệm</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                  <span>2023 - 2025</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-green-500" />
                  <span>Hàng nghìn runner</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-4 sm:py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="sm:flex sm:items-center sm:justify-between sm:gap-4 flex justify-between">
                <div className="flex items-center space-x-3 sm:mb-0">
                  <Filter className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    Lọc ảnh:
                  </span>
                </div>
                {/* Mobile Dropdown */}
                <div className="sm:hidden relative w-[150px]">
                  <Button
                    variant="outline"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg flex items-center justify-between"
                  >
                    <span>Bộ lọc</span>
                    {isFilterOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                  <AnimatePresence>
                    {isFilterOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-4 z-20"
                      >
                        <div className="flex flex-col gap-4">
                          <Select
                            value={yearFilter}
                            onValueChange={setYearFilter}
                          >
                            <SelectTrigger className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-lg">
                              <SelectValue placeholder="Chọn năm" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Tất cả năm</SelectItem>
                              {years.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            value={categoryFilter}
                            onValueChange={setCategoryFilter}
                          >
                            <SelectTrigger className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-lg">
                              <SelectValue placeholder="Loại sự kiện" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">
                                Tất cả sự kiện
                              </SelectItem>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {categoryLabels[category]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select
                            value={locationFilter}
                            onValueChange={setLocationFilter}
                          >
                            <SelectTrigger className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-lg">
                              <SelectValue placeholder="Địa điểm" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">
                                Tất cả địa điểm
                              </SelectItem>
                              {locations.map((location) => (
                                <SelectItem key={location} value={location}>
                                  {location}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {(yearFilter !== "all" ||
                            categoryFilter !== "all" ||
                            locationFilter !== "all") && (
                            <Button
                              variant="outline"
                              onClick={resetFilters}
                              className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Xóa bộ lọc
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {/* Desktop Layout */}
                <div className="hidden sm:flex flex-wrap items-center gap-4">
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="w-36 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-lg">
                      <SelectValue placeholder="Chọn năm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả năm</SelectItem>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger className="w-44 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-lg">
                      <SelectValue placeholder="Loại sự kiện" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả sự kiện</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {categoryLabels[category]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={locationFilter}
                    onValueChange={setLocationFilter}
                  >
                    <SelectTrigger className="w-44 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-lg">
                      <SelectValue placeholder="Địa điểm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả địa điểm</SelectItem>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {(yearFilter !== "all" ||
                    categoryFilter !== "all" ||
                    locationFilter !== "all") && (
                    <Button
                      variant="outline"
                      onClick={resetFilters}
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Xóa bộ lọc
                    </Button>
                  )}
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                Hiển thị {filteredImages.length} / {images.length} ảnh
              </div>
            </motion.div>
          </div>
        </section>

        {/* Gallery by Year */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {filteredImages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Images className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Không tìm thấy ảnh
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Không có ảnh nào phù hợp với bộ lọc hiện tại.
                </p>
                <Button
                  onClick={resetFilters}
                  variant="outline"
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg"
                >
                  Xóa bộ lọc
                </Button>
              </motion.div>
            ) : (
              years.map(
                (year) =>
                  groupedImages[year].length > 0 && (
                    <div key={year} className="mb-12">
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                        {year}
                      </h2>
                      <Flicking
                        align="center"
                        circular={true}
                        panelsPerView={isMobile ? 1 : 3}
                        horizontal={true}
                        className="relative"
                        duration={300}
                        easing={(t) => 1 - Math.pow(1 - t, 3)}
                        renderOnSame={true}
                        interruptable={true}
                        moveType="snap"
                        breakpoints={{
                          640: { panelsPerView: 3 },
                        }}
                      >
                        {groupedImages[year].map((image) => (
                          <div
                            key={image.id}
                            className="w-full sm:w-[350px] mx-2"
                            style={{ willChange: "transform" }}
                          >
                            <Card
                              className="group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
                              onClick={() => openLightbox(image)}
                            >
                              <div className="relative w-full aspect-[4/3]">
                                <img
                                  src={image.src}
                                  alt={image.title}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                  decoding="async"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                    <h3 className="font-semibold text-base sm:text-lg">
                                      {image.title}
                                    </h3>
                                    <div className="flex items-center space-x-4 text-xs sm:text-sm mt-2">
                                      <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        {image.year}
                                      </div>
                                      <div className="flex items-center">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        {image.location}
                                      </div>
                                    </div>
                                    {image.participants && (
                                      <div className="flex items-center mt-2 text-xs sm:text-sm">
                                        <Users className="h-4 w-4 mr-1" />
                                        {image.participants.toLocaleString()}{" "}
                                        người tham gia
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="absolute top-3 right-3 opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-1.5">
                                    <ZoomIn className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                  </div>
                                </div>
                                <Badge
                                  variant="secondary"
                                  className={`absolute top-3 left-3 ${
                                    categoryColors[image.category]
                                  } text-white border-none text-xs sm:text-sm`}
                                >
                                  {categoryLabels[image.category]}
                                </Badge>
                              </div>
                            </Card>
                          </div>
                        ))}
                      </Flicking>
                    </div>
                  )
              )
            )}
          </div>
        </section>

        {/* Lightbox Dialog */}
        <Dialog
          open={!!selectedImage}
          onOpenChange={() => setSelectedImage(null)}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] p-0 bg-transparent border-none">
            {selectedImage && (
              <div className="relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                {filteredImages.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-black/60 text-white hover:bg-black/80 rounded-full"
                      onClick={() => navigateImage("prev")}
                      aria-label="Ảnh trước"
                    >
                      <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-black/60 text-white hover:bg-black/80 rounded-full"
                      onClick={() => navigateImage("next")}
                      aria-label="Ảnh tiếp theo"
                    >
                      <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                    </Button>
                  </>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 bg-black/60 text-white hover:bg-black/80 rounded-full"
                  onClick={() => setSelectedImage(null)}
                  aria-label="Đóng"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
                <div className="w-full aspect-[4/3]">
                  <img
                    src={selectedImage.src}
                    alt={selectedImage.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-4 sm:p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-start justify-between">
                    <div className="text-white">
                      <h2 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-3">
                        {selectedImage.title}
                      </h2>
                      <p className="text-sm sm:text-lg mb-3 sm:mb-4">
                        {selectedImage.description}
                      </p>
                      <div className="flex items-center flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {selectedImage.year}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {selectedImage.location}
                        </div>
                        {selectedImage.participants && (
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            {selectedImage.participants.toLocaleString()} người
                            tham gia
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`self-start ${
                        categoryColors[selectedImage.category]
                      } text-white border-none text-xs sm:text-sm`}
                    >
                      {categoryLabels[selectedImage.category]}
                    </Badge>
                  </div>
                </div>
                {filteredImages.length > 1 && (
                  <div className="absolute top-2 sm:top-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-xs sm:text-sm">
                    {currentImageIndex + 1} / {filteredImages.length}
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
}
