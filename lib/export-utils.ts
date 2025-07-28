import * as XLSX from "xlsx"
import { mockPosts, type Post } from "./mock-data"

export interface ExportData {
  posts: Post[]
  comments?: any[]
  events?: any[]
}

export const exportToExcel = (data: ExportData, filename = "vsm-data") => {
  const workbook = XLSX.utils.book_new()

  // Export Posts
  if (data.posts && data.posts.length > 0) {
    const postsData = data.posts.map((post) => ({
      ID: post.id,
      "Tiêu đề": post.title,
      "Mô tả": post.excerpt,
      "Tác giả": post.author,
      "Danh mục": getCategoryText(post.category),
      "Trạng thái": post.status === "published" ? "Đã xuất bản" : "Bản nháp",
      "Lượt xem": post.views,
      "Lượt thích": post.likes,
      "Số bình luận": post.commentsCount,
      "Nổi bật": post.featured ? "Có" : "Không",
      "Ngày tạo": new Date(post.date).toLocaleDateString("vi-VN"),
      Tags: post.tags?.join(", ") || "",
    }))

    const postsWorksheet = XLSX.utils.json_to_sheet(postsData)
    XLSX.utils.book_append_sheet(workbook, postsWorksheet, "Bài viết")
  }

  // Export Comments
  if (data.comments && data.comments.length > 0) {
    const commentsData = data.comments.map((comment: any) => ({
      ID: comment.id,
      "Người dùng": comment.userName,
      "Nội dung": comment.content,
      "Bài viết ID": comment.postId,
      "Trạng thái": getCommentStatusText(comment.status),
      "Ngày tạo": new Date(comment.createdAt).toLocaleDateString("vi-VN"),
    }))

    const commentsWorksheet = XLSX.utils.json_to_sheet(commentsData)
    XLSX.utils.book_append_sheet(workbook, commentsWorksheet, "Bình luận")
  }

  // Export Events
  if (data.events && data.events.length > 0) {
    const eventsData = data.events.map((event: any) => ({
      ID: event.id,
      "Tên sự kiện": event.name,
      "Mô tả": event.description,
      "Địa điểm": event.location,
      "Ngày tổ chức": new Date(event.date).toLocaleDateString("vi-VN"),
      "Số lượng tối đa": event.maxParticipants,
      "Đã đăng ký": event.currentParticipants,
      "Loại sự kiện": getEventCategoryText(event.category),
      "Trạng thái": getEventStatusText(event.status),
      "Cự ly": event.distance || "",
      "Phí tham gia": event.registrationFee || 0,
      "Xuất bản": event.published ? "Có" : "Không",
      "Ngày tạo": new Date(event.createdAt).toLocaleDateString("vi-VN"),
    }))

    const eventsWorksheet = XLSX.utils.json_to_sheet(eventsData)
    XLSX.utils.book_append_sheet(workbook, eventsWorksheet, "Sự kiện")
  }

  // Save file
  const timestamp = new Date().toISOString().split("T")[0]
  XLSX.writeFile(workbook, `${filename}-${timestamp}.xlsx`)
}

export const exportPostsToExcel = (posts: Post[] = mockPosts) => {
  exportToExcel({ posts }, "vsm-bai-viet")
}

export const exportCommentsToExcel = (comments: any[]) => {
  exportToExcel({ comments }, "vsm-binh-luan")
}

export const exportEventsToExcel = (events: any[]) => {
  exportToExcel({ events }, "vsm-su-kien")
}

// Helper functions
const getCategoryText = (category: string) => {
  switch (category) {
    case "training":
      return "Huấn luyện"
    case "nutrition":
      return "Dinh dưỡng"
    case "events":
      return "Sự kiện"
    case "tips":
      return "Mẹo hay"
    default:
      return category
  }
}

const getCommentStatusText = (status: string) => {
  switch (status) {
    case "approved":
      return "Đã duyệt"
    case "pending":
      return "Chờ duyệt"
    case "rejected":
      return "Đã từ chối"
    default:
      return "Không xác định"
  }
}

const getEventCategoryText = (category: string) => {
  switch (category) {
    case "marathon":
      return "Marathon"
    case "fun-run":
      return "Fun Run"
    case "trail-run":
      return "Trail Run"
    case "night-run":
      return "Night Run"
    default:
      return category
  }
}

const getEventStatusText = (status: string) => {
  switch (status) {
    case "upcoming":
      return "Sắp diễn ra"
    case "ongoing":
      return "Đang diễn ra"
    case "completed":
      return "Đã kết thúc"
    case "cancelled":
      return "Đã hủy"
    default:
      return "Không xác định"
  }
}

// Import functions
export const importFromExcel = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })

        const result: any = {}

        // Read each sheet
        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json(worksheet)
          result[sheetName] = jsonData
        })

        resolve(result)
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = () => reject(new Error("Không thể đọc file"))
    reader.readAsArrayBuffer(file)
  })
}
