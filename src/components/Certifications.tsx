import { useState, useEffect } from "react";
import { Award, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Certification {
  id: number;
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  description: string;
  skills: string[];
  image: string;
}

const Certifications = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);

  useEffect(() => {
    fetch("/data/certifications.json")
      .then((res) => res.json())
      .then((data) => setCertifications(data.certifications))
      .catch((err) => console.error("Error loading certifications:", err));
  }, []);

  return (
    <section id="certifications" className="py-20 px-4 relative bg-muted/20">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            My <span className="text-secondary text-glow-purple">Certifications</span>
          </h2>
          <div className="w-20 h-1 bg-secondary mx-auto mb-6 rounded-full"></div>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Professional certifications and credentials demonstrating expertise across multiple domains.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certifications.map((cert) => (
            <Card
              key={cert.id}
              className="bg-card/80 backdrop-blur border-border/50 hover:border-secondary/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all duration-300 group"
            >
              {/* Certification Badge Area */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-secondary/20 via-primary/10 to-transparent flex items-center justify-center border-b border-border/30">
                <Award className="w-24 h-24 text-secondary/40 group-hover:text-secondary/60 group-hover:scale-110 transition-all duration-300" />
                <div className="absolute top-4 left-4">
                  <div className="w-3 h-3 rounded-full bg-secondary animate-pulse"></div>
                </div>
              </div>

              <CardHeader className="pb-3">
                <h3 className="text-xl font-bold text-foreground group-hover:text-secondary transition-colors mb-3">
                  {cert.title}
                </h3>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-secondary font-semibold flex items-center gap-2">
                    <Award className="w-3.5 h-3.5" />
                    {cert.issuer}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    {cert.date}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {cert.description}
                </p>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-2">
                  {cert.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-muted/50 border border-border/50 rounded-full text-xs text-foreground/90 hover:border-secondary/50 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* View Credential Button */}
                <div className="pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-border/50 hover:border-secondary/50 hover:bg-secondary/5 group"
                  >
                    <ExternalLink className="w-4 h-4 mr-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    View Credential
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-card/50 backdrop-blur border border-border/50 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">
              Continuous <span className="text-primary text-glow">Learning</span>
            </h3>
            <p className="text-muted-foreground max-w-2xl">
              Committed to staying at the forefront of technology through continuous education
              and professional development. Always exploring new technologies and methodologies
              to enhance my skill set.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certifications;
