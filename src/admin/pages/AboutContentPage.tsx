import { useEffect, useMemo, useState } from "react";
import { Loader2, RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";
import AdminLayout from "@/admin/components/AdminLayout";
import {
  ArsenalEditor,
  InterestsEditor,
  StatsEditor,
  clampArray,
} from "@/admin/components/site-editors";
import { fetchCollection, saveCollection } from "@/admin/lib/cms-api";
import type { AboutContentData } from "@/admin/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

export default function AboutContentPage() {
  const [data, setData] = useState<AboutContentData | null>(null);
  const [savedSnapshot, setSavedSnapshot] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isDirty = useMemo(() => (data ? JSON.stringify(data) !== savedSnapshot : false), [data, savedSnapshot]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const result = await fetchCollection<AboutContentData>("about");
        if (cancelled) return;
        setData(result);
        setSavedSnapshot(JSON.stringify(result));
      } catch (err) {
        toast.error("Failed to load about content", {
          description: err instanceof Error ? err.message : "Unknown error",
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const about = data?.about ?? {};

  const setAbout = (patch: Partial<NonNullable<AboutContentData["about"]>>) => {
    setData((prev) => ({
      ...(prev ?? { about: {} }),
      about: { ...(prev?.about ?? {}), ...patch },
    }));
  };

  const setSubtitle = (key: "experience" | "projects" | "certifications", subtitle: string) => {
    setData((prev) => ({
      ...(prev ?? { about: {} }),
      [key]: { subtitle },
    }));
  };

  const publish = async () => {
    if (!data) return;
    setSaving(true);
    try {
      await saveCollection("about", data);
      setSavedSnapshot(JSON.stringify(data));
      toast.success("About section published", { description: "Site will rebuild in ~2 minutes." });
    } catch (err) {
      toast.error("Publish failed", { description: err instanceof Error ? err.message : "Unknown error" });
    } finally {
      setSaving(false);
    }
  };

  const discard = () => {
    if (!savedSnapshot) return;
    setData(JSON.parse(savedSnapshot) as AboutContentData);
    toast.message("Changes discarded");
  };

  return (
    <AdminLayout
      title="About Section"
      description="Edit your about paragraph, fields of interest, technical arsenal, stats, and section subtitles."
      actions={
        <>
          <Button variant="outline" size="sm" disabled={!isDirty || saving} onClick={discard}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Discard
          </Button>
          <Button size="sm" disabled={!isDirty || saving || loading} onClick={() => void publish()}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Publishing..." : "Publish"}
          </Button>
        </>
      }
    >
      {loading || !data ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-6 max-w-4xl">
          <Card className="border-border/60 bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle>About me</CardTitle>
              <CardDescription>Main paragraph under the About Me title.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <label className="text-sm font-medium">Subtitle / paragraph</label>
              <Textarea
                value={about.subtitle ?? ""}
                rows={4}
                onChange={(e) => setAbout({ subtitle: e.target.value })}
              />
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Fields of Interest</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Section title</label>
                <Input
                  value={about.fieldsOfInterestTitle ?? ""}
                  onChange={(e) => setAbout({ fieldsOfInterestTitle: e.target.value })}
                />
              </div>
              <InterestsEditor
                items={clampArray<{ title: string; description: string }>(about.fieldsOfInterest)}
                onChange={(fieldsOfInterest) => setAbout({ fieldsOfInterest })}
              />
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Technical Arsenal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Section title</label>
                <Input
                  value={about.technicalArsenalTitle ?? ""}
                  onChange={(e) => setAbout({ technicalArsenalTitle: e.target.value })}
                />
              </div>
              <ArsenalEditor
                items={clampArray<{ category: string; technologies: string[] }>(about.technicalArsenal)}
                onChange={(technicalArsenal) => setAbout({ technicalArsenal })}
              />
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Stats</CardTitle>
              <CardDescription>GPA, projects count, certifications count, etc.</CardDescription>
            </CardHeader>
            <CardContent>
              <StatsEditor
                items={clampArray<{ value: string; label: string }>(about.stats)}
                onChange={(stats) => setAbout({ stats })}
              />
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Section subtitles</CardTitle>
              <CardDescription>Paragraphs under Experience, Projects, and Certifications titles.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Experience</label>
                <Textarea
                  rows={3}
                  value={data.experience?.subtitle ?? ""}
                  onChange={(e) => setSubtitle("experience", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Projects</label>
                <Textarea
                  rows={3}
                  value={data.projects?.subtitle ?? ""}
                  onChange={(e) => setSubtitle("projects", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Certifications</label>
                <Textarea
                  rows={3}
                  value={data.certifications?.subtitle ?? ""}
                  onChange={(e) => setSubtitle("certifications", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
}
