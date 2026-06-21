import { useEffect, useMemo, useState } from "react";
import { Github, Linkedin, Mail, Download, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAssetPath } from "@/lib/paths";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useJsonData } from "@/hooks/use-json-data";
import Terminal from "./Terminal";

const DEFAULT_ROLES = [
  "Computer Engineering Student",
  "AI/ML Developer",
  "Backend & IoT Developer",
  "Cybersecurity Learner",
];

type SiteData = {
  sections?: {
    hero?: {
      name?: string;
      roles?: string[];
      tagline?: string;
      primaryCtaLabel?: string;
      secondaryCtaLabel?: string;
      cvPath?: string;
    };
  };
};

const DEFAULT_CV_PATH = "/CV_Yassine_Hallous.pdf";

const Hero = () => {
  const reducedMotion = useReducedMotion();
  const { data: siteData } = useJsonData<SiteData>("/data/site.json");
  const hero = siteData?.sections?.hero;
  const cvPath = hero?.cvPath?.trim() || DEFAULT_CV_PATH;

  const roles = useMemo(
    () => (hero?.roles?.length ? hero.roles : DEFAULT_ROLES),
    [hero?.roles],
  );

  const [displayText, setDisplayText] = useState(roles[0]);
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setDisplayText(roles[roleIndex] ?? roles[0]);
    setRoleIndex(0);
    setCharIndex(0);
    setIsDeleting(false);
  }, [roles]);

  useEffect(() => {
    if (reducedMotion) {
      setDisplayText(roles[roleIndex]);
      return;
    }

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
          setRoleIndex((prev) => (prev + 1) % roles.length);
        }
      },
      isDeleting ? 50 : 100,
    );

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, roleIndex, reducedMotion, roles]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    }
  };

  return (
    <>
      <section id="home" className="relative min-h-[120vh] flex items-center justify-center px-4 py-32">
        <div className="container mx-auto text-center z-10 w-full">
          <div className="mb-8 inline-block animate-fade-in">
            <div className="font-mono text-primary text-sm mb-2">$ whoami</div>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-fade-in font-share-tech" style={{ animationDelay: "0.1s" }}>
            <span className="text-glow">{hero?.name ?? "Yassine Hallous"}</span>
          </h1>

          <div className="h-20 mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <p className="text-3xl md:text-4xl text-muted-foreground font-fira-code">
              <span className="text-secondary text-glow-purple">{displayText}</span>
              {!reducedMotion && <span className="animate-pulse text-primary">|</span>}
            </p>
          </div>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-14 animate-fade-in font-fira-code" style={{ animationDelay: "0.3s" }}>
            {hero?.tagline ??
              "Computer Engineering Student exploring IoT, AI, and backend engineering. Turning real-world challenges into smart, secure, and connected solutions."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-10 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground border-glow"
              onClick={() => scrollToSection("contact")}
            >
              {hero?.primaryCtaLabel ?? "Get In Touch"}
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-primary/50 hover:bg-primary/10"
              onClick={() => window.open(getAssetPath(cvPath), "_blank")}
            >
              <Download className="w-4 h-4 mr-2" />
              {hero?.secondaryCtaLabel ?? "Download CV"}
            </Button>
          </div>

          <div className="flex items-center justify-center gap-4 mb-12 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <Button
              variant="ghost"
              size="icon"
              className="hover:text-primary hover:border-glow transition-all"
              aria-label="GitHub profile"
              onClick={() => window.open("https://github.com/Hallous-Yassine", "_blank")}
            >
              <Github className="w-6 h-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="hover:text-primary hover:border-glow transition-all"
              aria-label="LinkedIn profile"
              onClick={() => window.open("https://linkedin.com/in/yassine-hallous", "_blank")}
            >
              <Linkedin className="w-6 h-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="hover:text-primary hover:border-glow transition-all"
              aria-label="Send email"
              onClick={() => {
                window.location.href = "mailto:yassine_hallous@ieee.org";
              }}
            >
              <Mail className="w-6 h-6" />
            </Button>
          </div>

          <div className="flex justify-center animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <ChevronDown className={`w-8 h-8 text-primary ${reducedMotion ? "" : "animate-bounce"}`} aria-hidden="true" />
          </div>
        </div>
      </section>

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
