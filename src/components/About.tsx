import { Code2, Database, Shield, Cpu, Brain, Cloud } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const interests = [
    {
      icon: Code2,
      title: "App Development",
      description: "I enjoy turning ideas into functional mobile or web applications and creating interfaces that feel simple and intuitive for users.",
    },
    {
      icon: Brain,
      title: "AI & Machine Learning",
      description: "I'm motivated by building models that learn from data and help automate decisions, especially when they solve real problems.",
    },
    {
      icon: Cpu,
      title: "Embedded Systems & IoT",
      description: "I love connecting hardware and software together, working with sensors, and building systems that react in real time.",
    },
    {
      icon: Shield,
      title: "Cybersecurity",
      description: "Participating in CTFs and hackathons sparked my interest in understanding how systems can be strengthened against attacks.",
    },
    {
      icon: Cloud,
      title: "Cloud & DevOps",
      description: "I find it exciting to deploy applications efficiently and automate workflows to make systems faster, scalable, and reliable.",
    },
  ];

  const technologies = {
    "Programming Languages": [
      "C", "C++", "Python", "Java", "Kotlin", "Dart",
      "JavaScript", "TypeScript", "PHP", "HTML", "CSS"
    ],

    "AI & Machine Learning": [
      "TensorFlow", "Scikit-learn", "Pandas", "NumPy", "Flask"
    ],

    "Mobile & Backend Development": [
      "Flutter", "Node.js", "Express.js",
      "MySQL", "PostgreSQL", "MongoDB", "Firebase",
      "Postman", "Figma"
    ],

    "DevOps & Cloud": [
      "Docker", "CI/CD", "Nginx", "AWS",
      "Git", "GitHub", "Linux"
    ],

    "Embedded Systems & IoT": [
      "ESP32", "Arduino", "Raspberry Pi", "MQTT"
    ],

    "Cybersecurity": [
      "Cisco Packet Tracer", "Wireshark", "VirtualBox",
      "VLAN configuration", "Web pentesting basics",
      "Nmap", "Burp Suite"
    ]
  };


  return (
    <section id="about" className="py-20 px-4 relative">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-share-tech">
            About <span className="text-primary text-glow">Me</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-6"></div>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto font-fira-code">
            A third-year Computer Engineering student specializing in Embedded Systems and IoT. Proven experience in app development, backend system design, and building automated, data-driven solutions. Actively involved in IEEE, where I developed strong leadership, teamwork, and project coordination skills.
          </p>
        </div>

        {/* Fields of Interest Section */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold mb-12 text-center">
            Fields of <span className="text-primary text-glow">Interest</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interests.map((interest, index) => (
              <Card
                key={index}
                className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 hover:card-glow transition-all duration-300 group"
              >
                <CardContent className="p-6">
                  <interest.icon className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="text-xl font-semibold mb-3 font-share-tech">{interest.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed font-fira-code">{interest.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Technical Arsenal Section */}
        <div className="bg-card/30 backdrop-blur border border-border/50 rounded-lg p-8 mb-16">
          <h3 className="text-2xl font-bold mb-8 text-center">
            Technical <span className="text-primary text-glow">Arsenal</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(technologies).map(([category, techs]) => (
              <div key={category}>
                <h4 className="text-lg font-semibold text-primary mb-4">{category}</h4>
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

        {/* Stats Section */}
        <div className="text-center">
          <div className="inline-block bg-card/50 backdrop-blur border border-border/50 rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div>
                <div className="text-4xl font-bold text-primary text-glow mb-2">16.63/20</div>
                <div className="text-muted-foreground">Current GPA</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary text-glow mb-2">7+</div>
                <div className="text-muted-foreground">Projects Completed</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary text-glow mb-2">5+</div>
                <div className="text-muted-foreground">Certifications Earned</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
