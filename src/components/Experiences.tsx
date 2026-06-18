import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Briefcase } from "lucide-react";
import { getAssetPath } from "@/lib/paths";
import { useJsonData } from "@/hooks/use-json-data";
import SectionFeedback from "@/components/SectionFeedback";
import { Skeleton } from "@/components/ui/skeleton";

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

interface ExperiencesData {
  experience: Experience[];
}

const Experiences = () => {
  const { data, loading, error } = useJsonData<ExperiencesData>("/data/experiences.json");
  const experiences = data?.experience ?? [];

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

        {loading && (
          <div className="space-y-8">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-lg" />
            ))}
          </div>
        )}

        {error && (
          <SectionFeedback loading={false} error={error} isEmpty={false}>
            {null}
          </SectionFeedback>
        )}

        {!loading && !error && experiences.length === 0 && (
          <SectionFeedback loading={false} error={null} isEmpty emptyMessage="No experience entries yet.">
            {null}
          </SectionFeedback>
        )}

        {!loading && !error && experiences.length > 0 && (
          <div className="relative space-y-8 before:absolute before:left-4 md:before:left-8 before:top-0 before:bottom-0 before:w-px before:bg-gradient-to-b before:from-primary/50 before:via-secondary/30 before:to-transparent">
            {experiences.map((exp, index) => (
              <Card
                key={exp.id}
                className="relative ml-8 md:ml-16 bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 overflow-hidden group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute -left-[1.65rem] md:-left-[2.65rem] top-8 w-4 h-4 rounded-full bg-primary border-4 border-background shadow-[0_0_10px_hsl(188_100%_50%/0.5)]" />

                <CardContent className="p-0">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
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
                          {exp.highlights.map((highlight) => (
                            <li
                              key={highlight}
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
                          {exp.technologies.map((tech) => (
                            <Badge
                              key={tech}
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
        )}
      </div>
    </section>
  );
};

export default Experiences;
