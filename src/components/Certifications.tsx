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
            <span className="text-primary text-glow">Certifications</span> & Achievements
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6"></div>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Professional certifications and credentials demonstrating expertise across multiple domains.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert) => (
            <Card
              key={cert.id}
              className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 hover:card-glow transition-all duration-300 group"
            >
              <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <Award className="w-20 h-20 text-primary/30 group-hover:text-primary/50 transition-colors" />
              </div>

              <CardHeader>
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors mb-2">
                  {cert.title}
                </h3>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-secondary font-semibold">{cert.issuer}</span>
                  <span className="text-muted-foreground">{cert.date}</span>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">{cert.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {cert.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-muted/50 border border-border/50 rounded text-xs text-foreground/80"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-border/50 hover:border-primary/50"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Credential
                </Button>
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
