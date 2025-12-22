import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FeaturedSection } from "@/components/FeaturedSection";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Velocity | Premium F1 & Supercar Experience</title>
        <meta name="description" content="Explore the world's most exhilarating cars and legendary F1 drivers. Immerse yourself in the ultimate automotive experience with stunning visuals and racing telemetry." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        <HeroSection />
        <FeaturedSection />
        <Footer />
      </div>
    </>
  );
};

export default Index;
