import { useRef, useState } from "react";
import { ChevronDown, ChevronUp, ImagePlus, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { uploadMedia } from "@/admin/lib/cms-api";
import AdminImagePreview from "@/admin/components/AdminImagePreview";
import { moveArrayItem } from "@/admin/lib/reorder-array";
import { toast } from "sonner";

interface ImagePickerProps {
  label: string;
  value: string;
  hint?: string;
  onChange: (path: string) => void;
}

export default function ImagePicker({ label, value, hint, onChange }: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const result = await uploadMedia(file);
      onChange(result.path);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error("Upload failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium">{label}</label>
        {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
      </div>

      {value && <AdminImagePreview src={value} alt={label} maxHeight={280} />}

      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          value={value}
          placeholder="/assets/..."
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleUpload(file);
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Upload className="h-4 w-4 mr-2" />
          )}
          Upload
        </Button>
      </div>
    </div>
  );
}

interface ImageListPickerProps {
  label: string;
  values: string[];
  hint?: string;
  onChange: (values: string[]) => void;
}

export function ImageListPicker({ label, values, hint, onChange }: ImageListPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const result = await uploadMedia(file);
      onChange([...values, result.path]);
      toast.success("Image added to album");
    } catch (err) {
      toast.error("Upload failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setUploading(false);
    }
  };

  const remove = (index: number) => onChange(values.filter((_, i) => i !== index));
  const move = (index: number, direction: -1 | 1) => {
    onChange(moveArrayItem(values, index, direction));
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium">{label}</label>
        {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {values.map((path, index) => (
          <div
            key={`${path}-${index}`}
            className="relative group rounded-lg overflow-hidden border border-border/60 bg-muted/20 p-2 flex flex-col gap-2"
          >
            <Badge
              variant="outline"
              className="absolute top-2 left-2 z-10 h-5 px-1.5 text-[10px] font-mono bg-background/80"
            >
              #{index + 1}
            </Badge>
            <AdminImagePreview src={path} alt="" maxHeight={120} />
            <div className="flex items-center justify-center gap-1">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                disabled={index === 0}
                aria-label="Move earlier"
                onClick={() => move(index, -1)}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                disabled={index === values.length - 1}
                aria-label="Move later"
                onClick={() => move(index, 1)}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-destructive hover:text-destructive"
                aria-label="Remove image"
                onClick={() => remove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="min-h-[9rem] rounded-lg border border-dashed border-border/70 bg-muted/20 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
        >
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <ImagePlus className="h-5 w-5" />
              <span className="text-xs">Add image</span>
            </>
          )}
        </button>
      </div>

      {values.length > 1 && (
        <p className="text-xs text-muted-foreground">
          Order matches the carousel on the site. Use ↑ ↓ on each photo to reorder.
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void upload(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
