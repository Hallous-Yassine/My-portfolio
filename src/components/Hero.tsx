import { useEffect, useState } from "react";
import { Github, Linkedin, Mail, Download, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Terminal from "./Terminal";

const Hero = () => {
  const [displayText, setDisplayText] = useState("");
  const roles = [
    "Computer Engineering Student",
    "AI/ML Developer",
    "Backend & IoT Developer",
    "Cybersecurity Learner"
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
    <>
      <section id="home" className="relative min-h-[120vh] flex items-center justify-center px-4 py-32">
        <div className="container mx-auto text-center z-10 w-full">
          <div className="mb-8 inline-block animate-fade-in">
            <div className="font-mono text-primary text-sm mb-2">$ whoami</div>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <span className="text-glow">Yassine Hallous</span>
          </h1>

          <div className="h-20 mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <p className="text-3xl md:text-4xl text-muted-foreground font-mono">
              <span className="text-secondary text-glow-purple">{displayText}</span>
              <span className="animate-pulse text-primary">|</span>
            </p>
          </div>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-14 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            Computer Engineering Student exploring IoT, AI, and backend engineering. Turning real-world challenges into smart, secure, and connected solutions.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-10 animate-fade-in" style={{ animationDelay: '0.4s' }}>
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

          <div className="flex items-center justify-center gap-4 mb-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
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

          <div className="flex justify-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <ChevronDown className="w-8 h-8 text-primary animate-bounce" />
          </div>
        </div>
      </section>

      {/* Terminal Section - Below hero */}
      <section id="terminal-section" className="relative py-12 px-4">
        <div className="container mx-auto">
          <div className="w-full max-w-5xl mx-auto">
            <Terminal />
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
