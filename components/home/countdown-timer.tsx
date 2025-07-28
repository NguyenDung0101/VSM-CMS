"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CountdownTimerProps {
  eventDate: string; // ví dụ: "2025-12-28T00:00:00"
}

const LABELS: Record<string, string> = {
  days: "Ngày",
  hours: "Giờ",
  minutes: "Phút",
  seconds: "Giây",
};

export function CountdownTimer({ eventDate }: CountdownTimerProps) {
  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const target = new Date(eventDate).getTime();
    const diff = target - now;

    if (diff <= 0) return null;

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [eventDate]);

  return (
    <div className="flex flex-col items-center justify-center py-6 sm:py-10 gap-4 w-full">
      <div className="flex flex-col sm:flex-row items-center justify-center mt-6 sm:mt-10 gap-4 sm:gap-8 w-full">
        <div className="flex flex-col text-xl sm:text-2xl font-bold tracking-widest gradient-text uppercase text-center sm:text-left">
          Ngày đua: <span className="block sm:inline">28/12/2025</span>
        </div>
        {!timeLeft ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg sm:text-2xl font-bold text-red-600 dark:text-red-400 mt-4 sm:mt-8 text-center uppercase tracking-widest"
          >
            Sự kiện đã bắt đầu!
          </motion.p>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-row gap-2 sm:gap-6 bg-gradient-to-r dark:from-zinc-900/80 dark:via-zinc-800/90 dark:to-zinc-900/80 px-3 sm:px-6 py-2 sm:py-4 rounded-xl sm:rounded-2xl shadow-2xl border-2 gradient-border backdrop-blur-md"
          >
            {Object.entries(timeLeft).map(([label, value], idx, arr) => (
              <div
                key={label}
                className="flex flex-col items-center justify-center relative min-w-[48px] sm:min-w-[64px]"
              >
                <div className="text-3xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r block gradient-text drop-shadow-md tabular-nums select-none">
                  {value.toString().padStart(2, "0")}
                </div>
                <div className="text-xs sm:text-sm uppercase mt-1 sm:mt-2 font-bold tracking-widest text-zinc-700 dark:text-zinc-200 select-none">
                  {LABELS[label] || label}
                </div>
                {/* Dấu : giữa các block, trừ block cuối */}
                {idx < arr.length - 1 && (
                  <span className="absolute right-[-12px] sm:right-[-18px] top-1/2 -translate-y-1/2 text-2xl sm:text-4xl font-extrabold gradient-text select-none">
                    :
                  </span>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </div>
      <div className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 italic tracking-wide text-center mt-2">
        VSM - Chạy hết mình, sống trọn đam mê!
      </div>
    </div>
  );
}
