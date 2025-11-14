import { Code2, Database, Shield, Cpu, Brain, Cloud } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const skills = [
    {
      icon: Shield,
      title: "Cybersecurity",
      description: "Penetration testing, security protocols, and threat analysis",
    },
    {
      icon: Brain,
      title: "AI & Machine Learning",
      description: "TensorFlow, Scikit-learn, neural networks, and intelligent systems",
    },
    {
      icon: Database,
      title: "Backend Development",
      description: "Node.js, PostgreSQL, RESTful APIs, and scalable architectures",
    },
    {
      icon: Cpu,
      title: "Embedded Systems & IoT",
      description: "ESP32, ESP-IDF, real-time data processing, and sensor integration",
    },
    {
      icon: Code2,
      title: "Full-Stack Development",
      description: "React, TypeScript, Flutter, and modern web technologies",
    },
    {
      icon: Cloud,
      title: "Cloud & DevOps",
      description: "Containerization, automation, and cloud infrastructure",
    },
  ];

  const technologies = {
    "Programming Languages": ["C/C++", "Python", "Java", "Kotlin", "Dart", "JavaScript", "TypeScript", "PHP"],
    "AI & Machine Learning": ["TensorFlow", "Scikit-learn", "Pandas", "NumPy", "Flask"],
    "Backend & Databases": ["Node.js", "Express.js", "MySQL", "PostgreSQL", "MongoDB", "Firebase"],
    "Mobile & Frontend": ["Flutter", "React", "Android", "HTML/CSS"],
    "Tools & Platforms": ["Git", "Docker", "Linux", "ESP-IDF", "Electron"],
  };

  return (
    <section id="about" className="py-20 px-4 relative">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="text-primary text-glow">Me</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6"></div>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Third-year Computer Engineering student at ISITCOM with a passion for building secure,
            intelligent systems. Experienced in full-stack development, IoT solutions, and AI applications.
            Active IEEE member demonstrating strong leadership and project coordination skills.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {skills.map((skill, index) => (
            <Card
              key={index}
              className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 hover:card-glow transition-all duration-300 group"
            >
              <CardContent className="p-6">
                <skill.icon className="w-12 h-12 text-primary mb-4 group-hover:text-secondary transition-colors" />
                <h3 className="text-xl font-semibold mb-2">{skill.title}</h3>
                <p className="text-muted-foreground text-sm">{skill.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-card/30 backdrop-blur border border-border/50 rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-8 text-center">
            Technical <span className="text-primary text-glow">Arsenal</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(technologies).map(([category, techs]) => (
              <div key={category}>
                <h4 className="text-lg font-semibold text-secondary mb-3">{category}</h4>
                <div className="flex flex-wrap gap-2">
                  {techs.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-muted/50 border border-border/50 rounded-full text-sm text-foreground/80 hover:border-primary/50 hover:text-primary transition-all"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-block bg-card/50 backdrop-blur border border-border/50 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-primary text-glow mb-2">16.63/20</div>
                <div className="text-muted-foreground">Current GPA</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary text-glow mb-2">10+</div>
                <div className="text-muted-foreground">Projects Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary text-glow mb-2">5+</div>
                <div className="text-muted-foreground">Certifications</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
