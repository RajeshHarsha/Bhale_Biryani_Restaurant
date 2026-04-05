import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { MenuSection } from "@/components/menu-section";
import { ReviewsSection } from "@/components/reviews-section";
import { LocationSection } from "@/components/location-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <MenuSection />
      <ReviewsSection />
      <LocationSection />
      <Footer />
    </main>
  );
}
