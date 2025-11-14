import { useState, useEffect } from "react";
import { ExternalLink, Github } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    fetch("/data/projects.json")
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
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Featured <span className="text-primary text-glow">Projects</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6"></div>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 hover:card-glow transition-all duration-300 group overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden bg-muted/30">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <div className="text-center p-4">
                    <div className="text-4xl font-mono text-primary/50 mb-2">{"</>"}</div>
                    <div className="font-mono text-xs">{project.category}</div>
                  </div>
                </div>
              </div>

              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {project.date.split(" ")[0]} {project.date.split(" ")[1]}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm">{project.description}</p>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-muted/50 border border-border/50 rounded text-xs text-foreground/80"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="px-2 py-1 bg-muted/50 border border-border/50 rounded text-xs text-foreground/80">
                        +{project.technologies.length - 4} more
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-border/50 hover:border-primary/50"
                      onClick={() => window.open(project.github, "_blank")}
                    >
                      <Github className="w-4 h-4 mr-2" />
                      Code
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-primary hover:bg-primary/90"
                      onClick={() => window.open(project.github, "_blank")}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View
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
