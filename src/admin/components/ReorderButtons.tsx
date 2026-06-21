import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReorderButtonsProps {
  index: number;
  total: number;
  onMove: (direction: -1 | 1) => void;
}

export default function ReorderButtons({ index, total, onMove }: ReorderButtonsProps) {
  return (
    <div className="flex flex-col gap-0.5 shrink-0">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        disabled={index === 0}
        aria-label="Move up"
        onClick={() => onMove(-1)}
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        disabled={index === total - 1}
        aria-label="Move down"
        onClick={() => onMove(1)}
      >
        <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  );
}
