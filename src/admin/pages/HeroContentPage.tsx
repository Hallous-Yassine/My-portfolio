import { useEffect, useMemo, useState } from "react";
import { Loader2, RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";
import AdminLayout from "@/admin/components/AdminLayout";
import StringArrayInput from "@/admin/components/StringArrayInput";
import { clampArray } from "@/admin/components/site-editors";
import { fetchCollection, saveCollection } from "@/admin/lib/cms-api";
import type { HeroContent } from "@/admin/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function HeroContentPage() {
  const [data, setData] = useState<HeroContent | null>(null);
  const [savedSnapshot, setSavedSnapshot] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isDirty = useMemo(() => (data ? JSON.stringify(data) !== savedSnapshot : false), [data, savedSnapshot]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const result = await fetchCollection<HeroContent>("hero");
        if (cancelled) return;
        setData(result);
        setSavedSnapshot(JSON.stringify(result));
      } catch (err) {
        toast.error("Failed to load hero content", {
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

  const update = (patch: Partial<HeroContent>) => {
    setData((prev) => ({ ...(prev ?? {}), ...patch }));
  };

  const publish = async () => {
    if (!data) return;
    setSaving(true);
    try {
      await saveCollection("hero", data);
      setSavedSnapshot(JSON.stringify(data));
      toast.success("Hero section published", { description: "Site will rebuild in ~2 minutes." });
    } catch (err) {
      toast.error("Publish failed", { description: err instanceof Error ? err.message : "Unknown error" });
    } finally {
      setSaving(false);
    }
  };

  const discard = () => {
    if (!savedSnapshot) return;
    setData(JSON.parse(savedSnapshot) as HeroContent);
    toast.message("Changes discarded");
  };

  return (
    <AdminLayout
      title="Hero Section"
      description="Edit the name, rotating roles, tagline, and call-to-action labels shown at the top of your portfolio."
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
        <Card className="border-border/60 bg-card/80 backdrop-blur max-w-3xl">
          <CardHeader>
            <CardTitle>Hero content</CardTitle>
            <CardDescription>Matches the hero block in site.json.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input value={data.name ?? ""} onChange={(e) => update({ name: e.target.value })} />
            </div>

            <StringArrayInput
              label="Roles (rotating text)"
              values={clampArray<string>(data.roles)}
              placeholder="Add role"
              onChange={(roles) => update({ roles })}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">Tagline</label>
              <Textarea
                value={data.tagline ?? ""}
                rows={3}
                onChange={(e) => update({ tagline: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Primary CTA label</label>
                <Input
                  value={data.primaryCtaLabel ?? ""}
                  onChange={(e) => update({ primaryCtaLabel: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Secondary CTA label</label>
                <Input
                  value={data.secondaryCtaLabel ?? ""}
                  onChange={(e) => update({ secondaryCtaLabel: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </AdminLayout>
  );
}
