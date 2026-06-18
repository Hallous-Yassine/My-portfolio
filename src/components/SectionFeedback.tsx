import { AlertCircle, Inbox } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface SectionFeedbackProps {
  loading: boolean;
  error: string | null;
  isEmpty: boolean;
  emptyMessage?: string;
  skeletonCount?: number;
  children: React.ReactNode;
}

const SectionFeedback = ({
  loading,
  error,
  isEmpty,
  emptyMessage = "No items to display.",
  skeletonCount = 3,
  children,
}: SectionFeedbackProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <Skeleton key={i} className="h-80 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <p className="text-lg font-semibold mb-2">Failed to load content</p>
        <p className="text-muted-foreground font-fira-code text-sm">{error}</p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Inbox className="w-12 h-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground font-fira-code">{emptyMessage}</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default SectionFeedback;
