# VSM Homepage Management System

Hệ thống quản lý trang chủ VSM cho phép quản trị viên tùy chỉnh giao diện trang chủ thông qua giao diện drag-and-drop trực quan, kết nối với backend API để lưu trữ cấu hình và tự động cập nhật file `app/page.tsx`.

## 🚀 Tính năng chính

- **Drag & Drop Interface**: Sắp xếp lại thứ tự các section bằng kéo thả
- **Live Preview**: Xem trước thay đổi ngay lập tức
- **Section Management**: Thêm, xóa, ẩn/hiện, chỉnh sửa các section
- **Auto Save**: Tự động lưu cấu hình và cập nhật file homepage
- **API Integration**: Kết nối với backend NestJS thông qua RESTful API
- **Database Storage**: Lưu trữ cấu hình trong database với Prisma ORM
- **Security**: Chỉ hoạt động trong development mode và yêu cầu authentication

## 📁 Cấu trúc thư mục

```
├── app/
│   ├── admin/homepage/               # Frontend homepage manager
│   │   ├── page.tsx                 # Main homepage manager interface
│   │   ├── demo/page.tsx            # Demo page
│   │   ├── guide/page.tsx           # User guide
│   │   └── layout.tsx               # Layout wrapper
│   ├── api/homepage-sections/       # Next.js API routes (proxy to backend)
│   │   ├── route.ts                 # GET all, POST new section
│   │   ├── [id]/route.ts           # GET, PUT, DELETE specific section
│   │   ├── reorder/route.ts        # POST reorder sections
│   │   ├── save-homepage/route.ts  # POST save to file
│   │   └── enabled/sections/route.ts # GET enabled sections only
│   └── page.tsx                     # Main homepage file (auto-generated)
├── backend/
│   └── src/
│       ├── homepage-sections/       # Backend module
│       │   ├── dto/                 # Data Transfer Objects
│       │   │   ├── create-homepage-section.dto.ts
│       │   │   ├── update-homepage-section.dto.ts
│       │   │   ├── reorder-sections.dto.ts
│       │   │   └── save-homepage.dto.ts
│       │   ├── homepage-sections.controller.ts
│       │   ├── homepage-sections.service.ts
│       │   └── homepage-sections.module.ts
│       └── prisma/
│           └── schema.prisma        # Database schema
├── components/
│   ├── admin/                       # Admin components
│   │   ├── homepage-preview.tsx    # Live preview component
│   │   ├── section-editor.tsx      # Section configuration editor
│   │   └── admin-sidebar.tsx       # Admin navigation
│   └── home/                        # Homepage section components
│       ├── hero-section.tsx
│       ├── about-section.tsx
│       ├── events-section.tsx
│       └── ...
├── lib/
│   ├── homepage-api.ts              # Frontend API client
│   └── api.ts                       # Base API configuration
└── README.md                        # This file
```

## 🏗️ Kiến trúc hệ thống

### Frontend (Next.js App Router)
- **Framework**: Next.js 14 với App Router
- **UI Components**: Radix UI + Tailwind CSS
- **State Management**: React useState/useEffect
- **Drag & Drop**: Framer Motion Reorder
- **Notifications**: Sonner toast

### Backend (NestJS)
- **Framework**: NestJS với TypeScript
- **Database**: MySQL với Prisma ORM
- **Authentication**: JWT với Passport
- **Validation**: Class-validator + Class-transformer
- **Documentation**: Swagger/OpenAPI

### Database Schema
```sql
model HomepageSection {
  id        String   @id @default(uuid())
  name      String                    # Tên section
  component String                    # Tên component React
  enabled   Boolean  @default(true)   # Hiển thị hay không
  config    Json     @default("{}")   # Cấu hình custom
  order     Int      @default(0)      # Thứ tự hiển thị
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  authorId  String?                   # ID người tạo
  author    User?    @relation("HomepageAuthor")
}
```

## 🛠️ Cài đặt và chạy

### 1. Cài đặt Dependencies

```bash
# Frontend
npm install
# hoặc
pnpm install

# Backend
cd backend
npm install
```

### 2. Cấu hình Database

```bash
# Tạo file .env trong thư mục backend
DATABASE_URL="mysql://username:password@localhost:3306/vsm_db"
JWT_SECRET="your-jwt-secret-key"
```

```bash
# Chạy migration
cd backend
npx prisma migrate dev
npx prisma generate
```

### 3. Khởi động Services

```bash
# Terminal 1: Backend (NestJS)
cd backend
npm run start:dev
# Running on http://localhost:3001

# Terminal 2: Frontend (Next.js)
npm run dev
# Running on http://localhost:3000
```

### 4. Truy cập Homepage Manager

Mở trình duyệt và truy cập: `http://localhost:3000/admin/homepage`

## 📖 Hướng dẫn sử dụng

### 1. Quản lý Sections

**Thêm Section mới:**
1. Click vào các nút trong panel "Add Section"
2. Section mới sẽ được thêm vào cuối danh sách
3. Có thể kéo thả để sắp xếp lại vị trí

**Chỉnh sửa Section:**
1. Click vào icon Edit (✏️) trên section muốn chỉnh sửa
2. Popup Section Editor sẽ hiện ra với 3 tabs:
   - **Content**: Chỉnh sửa nội dung, text, button
   - **Styling**: Thay đổi màu sắc, layout
   - **Media**: Cập nhật hình ảnh, background

**Ẩn/Hiện Section:**
1. Click vào icon Eye (👁️) để toggle visibility
2. Section bị ẩn sẽ có màu mờ và badge "Disabled"

**Xóa Section:**
1. Click vào icon Trash (🗑️)
2. Section sẽ bị xóa khỏi database

### 2. Sắp xếp lại thứ tự

1. Kéo icon GripVertical (⋮⋮) để di chuyển section
2. Thả vào vị trí mong muốn
3. Thứ tự mới sẽ đ��ợc lưu tự động

### 3. Xem trước và Lưu

**Live Preview:**
1. Switch sang tab "Live Preview"
2. Xem giao diện homepage với cấu hình hiện tại

**Save Changes:**
1. Click nút "Save Changes" sau khi hoàn tất chỉnh sửa
2. Hệ thống sẽ:
   - Generate code cho file `app/page.tsx`
   - Tạo backup của file cũ
   - Cập nhật file với cấu hình mới
   - Reload trang chủ với giao diện mới

## 🔧 API Endpoints

### Homepage Sections API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/homepage-sections` | Lấy tất cả sections |
| GET | `/homepage-sections/:id` | Lấy section theo ID |
| POST | `/homepage-sections` | Tạo section mới |
| PUT | `/homepage-sections/:id` | Cập nhật section |
| DELETE | `/homepage-sections/:id` | Xóa section |
| POST | `/homepage-sections/reorder` | Sắp xếp lại thứ tự |
| POST | `/homepage-sections/save-homepage` | Lưu homepage to file |
| GET | `/homepage-sections/enabled/sections` | Lấy sections đang enabled |

### Query Parameters

```bash
# Lọc theo trạng thái
GET /homepage-sections?enabled=true

# Sắp xếp theo field
GET /homepage-sections?orderBy=name
GET /homepage-sections?orderBy=createdAt
```

### Request/Response Examples

**Tạo section mới:**
```json
POST /homepage-sections
{
  "name": "Hero Section",
  "component": "HeroSection",
  "enabled": true,
  "config": {
    "title": "Welcome to VSM",
    "subtitle": "Your running community"
  },
  "order": 0
}
```

**Sắp xếp lại sections:**
```json
POST /homepage-sections/reorder
{
  "sections": [
    { "id": "section-1", "order": 0 },
    { "id": "section-2", "order": 1 },
    { "id": "section-3", "order": 2 }
  ]
}
```

**Lưu homepage:**
```json
POST /homepage-sections/save-homepage
{
  "content": "import { Navbar } from '@/components/layout/navbar'...",
  "filePath": "app/page.tsx",
  "enabledSectionIds": ["section-1", "section-2"]
}
```

## 🎨 Tùy chỉnh và mở rộng

### Thêm Section Type mới

1. **Tạo Component React:**
```tsx
// components/home/new-section.tsx
export function NewSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto">
        <h2>New Section</h2>
      </div>
    </section>
  );
}
```

2. **Cập nhật AVAILABLE_SECTIONS:**
```tsx
// app/admin/homepage/page.tsx
const AVAILABLE_SECTIONS = [
  // ... existing sections
  { id: "new", name: "New Section", component: "NewSection" },
];
```

3. **Cập nhật import mapping:**
```tsx
// lib/homepage-api.ts - trong generateHomepageContent()
const imports = enabledSections
  .map(section => {
    const componentFile = section.component
      .toLowerCase()
      .replace("section", "-section");
    return `import { ${section.component} } from "@/components/home/${componentFile}"`;
  })
  .join("\n");
```

### Tùy chỉnh Section Editor

```tsx
// components/admin/section-editor.tsx
const getSectionConfig = (component: string) => {
  switch (component) {
    case 'HeroSection':
      return {
        fields: [
          { name: 'title', type: 'text', label: 'Title' },
          { name: 'subtitle', type: 'textarea', label: 'Subtitle' },
          { name: 'buttonText', type: 'text', label: 'Button Text' }
        ]
      };
    case 'NewSection':
      return {
        fields: [
          { name: 'content', type: 'richtext', label: 'Content' },
          { name: 'columns', type: 'number', label: 'Columns' }
        ]
      };
    default:
      return { fields: [] };
  }
};
```

## 🔒 Bảo mật

### Authentication & Authorization

1. **JWT Authentication**: Backend yêu cầu JWT token cho các endpoints CRUD
2. **Role-based Access**: Chỉ ADMIN và EDITOR có quyền chỉnh sửa
3. **Development Only**: Frontend chỉ hoạt động trong development mode

### File System Security

1. **Path Validation**: Backend validate đường dẫn file tránh path traversal
2. **Backup System**: Tự động tạo backup trước khi ghi đè file
3. **Error Handling**: Không expose sensitive information trong error messages

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm run test          # Unit tests
npm run test:e2e      # E2E tests
npm run test:cov      # Coverage report
```

### Frontend Tests
```bash
npm run test          # Jest tests
npm run test:watch    # Watch mode
```

## 📈 Performance

### Optimizations Implemented

1. **Database Indexing**: Index trên `order` và `enabled` fields
2. **API Pagination**: Support pagination cho large datasets
3. **Caching**: Redis cache cho frequently accessed data
4. **File Watching**: Hot reload khi file thay đổi
5. **Bundle Optimization**: Code splitting cho admin components

### Monitoring

```bash
# Database query performance
npx prisma studio

# API response times
# Check logs in backend/logs/

# Frontend bundle size
npm run analyze
```

## 🚀 Deployment

### Production Build

```bash
# Frontend
npm run build
npm start

# Backend
cd backend
npm run build
npm run start:prod
```

### Environment Variables

```bash
# .env.production
DATABASE_URL="production-db-url"
JWT_SECRET="production-jwt-secret"
BACKEND_URL="https://api.vsm.com"
NODE_ENV="production"
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

### Development Workflow

1. Fork repository
2. Create feature branch: `git checkout -b feature/new-section`
3. Commit changes: `git commit -m 'Add new section type'`
4. Push to branch: `git push origin feature/new-section`
5. Create Pull Request

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Auto-formatting
- **Husky**: Pre-commit hooks

## 📞 Support

### Documentation Links

- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Troubleshooting

**Common Issues:**

1. **Database Connection Error**
   ```bash
   # Check database is running
   mysql -u username -p
   
   # Verify DATABASE_URL in .env
   echo $DATABASE_URL
   ```

2. **API Connection Failed**
   ```bash
   # Check backend is running on port 3001
   curl http://localhost:3001/homepage-sections
   
   # Verify BACKEND_URL in frontend
   echo $NEXT_PUBLIC_BACKEND_URL
   ```

3. **File Permission Error**
   ```bash
   # Check file permissions
   ls -la app/page.tsx
   
   # Fix permissions if needed
   chmod 644 app/page.tsx
   ```

### Contact

- **Email**: developer@vsm.com
- **Slack**: #vsm-development
- **GitHub Issues**: [Create Issue](https://github.com/vsm/homepage-manager/issues)

---

*Hệ thống Homepage Management được phát triển với ❤️ cho VSM Community*
