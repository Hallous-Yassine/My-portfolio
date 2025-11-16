import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Briefcase } from "lucide-react";
import { getAssetPath } from "@/lib/paths";

interface Experience {
  id: number;
  company: string;
  location: string;
  title: string;
  date: string;
  description: string;
  highlights: string[];
  technologies: string[];
  image: string;
}

const Experiences = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);

  useEffect(() => {
    fetch(getAssetPath("/data/experiences.json"))
      .then((res) => res.json())
      .then((data) => setExperiences(data.experience))
      .catch((error) => console.error("Error loading experiences:", error));
  }, []);

  return (
    <section id="experience" className="py-20 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-share-tech">
            Professional <span className="text-primary text-glow">Experience</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6"></div>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto font-fira-code">
            Real-world experience building innovative solutions
          </p>
        </div>

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <Card
              key={exp.id}
              className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 overflow-hidden group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                  {/* Image Section */}
                  <div className="relative overflow-hidden lg:col-span-1 h-64 lg:h-auto">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
                    <img
                      src={getAssetPath(exp.image)}
                      alt={`${exp.company} experience`}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = getAssetPath("/placeholder.svg");
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary/90 text-primary-foreground font-fira-code">
                        <Briefcase className="w-3 h-3 mr-1" />
                        Experience
                      </Badge>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="lg:col-span-2 p-8">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-foreground mb-2 font-share-tech">
                          {exp.title}
                        </h3>
                        <p className="text-xl text-primary font-semibold font-fira-code">
                          {exp.company}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground font-fira-code">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        {exp.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        {exp.date}
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4 font-fira-code leading-relaxed">
                      {exp.description}
                    </p>

                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-foreground mb-2 font-share-tech">
                        Key Highlights:
                      </h4>
                      <ul className="space-y-2">
                        {exp.highlights.map((highlight, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-muted-foreground flex items-start gap-2 font-fira-code"
                          >
                            <span className="text-primary mt-1">▹</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-2 font-share-tech">
                        Technologies:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="border-primary/30 text-primary hover:bg-primary/10 font-fira-code"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experiences;
