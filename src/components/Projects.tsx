import { useState, useEffect } from "react";
import { Github } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAssetPath } from "@/lib/paths";

interface Project {
  id: number;
  title: string;
  description: string;
  date: string;
  category: string;
  technologies: string[];
  highlights: string[];
  github: string;
  image: string;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetch(getAssetPath("/data/projects.json"))
      .then((res) => res.json())
      .then((data) => setProjects(data.projects))
      .catch((err) => console.error("Error loading projects:", err));
  }, []);

  const categories = ["All", ...new Set(projects.map((p) => p.category))];
  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <section id="projects" className="py-20 px-4 relative">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-share-tech">
            My <span className="text-primary text-glow">Projects</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto font-fira-code">
            A showcase of my technical projects spanning AI, cybersecurity, backend development, and IoT solutions.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "border-border/50 hover:border-primary/50"
              }
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="bg-card/80 backdrop-blur border-border/50 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all duration-300 group overflow-hidden flex flex-col h-full"
            >
              {/* Project Image */}
              <div className="relative w-full aspect-video bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent overflow-hidden">
                <img
                  src={getAssetPath(project.image)}
                  alt={project.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 bg-muted/50"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary/90 text-primary-foreground border-0 px-3 py-1">
                    {project.category}
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-3">
                <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {project.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Technologies */}
                <div className="flex flex-wrap gap-2">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-muted/50 border border-border/50 rounded-full text-xs text-foreground/90 hover:border-primary/50 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="px-3 py-1 bg-muted/50 border border-border/50 rounded-full text-xs text-foreground/90">
                      +{project.technologies.length - 4}
                    </span>
                  )}
                </div>

                {/* Metadata & Actions */}
                <div className="pt-2 border-t border-border/30">
                  <div className="flex items-center justify-between mb-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      {project.date}
                    </span>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full border-border/50 hover:border-primary/50 hover:bg-primary/5"
                      onClick={() => window.open(project.github, "_blank")}
                    >
                      <Github className="w-4 h-4 mr-2" />
                      View Code
                    </Button>
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

export default Projects;
