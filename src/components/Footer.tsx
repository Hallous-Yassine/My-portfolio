import { Github, Linkedin, Mail, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const FOOTER_LINKS = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Experience", id: "experience" },
  { label: "Projects", id: "projects" },
  { label: "Certifications", id: "certifications" },
  { label: "Journey", id: "journey" },
  { label: "Contact", id: "contact" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const reducedMotion = useReducedMotion();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    }
  };

  return (
    <footer className="border-t border-border/50 bg-card/30 backdrop-blur">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold text-glow font-share-tech">Yassine Hallous</span>
            </div>
            <p className="text-muted-foreground text-sm font-fira-code">
              Computer Engineering Student passionate about cybersecurity, AI, and building
              innovative technological solutions.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-primary font-share-tech">Quick Links</h3>
            <div className="space-y-2">
              {FOOTER_LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="block text-muted-foreground hover:text-primary transition-colors text-sm font-fira-code"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-primary font-share-tech">Connect</h3>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="icon"
                className="border-border/50 hover:border-primary/50 hover:text-primary"
                aria-label="GitHub profile"
                onClick={() => window.open("https://github.com/Hallous-Yassine", "_blank", "noopener,noreferrer")}
              >
                <Github className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-border/50 hover:border-primary/50 hover:text-primary"
                aria-label="LinkedIn profile"
                onClick={() => window.open("https://linkedin.com/in/yassine-hallous", "_blank", "noopener,noreferrer")}
              >
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-border/50 hover:border-primary/50 hover:text-primary"
                aria-label="Send email"
                onClick={() => { window.location.href = "mailto:yassine_hallous@ieee.org"; }}
              >
                <Mail className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-muted-foreground text-sm mt-4 font-fira-code">
              <a
                href="mailto:yassine_hallous@ieee.org"
                className="hover:text-primary transition-colors"
              >
                yassine_hallous@ieee.org
              </a>
            </p>
          </div>
        </div>

        <div className="border-t border-border/50 pt-8 text-center">
          <p className="text-muted-foreground text-sm font-fira-code">
            © {currentYear} Yassine Hallous. Built with{" "}
            <span className="text-primary">React</span> and{" "}
            <span className="text-secondary">passion</span>.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
