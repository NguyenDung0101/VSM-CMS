"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const partners = [
  { name: "VCCI", src: "/img/taitro/VCCI.webp", url: "https://example.com" },
  { name: "KNQG", src: "/img/taitro/KNQG.webp", url: "https://example.com" },
  { name: "BNI", src: "/img/taitro/BNI.webp", url: "https://example.com" },
  { name: "SP", src: "/img/taitro/SP.webp", url: "https://example.com" },
  {
    name: "Smentor",
    src: "/img/taitro/Smentor.webp",
    url: "https://example.com",
  },
  { name: "CSMO", src: "/img/taitro/CSMO.webp", url: "https://example.com" },
  { name: "VRA", src: "/img/taitro/VRA.webp", url: "https://example.com" },
  { name: "VK", src: "/img/taitro/VK.webp", url: "https://example.com" },
  { name: "Richs", src: "/img/taitro/Richs.webp", url: "https://example.com" },
  { name: "VTF", src: "/img/taitro/VTF.webp", url: "https://example.com" },
  { name: "UEH", src: "/img/taitro/UEH.webp", url: "https://www.ueh.edu.vn/" },
  { name: "UFM", src: "/img/taitro/UFM.webp", url: "https://www.ufm.edu.vn/" },
  { name: "HUIT", src: "/img/taitro/HUIT.webp", url: "https://huit.edu.vn/" },
  { name: "VSM", src: "/img/taitro/VSM.webp", url: "https://vsm.org.vn/" },
  { name: "WK", src: "/img/taitro/WK.webp", url: "https://worldkings.org/" },
];

export default function PartnersSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-muted/10 to-muted/30">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            NHÀ TÀI TRỢ VÀ ĐỐI TÁC
          </h2>
        </motion.div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <Link
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={partner.src}
                  alt={partner.name}
                  width={200}
                  height={200}
                  className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
