export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "user" | "editor" | "admin"
  createdAt: string
  isActive: boolean
}

export interface Post {
  id: string
  title: string
  excerpt: string
  content: string
  cover: string
  author: string
  authorId: string
  date: string
  category: "training" | "nutrition" | "events" | "tips"
  views: number
  likes: number
  featured: boolean
  status: "published" | "draft"
  tags: string[]
  commentsCount: number
}

export interface Comment {
  id: string
  postId: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  createdAt: string
  status: "approved" | "pending" | "rejected"
  parentId?: string
  replies?: Comment[]
}

export interface Event {
  id: string
  name: string
  description: string
  content: string
  date: string
  location: string
  image: string
  maxParticipants: number
  currentParticipants: number
  registeredUsers: string[]
  category: "marathon" | "fun-run" | "trail-run" | "night-run"
  status: "upcoming" | "ongoing" | "completed" | "cancelled"
  distance?: string
  registrationFee?: number
  requirements?: string
  published: boolean
  authorId: string
  createdAt: string
}

export interface EventRegistration {
  id: string
  eventId: string
  userId: string
  userName: string
  userEmail: string
  phone: string
  emergencyContact: string
  medicalConditions?: string
  experience: "beginner" | "intermediate" | "advanced"
  status: "pending" | "confirmed" | "waitlist" | "cancelled"
  registeredAt: string
}

// THÔNG TIN ĐĂNG NHẬP DEMO:
// Admin: admin@vsm.org.vn / password
// Editor: editor@vsm.org.vn / password
// User 1: user1@vsm.org.vn / password
// User 2: user2@vsm.org.vn / password

export const mockUsers: User[] = [
  {
    id: "admin-1",
    name: "Admin VSM",
    email: "admin@vsm.org.vn",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    role: "admin",
    createdAt: "2024-01-01T00:00:00Z",
    isActive: true,
  },
  {
    id: "editor-1",
    name: "Biên tập viên VSM",
    email: "editor@vsm.org.vn",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    role: "editor",
    createdAt: "2024-01-02T00:00:00Z",
    isActive: true,
  },
  {
    id: "user-1",
    name: "Nguyễn Văn A",
    email: "user1@vsm.org.vn",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    role: "user",
    createdAt: "2024-01-03T00:00:00Z",
    isActive: true,
  },
  {
    id: "user-2",
    name: "Trần Thị B",
    email: "user2@vsm.org.vn",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    role: "user",
    createdAt: "2024-01-04T00:00:00Z",
    isActive: true,
  },
]

export const mockPosts: Post[] = [
  {
    id: "1",
    title: "Hướng dẫn chuẩn bị cho marathon đầu tiên",
    excerpt: "5 điều bạn không thể bỏ qua trước khi bắt đầu hành trình 42 km.",
    content: `
      <h2>Giới thiệu</h2>
      <p>Marathon là một thử thách lớn đối với bất kỳ ai, đặc biệt là những người mới bắt đầu. Việc chuẩn bị kỹ lưỡng không chỉ giúp bạn hoàn thành cuộc đua mà còn đảm bảo an toàn cho sức khỏe.</p>
      
      <h2>1. Lập kế hoạch tập luyện</h2>
      <p>Một kế hoạch tập luyện tốt thường kéo dài từ 16-20 tuần. Bạn nên bắt đầu với những quãng đường ngắn và tăng dần cường độ theo thời gian.</p>
      
      <h2>2. Chế độ dinh dưỡng</h2>
      <p>Dinh dưỡng đóng vai trò quan trọng trong quá trình chuẩn bị. Hãy đảm bảo cung cấp đủ carbohydrate, protein và chất béo tốt cho cơ thể.</p>
      
      <h2>3. Trang thiết bị</h2>
      <p>Đầu tư vào một đôi giày chạy bộ chất lượng và trang phục thoáng mát. Đây là những yếu tố quan trọng ảnh hưởng đến hiệu suất của bạn.</p>
      
      <h2>4. Nghỉ ngơi và phục hồi</h2>
      <p>Đừng quên tầm quan trọng của việc nghỉ ngơi. Cơ thể cần thời gian để phục hồi và phát triển sau mỗi buổi tập.</p>
      
      <h2>5. Tâm lý</h2>
      <p>Chuẩn bị tinh thần là điều không thể thiếu. Hãy đặt mục tiêu thực tế và giữ động lực trong suốt quá trình tập luyện.</p>
      
      <h2>Kết luận</h2>
      <p>Marathon không chỉ là một cuộc đua, mà là một hành trình khám phá bản thân. Với sự chuẩn bị kỹ lưỡng, bạn hoàn toàn có thể chinh phục được cự ly 42.195km này.</p>
    `,
    cover: "/placeholder.svg?height=400&width=800",
    author: "Admin VSM",
    authorId: "admin-1",
    date: "2024-01-10",
    category: "training",
    views: 1250,
    likes: 89,
    featured: true,
    status: "published",
    tags: ["marathon", "training", "beginner"],
    commentsCount: 15,
  },
  {
    id: "2",
    title: "Bí quyết giữ phong độ khi chạy đường dài",
    excerpt: "Chuyên gia VSM chia sẻ các tip giúp bạn tránh chấn thương.",
    content: `
      <h2>Giới thiệu</h2>
      <p>Chạy đường dài đòi hỏi sự kiên trì và kỹ thuật đúng đắn. Dưới đây là những bí quyết giúp bạn duy trì phong độ tốt nhất.</p>
      
      <h2>1. Khởi động đúng cách</h2>
      <p>Luôn dành 10-15 phút để khởi động trước khi chạy. Điều này giúp cơ thể chuẩn bị sẵn sàng và giảm nguy cơ chấn thương.</p>
      
      <h2>2. Kiểm soát nhịp thở</h2>
      <p>Học cách thở đều và sâu. Nhịp thở 3:2 (hít vào 3 bước, thở ra 2 bước) thường hiệu quả với nhiều người.</p>
      
      <h2>3. Duy trì tốc độ ổn định</h2>
      <p>Đừng chạy quá nhanh ngay từ đầu. Hãy giữ một tốc độ mà bạn có thể duy trì trong suốt quãng đường.</p>
    `,
    cover: "/placeholder.svg?height=400&width=800",
    author: "Biên tập viên VSM",
    authorId: "editor-1",
    date: "2025-12-08",
    category: "tips",
    views: 980,
    likes: 67,
    featured: false,
    status: "published",
    tags: ["tips", "endurance", "injury-prevention"],
    commentsCount: 8,
  },
  {
    id: "3",
    title: "Chế độ dinh dưỡng cho vận động viên sinh viên",
    excerpt: "Ăn gì để tối ưu hiệu suất và hồi phục nhanh chóng?",
    content: `
      <h2>Dinh dưỡng cho sinh viên vận động</h2>
      <p>Là sinh viên vận động, việc cân bằng giữa học tập và tập luyện đòi hỏi chế độ dinh dưỡng khoa học.</p>
      
      <h2>Bữa sáng quan trọng</h2>
      <p>Bữa sáng cung cấp năng lượng cho cả ngày học và tập luyện. Nên ăn đủ carbohydrate, protein và vitamin.</p>
      
      <h2>Ăn nhẹ trước tập</h2>
      <p>30-60 phút trước khi tập, hãy ăn nhẹ với thực phẩm dễ tiêu hóa như chuối, yến mạch.</p>
    `,
    cover: "/placeholder.svg?height=400&width=800",
    author: "Admin VSM",
    authorId: "admin-1",
    date: "2024-01-05",
    category: "nutrition",
    views: 756,
    likes: 45,
    featured: true,
    status: "published",
    tags: ["nutrition", "student", "recovery"],
    commentsCount: 3,
  },
]

export const mockComments: Comment[] = [
  {
    id: "comment-1",
    postId: "1",
    userId: "user-1",
    userName: "Nguyễn Văn A",
    userAvatar: "https://randomuser.me/api/portraits/men/3.jpg",
    content: "Bài viết rất hữu ích! Tôi đang chuẩn bị cho marathon đầu tiên và những lời khuyên này rất thực tế.",
    createdAt: "2024-01-11T10:30:00Z",
    status: "approved",
  },
  {
    id: "comment-2",
    postId: "1",
    userId: "user-2",
    userName: "Trần Thị B",
    userAvatar: "https://randomuser.me/api/portraits/women/4.jpg",
    content: "Cảm ơn tác giả đã chia sẻ. Phần về dinh dưỡng rất chi tiết và dễ hiểu.",
    createdAt: "2024-01-11T14:15:00Z",
    status: "approved",
  },
  {
    id: "comment-3",
    postId: "1",
    userId: "user-1",
    userName: "Nguyễn Văn A",
    userAvatar: "https://randomuser.me/api/portraits/men/3.jpg",
    content: "Có thể chia sẻ thêm về lịch tập luyện cụ thể không ạ?",
    createdAt: "2024-01-12T09:20:00Z",
    status: "pending",
  },
  {
    id: "comment-4",
    postId: "2",
    userId: "user-2",
    userName: "Trần Thị B",
    userAvatar: "https://randomuser.me/api/portraits/women/4.jpg",
    content: "Những tip này rất hay, đặc biệt là phần về phục hồi sau chạy.",
    createdAt: "2024-01-09T16:45:00Z",
    status: "approved",
  },
]

export const mockEvents: Event[] = [
  {
    id: "1",
    name: "VSM Marathon 2024",
    description: "Giải chạy marathon thường niên của VSM với cự ly 42.195km",
    content: `
      <h2>Về VSM Marathon 2024</h2>
      <p>VSM Marathon 2024 là sự kiện chạy bộ lớn nhất trong năm của câu lạc bộ, thu hút hàng nghìn vận động viên từ khắp nơi.</p>
      
      <h3>Thông tin chi tiết</h3>
      <ul>
        <li>Cự ly: 42.195km (Marathon chuẩn quốc tế)</li>
        <li>Thời gian: 05:00 - 12:00</li>
        <li>Địa điểm xuất phát: Công viên Thống Nhất</li>
        <li>Địa điểm về đích: Sân vận động Mỹ Đình</li>
      </ul>
      
      <h3>Giải thưởng</h3>
      <ul>
        <li>Giải Nhất nam/nữ: 50 triệu VNĐ + Cup vàng</li>
        <li>Giải Nhì nam/nữ: 30 triệu VNĐ + Cup bạc</li>
        <li>Giải Ba nam/nữ: 20 triệu VNĐ + Cup đồng</li>
        <li>Tất cả finisher đều nhận huy chương</li>
      </ul>
    `,
    date: "2025-12-15T05:00:00Z",
    location: "Công viên Thống Nhất, Hà Nội",
    image: "/placeholder.svg?height=400&width=800",
    maxParticipants: 5000,
    currentParticipants: 3247,
    registeredUsers: ["user-1", "user-2"],
    category: "marathon",
    status: "upcoming",
    distance: "42.195km",
    registrationFee: 500000,
    requirements: "Độ tuổi từ 18-65, có kinh nghiệm chạy marathon, giấy khám sức khỏe",
    published: true,
    authorId: "admin-1",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Fun Run Cuối Tuần",
    description: "Chạy bộ vui vẻ cùng cộng đồng VSM",
    content: `
      <h2>Fun Run Cuối Tuần</h2>
      <p>Sự kiện chạy bộ thư giãn dành cho mọi lứa tuổi, tạo cơ hội giao lưu và rèn luyện sức khỏe.</p>
      
      <h3>Thông tin sự kiện</h3>
      <ul>
        <li>Cự ly: 5km (phù hợp mọi lứa tuổi)</li>
        <li>Thời gian: 06:00 - 08:00</li>
        <li>Địa điểm: Quanh hồ Gươm</li>
        <li>Miễn phí tham gia</li>
      </ul>
    `,
    date: "2024-02-10T06:00:00Z",
    location: "Hồ Gươm, Hà Nội",
    image: "/placeholder.svg?height=400&width=800",
    maxParticipants: 200,
    currentParticipants: 156,
    registeredUsers: ["user-1"],
    category: "fun-run",
    status: "upcoming",
    distance: "5km",
    registrationFee: 0,
    requirements: "Mọi lứa tuổi, trang phục thể thao",
    published: true,
    authorId: "editor-1",
    createdAt: "2024-01-15T00:00:00Z",
  },
]

export const mockEventRegistrations: EventRegistration[] = [
  {
    id: "reg-1",
    eventId: "event-1",
    userId: "user-1",
    userName: "Nguyễn Văn A",
    userEmail: "user1@vsm.org.vn",
    phone: "0123456789",
    emergencyContact: "0987654321",
    medicalConditions: "Không có",
    experience: "intermediate",
    status: "confirmed",
    registeredAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "reg-2",
    eventId: "event-1",
    userId: "user-2",
    userName: "Trần Thị B",
    userEmail: "user2@vsm.org.vn",
    phone: "0123456788",
    emergencyContact: "0987654322",
    experience: "beginner",
    status: "pending",
    registeredAt: "2024-01-21T14:30:00Z",
  },
]
