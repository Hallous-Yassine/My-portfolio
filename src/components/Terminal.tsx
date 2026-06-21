import { useEffect, useRef, useState } from "react";
import { Shield, Network, AlertTriangle, Lock, CheckCircle } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface TerminalLine {
  text: string;
  icon: "shield" | "network" | "alert" | "lock" | "check";
  delay: number;
}

const TERMINAL_LINES: TerminalLine[] = [
  { text: "> Initializing portfolio...", icon: "shield", delay: 0 },
  { text: "> Loading skills and projects...", icon: "network", delay: 800 },
  { text: "> Analyzing expertise areas...", icon: "alert", delay: 1600 },
  { text: "> Securing connections...", icon: "lock", delay: 2400 },
  { text: "> System ready. Welcome!", icon: "check", delay: 3200 },
];

const Terminal = () => {
  const reducedMotion = useReducedMotion();
  const [visibleLines, setVisibleLines] = useState(reducedMotion ? TERMINAL_LINES.length : 0);
  const terminalRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const startAnimation = () => {
    if (startedRef.current) return;
    startedRef.current = true;

    TERMINAL_LINES.forEach((line, index) => {
      timeoutsRef.current.push(
        setTimeout(() => {
          setVisibleLines(index + 1);
        }, line.delay),
      );
    });
  };

  useEffect(() => {
    if (reducedMotion) {
      setVisibleLines(TERMINAL_LINES.length);
      startedRef.current = true;
      return;
    }

    const node = terminalRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          startAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(node);

    // If already in view on mount (e.g. short viewport), start immediately.
    const rect = node.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (inView) {
      startAnimation();
      observer.disconnect();
    }

    return () => {
      observer.disconnect();
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [reducedMotion]);

  const getIcon = (iconType: string) => {
    const iconClass = "w-4 h-4 shrink-0";
    switch (iconType) {
      case "shield":
        return <Shield className={`${iconClass} text-primary`} />;
      case "network":
        return <Network className={`${iconClass} text-primary`} />;
      case "alert":
        return <AlertTriangle className={`${iconClass} text-yellow-400`} />;
      case "lock":
        return <Lock className={`${iconClass} text-primary`} />;
      case "check":
        return <CheckCircle className={`${iconClass} text-terminal`} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full" ref={terminalRef}>
      <div className="bg-card/80 backdrop-blur-lg border border-border/50 rounded-lg overflow-hidden shadow-2xl card-glow">
        <div className="bg-muted/50 px-4 py-3 flex items-center gap-2 border-b border-border/50">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-sm text-muted-foreground font-terminal ml-2">portfolio_terminal</span>
        </div>

        <div className="p-6 font-terminal text-sm space-y-3 min-h-[200px]">
          {visibleLines === 0 ? (
            <div className="flex items-center gap-3 text-muted-foreground">
              <span className="animate-pulse text-primary">_</span>
              <span>Waiting for input...</span>
            </div>
          ) : (
            TERMINAL_LINES.slice(0, visibleLines).map((line, index) => (
              <div
                key={line.text}
                className="flex items-center gap-3 animate-fade-in text-foreground/90"
              >
                {getIcon(line.icon)}
                <span>{line.text}</span>
                {index === visibleLines - 1 && !reducedMotion && (
                  <span className="animate-pulse text-primary ml-1">_</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Terminal;
