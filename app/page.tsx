import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/components/home/hero-section";
import { AboutSection } from "@/components/home/about-section";
import { EventsSection } from "@/components/home/events-section";
import { NewsSection } from "@/components/home/news-section";
import { TeamSection } from "@/components/home/team-section";
import { GallerySection } from "@/components/home/gallery-section";
import { CTASection } from "@/components/home/cta-section";
import { Footer } from "@/components/layout/footer";
import { CountdownTimer } from "@/components/home/countdown-timer";
import SportsCommunityStory from "@/components/home/SportsCommunityStory";
import Stats from "@/components/common/stats";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <CountdownTimer eventDate="2025-12-28T04:30:00" />
        <AboutSection />
        <Stats />
        <SportsCommunityStory />
        <EventsSection />
        <NewsSection />
        <TeamSection />
        <GallerySection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
