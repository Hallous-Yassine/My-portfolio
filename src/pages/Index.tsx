import { lazy, Suspense } from "react";
import NetworkBackground from "@/components/NetworkBackground";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Certifications from "@/components/Certifications";
import Experiences from "@/components/Experiences";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";

const Journey = lazy(() => import("@/components/Journey"));

const Index = () => {
  return (
    <div className="relative min-h-screen">
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        Skip to content
      </a>
      <NetworkBackground />
      <Navigation />
      <main className="relative z-10">
        <Hero />
        <About />
        <Experiences />
        <Projects />
        <Certifications />
        <Suspense
          fallback={
            <section className="py-20 px-4">
              <div className="container mx-auto">
                <Skeleton className="h-12 w-64 mx-auto mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-80 w-full rounded-lg" />
                  ))}
                </div>
              </div>
            </section>
          }
        >
          <Journey />
        </Suspense>
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
