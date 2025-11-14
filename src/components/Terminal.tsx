import { useEffect, useState } from "react";
import { Shield, Network, AlertTriangle, Lock, CheckCircle } from "lucide-react";

interface TerminalLine {
  text: string;
  icon: "shield" | "network" | "alert" | "lock" | "check";
  delay: number;
}

const Terminal = () => {
  const [visibleLines, setVisibleLines] = useState<number>(0);

  const lines: TerminalLine[] = [
    { text: "> Initializing portfolio...", icon: "shield", delay: 0 },
    { text: "> Loading skills and projects...", icon: "network", delay: 800 },
    { text: "> Analyzing expertise areas...", icon: "alert", delay: 1600 },
    { text: "> Securing connections...", icon: "lock", delay: 2400 },
    { text: "> System ready. Welcome!", icon: "check", delay: 3200 },
  ];

  useEffect(() => {
    lines.forEach((_, index) => {
      setTimeout(() => {
        setVisibleLines(index + 1);
      }, lines[index].delay);
    });
  }, []);

  const getIcon = (iconType: string) => {
    const iconClass = "w-4 h-4";
    switch (iconType) {
      case "shield":
        return <Shield className={`${iconClass} text-primary`} />;
      case "network":
        return <Network className={`${iconClass} text-secondary`} />;
      case "alert":
        return <AlertTriangle className={`${iconClass} text-cyber-terminal`} />;
      case "lock":
        return <Lock className={`${iconClass} text-primary`} />;
      case "check":
        return <CheckCircle className={`${iconClass} text-cyber-terminal`} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-card/80 backdrop-blur-lg border border-border/50 rounded-lg overflow-hidden shadow-2xl card-glow">
        {/* Terminal Header */}
        <div className="bg-muted/50 px-4 py-3 flex items-center gap-2 border-b border-border/50">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-sm text-muted-foreground font-mono ml-2">
            portfolio_terminal
          </span>
        </div>

        {/* Terminal Content */}
        <div className="p-6 font-mono text-sm space-y-3 min-h-[200px]">
          {lines.slice(0, visibleLines).map((line, index) => (
            <div
              key={index}
              className="flex items-center gap-3 animate-fade-in text-foreground/90"
            >
              {getIcon(line.icon)}
              <span>{line.text}</span>
              {index === visibleLines - 1 && (
                <span className="animate-pulse text-primary ml-1">_</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Terminal;
