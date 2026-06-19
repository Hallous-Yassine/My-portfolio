import { cn } from "@/lib/utils";
import { getAssetPath } from "@/lib/paths";

interface AdminImagePreviewProps {
  src: string;
  alt?: string;
  className?: string;
  maxHeight?: number;
  thumbnail?: boolean;
}

export default function AdminImagePreview({
  src,
  alt = "Preview",
  className,
  maxHeight = 320,
  thumbnail = false,
}: AdminImagePreviewProps) {
  const resolved = getAssetPath(src);

  if (thumbnail) {
    return (
      <div
        className={cn(
          "shrink-0 flex items-center justify-center overflow-hidden rounded-md border border-border/60 bg-muted/20",
          className,
        )}
        style={{ width: 48, height: 48 }}
      >
        <img
          src={resolved}
          alt={alt}
          className="max-h-full max-w-full object-contain"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-muted/20 p-3",
        className,
      )}
    >
      <img
        src={resolved}
        alt={alt}
        className="h-auto max-w-full object-contain"
        style={{ maxHeight }}
        loading="lazy"
      />
    </div>
  );
}
