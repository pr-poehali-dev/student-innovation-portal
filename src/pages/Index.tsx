import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SectionCards from "@/components/SectionCards";
import EventCalendar from "@/components/EventCalendar";
import AcceleratorSection from "@/components/AcceleratorSection";
import ContactsSection from "@/components/ContactsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <SectionCards />
        <EventCalendar />
        <AcceleratorSection />
        <ContactsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
