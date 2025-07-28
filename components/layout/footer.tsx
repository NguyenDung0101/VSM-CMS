"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Youtube,
  Send,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { SiFacebook, SiInstagram, SiTiktok, SiYoutube } from "react-icons/si";
import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
    alert("Cảm ơn bạn đã đăng ký nhận tin!");
  };

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Cột 1: Logo & Info */}
          <div className="space-y-4">
            <Image
              src="/img/logo-vsm.png"
              width={120}
              height={120}
              alt="VSM Logo"
              className="rounded-lg"
            />
            <div className="flex items-start gap-2 text-muted-foreground text-sm">
              <MapPin className="w-4 h-4 mt-1" />
              <span>
                Tầng 15 - 279 Nguyễn Tri Phương, Phường Diên Hồng, TP. HCM
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Phone className="w-4 h-4" />
              <span>(+84) 329 381 489</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Mail className="w-4 h-4" />
              <span>vsm.org.vn@gmail.com</span>
            </div>
            {/* <p className="text-xs text-muted-foreground pt-2">
              &copy; {new Date().getFullYear()} Vietnam Student Marathon.
              <br />
              Phát triển bởi Phòng Công nghệ thông tin.
            </p> */}
          </div>

          {/* Cột 2: Liên kết nhanh */}
          <div>
            <h4 className="font-semibold mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>
                <Link href="/about" className="hover:text-primary">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-primary">
                  Sự kiện
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-primary">
                  Cửa hàng
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-primary">
                  Tin tức
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Kết nối mạng xã hội */}
          <div>
            <h4 className="font-semibold mb-4">Kết nối với chúng tôi</h4>
            <div className="flex space-x-4 mb-4">
              <Link
                href="https://www.facebook.com/vietnamstudentmarathon"
                target="_blank"
                className="hover:text-primary"
              >
                <SiFacebook className="h-6 w-6" />
              </Link>
              <Link href="#" className="hover:text-primary">
                <SiYoutube className="h-6 w-6" />
              </Link>
              <Link href="#" className="hover:text-primary">
                <SiInstagram className="h-6 w-6" />
              </Link>
              <Link href="#" className="hover:text-primary">
                <SiTiktok className="h-6 w-6" />
              </Link>
            </div>

            <iframe
              src="https://www.facebook.com/plugins/page.php?href=https://www.facebook.com/vietnamstudentmarathon&tabs=timeline&width=300&height=130&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true"
              width="300px"
              height="130px"
              style={{ border: "none", overflow: "hidden", display: "block" }}
              scrolling="no"
              frameBorder={0}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
              title="Fanpage Facebook"
            ></iframe>
          </div>

          {/* Cột 4: Đăng ký nhận tin */}
          <div>
            <h4 className="font-semibold mb-4">Đăng ký nhận tin mới</h4>
            <form
              className="flex items-center space-x-2 mb-6"
              onSubmit={handleSubscribe}
            >
              <input
                type="email"
                required
                placeholder="Email của bạn"
                className="flex-1 px-3 py-2 rounded border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="bg-primary text-white rounded p-2 hover:bg-primary/90"
                aria-label="Gửi"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
            {/* <p className="text-muted-foreground text-xs">
              Đăng ký để nhận thông tin sự kiện và ưu đãi mới nhất từ chúng tôi.
            </p> */}
            <div>
              <h4 className="font-semibold mb-4">Liên hệ</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>
                  <Link href="/help" className="hover:text-primary">
                    Dương Thế Khải
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary">
                    Điện thoại: +84 329381489
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-primary">
                    Email: khaiduong6722@gmail.com
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-primary">
                    Điều khoản sử dụng
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* <div className="border-t mt-8 pt-8 text-center text-muted-foreground text-xs">
          <p>
            &copy; {new Date().getFullYear()} Vietnam Student Marathon. All
            rights reserved.
          </p>
        </div> */}
      </div>
    </footer>
  );
}
