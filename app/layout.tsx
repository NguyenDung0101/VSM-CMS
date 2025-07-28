import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  icons: {
    // Dành cho tab trình duyệt, bookmarks (ưu tiên file .png chất lượng cao hơn)
    icon: "/favicon/favicon-16x16.png",

    // Một số trình duyệt cũ hơn vẫn dùng 'shortcut icon'
    shortcut: "/favicon/favicon.ico",

    // Dành cho khi ghim ra màn hình chính của các thiết bị Apple
    apple: "/favicon/apple-touch-icon.png",
  },

  title: "VSM - Vietnam Student Marathon",
  description:
    "Trang chủ chính thức của Vietnam Student Marathon - Nơi kết nối cộng đồng chạy bộ sinh viên Việt Nam",
  generator: "VSM - Vietnam Student Marathon",
  applicationName: "VSM - Vietnam Student Marathon",
  authors: [
    {
      name: "VSM Team",
      url: "img/logo.png",
    },
  ],
  keywords: [
    "VSM",
    "Vietnam Student Marathon",
    "chạy bộ sinh viên",
    "cộng đồng chạy bộ",
    "giải chạy sinh viên",
    "sự kiện thể thao",
    "sinh viên Việt Nam",
    "marathon sinh viên",
    "sự kiện chạy bộ",
    "cộng đồng thể thao",
    "sức khỏe sinh viên",
    "lối sống lành mạnh",
    "giải chạy Việt Nam",
    "chạy bộ Việt Nam",
    "sự kiện thể thao sinh viên",
    "cộng đồng sinh viên",
    "giải chạy marathon",
    "sự kiện thể thao Việt Nam",
    "chạy bộ cộng đồng",
    "sinh viên thể thao",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
