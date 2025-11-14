import { useEffect, useState } from "react";
import { Github, Linkedin, Mail, Download, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const [displayText, setDisplayText] = useState("");
  const roles = [
    "Cybersecurity Enthusiast",
    "AI/ML Developer",
    "Backend Engineer",
    "IoT Specialist"
  ];
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting && charIndex < currentRole.length) {
          setDisplayText(currentRole.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else if (isDeleting && charIndex > 0) {
          setDisplayText(currentRole.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else if (!isDeleting && charIndex === currentRole.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        } else if (isDeleting && charIndex === 0) {
          setIsDeleting(false);
          setRoleIndex((roleIndex + 1) % roles.length);
        }
      },
      isDeleting ? 50 : 100
    );

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, roleIndex, roles]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center px-4">
      <div className="container mx-auto text-center z-10">
        <div className="mb-8 inline-block">
          <div className="font-mono text-primary text-sm mb-2">$ whoami</div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          <span className="text-glow">Yassine Hallous</span>
        </h1>

        <div className="h-16 mb-8">
          <p className="text-2xl md:text-3xl text-muted-foreground font-mono">
            <span className="text-secondary text-glow-purple">{displayText}</span>
            <span className="animate-pulse text-primary">|</span>
          </p>
        </div>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
          Computer Engineering Student specializing in Embedded Systems & IoT.
          Building secure, intelligent systems and pushing the boundaries of technology.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground border-glow"
            onClick={() => scrollToSection("contact")}
          >
            Get In Touch
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-primary/50 hover:bg-primary/10"
            onClick={() => window.open("/CV_Yassine_Hallous.pdf", "_blank")}
          >
            <Download className="w-4 h-4 mr-2" />
            Download CV
          </Button>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="hover:text-primary hover:border-glow transition-all"
            onClick={() => window.open("https://github.com/Hallous-Yassine", "_blank")}
          >
            <Github className="w-6 h-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="hover:text-primary hover:border-glow transition-all"
            onClick={() => window.open("https://linkedin.com/in/yassine-hallous", "_blank")}
          >
            <Linkedin className="w-6 h-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="hover:text-primary hover:border-glow transition-all"
            onClick={() => window.location.href = "mailto:yassine_hallous@ieee.org"}
          >
            <Mail className="w-6 h-6" />
          </Button>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-primary" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
