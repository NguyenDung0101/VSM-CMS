"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

const YOUTUBE_ID = "4EGVAQYuqsU";

export function GallerySection() {
  const [muted, setMuted] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Load YouTube IFrame API
  useEffect(() => {
    if (window.YT) return;
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
  }, []);

  // Khởi tạo player và đồng bộ trạng thái mute
  useEffect(() => {
    let player: any = null;
    function onYouTubeIframeAPIReady() {
      player = new window.YT.Player(iframeRef.current, {
        events: {
          onReady: () => {
            if (muted) player.mute();
            else player.unMute();
          },
        },
      });
    }
    // Nếu API đã sẵn sàng
    if (window.YT && window.YT.Player) {
      onYouTubeIframeAPIReady();
    } else {
      // Đợi API sẵn sàng
      (window as any).onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    }
    // Cleanup
    return () => {
      if (player && player.destroy) player.destroy();
    };
    // eslint-disable-next-line
  }, []);

  // Khi bấm nút mute/unmute
  const handleToggleMute = () => {
    setMuted((prev) => {
      const next = !prev;
      const iframeWin = iframeRef.current?.contentWindow;
      if (iframeWin) {
        iframeWin.postMessage(
          JSON.stringify({
            event: "command",
            func: next ? "mute" : "unMute",
            args: [],
          }),
          "*"
        );
      }
      return next;
    });
  };

  const VIDEO_URL = `https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&enablejsapi=1`;

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold flex items-center justify-center gap-2 flex-col">
            VIETNAM STUDENT MARATHON{" "}
            <span className="gradient-text">RUN TO LAMPAS 2024</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-700 bg-black relative">
            <iframe
              ref={iframeRef}
              width="100%"
              height="100%"
              src={VIDEO_URL}
              title="VSM Video"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-full h-full"
              style={{ pointerEvents: "none" }}
            ></iframe>
            {/* Nút bật/tắt âm thanh */}
            <button
              onClick={handleToggleMute}
              className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition"
              aria-label={muted ? "Bật âm thanh" : "Tắt âm thanh"}
              style={{ zIndex: 10 }}
            >
              {muted ? (
                <VolumeX className="w-6 h-6" />
              ) : (
                <Volume2 className="w-6 h-6" />
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
