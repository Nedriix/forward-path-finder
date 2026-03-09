import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import LicenseSection from "@/components/LicenseSection";
import TrainingSection from "@/components/TrainingSection";
import PricingSection from "@/components/PricingSection";
import FleetSection from "@/components/FleetSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <LicenseSection />
      <TrainingSection />
      <PricingSection />
      <FleetSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
