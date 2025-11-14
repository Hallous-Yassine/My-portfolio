import { Github, Linkedin, Mail, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="border-t border-border/50 bg-card/30 backdrop-blur">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold text-glow">Yassine Hallous</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Computer Engineering Student passionate about cybersecurity, AI, and building
              innovative technological solutions.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-primary">Quick Links</h3>
            <div className="space-y-2">
              {["Home", "About", "Projects", "Certifications", "Journey", "Contact"].map((link) => (
                <button
                  key={link}
                  onClick={() => scrollToSection(link.toLowerCase())}
                  className="block text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {link}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-primary">Connect</h3>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="icon"
                className="border-border/50 hover:border-primary/50 hover:text-primary"
                onClick={() => window.open("https://github.com/Hallous-Yassine", "_blank")}
              >
                <Github className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-border/50 hover:border-primary/50 hover:text-primary"
                onClick={() => window.open("https://linkedin.com/in/yassine-hallous", "_blank")}
              >
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-border/50 hover:border-primary/50 hover:text-primary"
                onClick={() => window.location.href = "mailto:yassine_hallous@ieee.org"}
              >
                <Mail className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-muted-foreground text-sm mt-4">
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
          <p className="text-muted-foreground text-sm">
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
