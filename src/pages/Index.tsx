import NetworkBackground from "@/components/NetworkBackground";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Certifications from "@/components/Certifications";
import Journey from "@/components/Journey";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="relative min-h-screen">
      <NetworkBackground />
      <Navigation />
      <main className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <Certifications />
        <Journey />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
