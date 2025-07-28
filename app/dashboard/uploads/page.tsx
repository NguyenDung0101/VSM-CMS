"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Upload, FolderPlus, Search, Grid3X3, List, Copy, Trash2, Download, Eye, ImageIcon, Folder } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UploadFile {
  id: string
  filename: string
  originalName: string
  path: string
  folder: string
  size: number
  mimeType: string
  uploadedAt: string
  uploadedBy: string
  url: string
}

const folderSchema = z.object({
  name: z.string().min(1, "Tên thư mục không được để trống"),
})

type FolderForm = z.infer<typeof folderSchema>

const mockUploads: UploadFile[] = [
  {
    id: "1",
    filename: "hero-banner.jpg",
    originalName: "hero-banner.jpg",
    path: "/uploads/bai-viet/hero-banner.jpg",
    folder: "bai-viet",
    size: 1024000,
    mimeType: "image/jpeg",
    uploadedAt: "2024-01-01T00:00:00Z",
    uploadedBy: "admin-1",
    url: "https://picsum.photos/800/600?random=1",
  },
  {
    id: "2",
    filename: "event-cover.jpg",
    originalName: "event-cover.jpg",
    path: "/uploads/su-kien/event-cover.jpg",
    folder: "su-kien",
    size: 2048000,
    mimeType: "image/jpeg",
    uploadedAt: "2024-01-02T00:00:00Z",
    uploadedBy: "editor-1",
    url: "https://picsum.photos/800/600?random=2",
  },
  {
    id: "3",
    filename: "avatar-placeholder.jpg",
    originalName: "avatar-placeholder.jpg",
    path: "/uploads/avatar/avatar-placeholder.jpg",
    folder: "avatar",
    size: 512000,
    mimeType: "image/jpeg",
    uploadedAt: "2024-01-03T00:00:00Z",
    uploadedBy: "admin-1",
    url: "https://picsum.photos/400/400?random=3",
  },
]

export default function UploadsPage() {
  const [uploads, setUploads] = useState<UploadFile[]>([])
  const [filteredUploads, setFilteredUploads] = useState<UploadFile[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFolder, setSelectedFolder] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<UploadFile | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const { toast } = useToast()

  const form = useForm<FolderForm>({
    resolver: zodResolver(folderSchema),
    defaultValues: {
      name: "",
    },
  })

  useEffect(() => {
    setUploads(mockUploads)
    setFilteredUploads(mockUploads)
  }, [])

  useEffect(() => {
    let filtered = uploads

    if (searchTerm) {
      filtered = filtered.filter(
        (upload) =>
          upload.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          upload.folder.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedFolder !== "all") {
      filtered = filtered.filter((upload) => upload.folder === selectedFolder)
    }

    setFilteredUploads(filtered)
  }, [uploads, searchTerm, selectedFolder])

  const folders = Array.from(new Set(uploads.map((upload) => upload.folder)))

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      const files = Array.from(e.dataTransfer.files)
      handleFileUpload(files)
    },
    [selectedFolder],
  )

  const handleFileUpload = (files: File[]) => {
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const newUpload: UploadFile = {
          id: `upload-${Date.now()}-${Math.random()}`,
          filename: `${Date.now()}-${file.name}`,
          originalName: file.name,
          path: `/uploads/${selectedFolder === "all" ? "general" : selectedFolder}/${Date.now()}-${file.name}`,
          folder: selectedFolder === "all" ? "general" : selectedFolder,
          size: file.size,
          mimeType: file.type,
          uploadedAt: new Date().toISOString(),
          uploadedBy: "current-user",
          url: `https://picsum.photos/800/600?random=${Date.now()}`,
        }

        setUploads((prev) => [newUpload, ...prev])
      }
    })

    toast({
      title: "Upload thành công",
      description: `Đã upload ${files.length} file(s).`,
    })
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFileUpload(files)
    e.target.value = "" // Reset input
  }

  const handleCreateFolder = (data: FolderForm) => {
    // In real app, this would create a folder on the server
    toast({
      title: "Tạo thư mục thành công",
      description: `Thư mục "${data.name}" đã được tạo.`,
    })
    setIsCreateFolderOpen(false)
    form.reset()
  }

  const handleCopyLink = (upload: UploadFile) => {
    navigator.clipboard.writeText(upload.path)
    toast({
      title: "Đã sao chép",
      description: "Đường dẫn ảnh đã được sao chép vào clipboard.",
    })
  }

  const handleDelete = (uploadId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa file này?")) return

    setUploads((prev) => prev.filter((upload) => upload.id !== uploadId))
    toast({
      title: "Xóa thành công",
      description: "File đã được xóa.",
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Quản lý hình ảnh</h1>
            <p className="text-muted-foreground">Upload và quản lý hình ảnh cho website</p>
          </div>

          <div className="flex items-center space-x-2">
            <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <FolderPlus className="mr-2 h-4 w-4" />
                  Tạo thư mục
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tạo thư mục mới</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleCreateFolder)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên thư mục</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập tên thư mục..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsCreateFolderOpen(false)}>
                        Hủy
                      </Button>
                      <Button type="submit">Tạo thư mục</Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            <Button onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")} variant="outline">
              {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Upload Area */}
        <Card>
          <CardContent className="p-6">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
              }`}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                {isDragOver ? (
                  <p className="text-lg">Thả file vào đây...</p>
                ) : (
                  <div>
                    <p className="text-lg mb-2">Kéo thả file vào đây hoặc click để chọn</p>
                    <p className="text-sm text-muted-foreground">Hỗ trợ: JPG, PNG, GIF, WebP</p>
                  </div>
                )}
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm file..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  variant={selectedFolder === "all" ? "default" : "outline"}
                  onClick={() => setSelectedFolder("all")}
                >
                  <Folder className="mr-2 h-4 w-4" />
                  Tất cả
                </Button>
                {folders.map((folder) => (
                  <Button
                    key={folder}
                    variant={selectedFolder === folder ? "default" : "outline"}
                    onClick={() => setSelectedFolder(folder)}
                  >
                    {folder}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Files Display */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ImageIcon className="mr-2 h-5 w-5" />
              Hình ảnh ({filteredUploads.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredUploads.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-xl text-muted-foreground mb-2">Chưa có hình ảnh nào</p>
                <p className="text-muted-foreground">Upload hình ảnh đầu tiên để bắt đầu</p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredUploads.map((upload) => (
                  <div key={upload.id} className="group relative">
                    <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                      <img
                        src={upload.url || "/placeholder.svg"}
                        alt={upload.originalName}
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => setSelectedImage(upload)}
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                      <Button size="icon" variant="secondary" onClick={() => setSelectedImage(upload)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="secondary" onClick={() => handleCopyLink(upload)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => handleDelete(upload.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm font-medium truncate">{upload.originalName}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <Badge variant="outline">{upload.folder}</Badge>
                        <span>{formatFileSize(upload.size)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredUploads.map((upload) => (
                  <div key={upload.id} className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-muted/50">
                    <img
                      src={upload.url || "/placeholder.svg"}
                      alt={upload.originalName}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{upload.originalName}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <Badge variant="outline">{upload.folder}</Badge>
                        <span>{formatFileSize(upload.size)}</span>
                        <span>{new Date(upload.uploadedAt).toLocaleDateString("vi-VN")}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="icon" variant="ghost" onClick={() => setSelectedImage(upload)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleCopyLink(upload)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => window.open(upload.url, "_blank")}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(upload.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Image Preview Dialog */}
        {selectedImage && (
          <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{selectedImage.originalName}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <img
                  src={selectedImage.url || "/placeholder.svg"}
                  alt={selectedImage.originalName}
                  className="w-full h-auto rounded-lg max-h-96 object-contain"
                />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Tên file:</span> {selectedImage.filename}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Kích thước:</span> {formatFileSize(selectedImage.size)}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Thư mục:</span> {selectedImage.folder}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Ngày upload:</span>{" "}
                    {new Date(selectedImage.uploadedAt).toLocaleDateString("vi-VN")}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Input value={selectedImage.path} readOnly className="flex-1" />
                  <Button onClick={() => handleCopyLink(selectedImage)}>
                    <Copy className="mr-2 h-4 w-4" />
                    Sao chép
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  )
}
