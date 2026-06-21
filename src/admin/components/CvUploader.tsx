import { useRef, useState } from "react";
import { ExternalLink, FileText, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { uploadCv } from "@/admin/lib/cms-api";
import { getAssetPath } from "@/lib/paths";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DEFAULT_CV_PATH = "/CV_Yassine_Hallous.pdf";

interface CvUploaderProps {
  value?: string;
  onChange: (path: string) => void;
}

export default function CvUploader({ value, onChange }: CvUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const cvPath = value?.trim() || DEFAULT_CV_PATH;
  const fileName = cvPath.split("/").pop() ?? "CV.pdf";

  const handleUpload = async (file: File) => {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Please upload a PDF file.");
      return;
    }

    setUploading(true);
    try {
      const result = await uploadCv(file);
      onChange(result.path);
      toast.success("CV uploaded", { description: "Publish to apply on the live site." });
    } catch (err) {
      toast.error("CV upload failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3 rounded-lg border border-border/60 bg-muted/10 p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-primary/10 p-2 text-primary shrink-0">
          <FileText className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">CV / Resume (PDF)</p>
          <p className="text-xs text-muted-foreground mt-1">
            Used by the Download CV buttons in Hero and Contact sections.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          value={cvPath}
          placeholder={DEFAULT_CV_PATH}
          onChange={(e) => onChange(e.target.value)}
        />
        <Button variant="outline" asChild className="shrink-0">
          <a href={getAssetPath(cvPath)} target="_blank" rel="noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Preview
          </a>
        </Button>
      </div>

      <p className="text-xs text-muted-foreground truncate">Current file: {fileName}</p>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
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
        {uploading ? "Uploading..." : "Upload new CV"}
      </Button>
    </div>
  );
}

export { DEFAULT_CV_PATH };
