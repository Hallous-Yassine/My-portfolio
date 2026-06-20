import { useEffect, useMemo, useState } from "react";
import { RotateCcw, Save, Settings } from "lucide-react";
import { toast } from "sonner";
import AdminLayout from "@/admin/components/AdminLayout";
import StringArrayInput from "@/admin/components/StringArrayInput";
import { fetchCollection, saveCollection } from "@/admin/lib/cms-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

type SiteJson = {
  sections?: {
    hero?: {
      name?: string;
      roles?: string[];
      tagline?: string;
      primaryCtaLabel?: string;
      secondaryCtaLabel?: string;
    };
    about?: {
      subtitle?: string;
      fieldsOfInterestTitle?: string;
      fieldsOfInterest?: { title: string; description: string }[];
      technicalArsenalTitle?: string;
      technicalArsenal?: { category: string; technologies: string[] }[];
      stats?: { value: string; label: string }[];
    };
    projects?: { subtitle?: string };
    experience?: { subtitle?: string };
    certifications?: { subtitle?: string };
  };
};

function clampArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export default function SiteContentPage() {
  const [data, setData] = useState<SiteJson | null>(null);
  const [savedSnapshot, setSavedSnapshot] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isDirty = useMemo(() => (data ? JSON.stringify(data) !== savedSnapshot : false), [data, savedSnapshot]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const result = (await fetchCollection<SiteJson>("site")) ?? {};
        if (cancelled) return;
        setData(result);
        setSavedSnapshot(JSON.stringify(result));
      } catch (err) {
        toast.error("Failed to load site content", {
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

  const hero = data?.sections?.hero ?? {};
  const about = data?.sections?.about ?? {};

  const setHero = (patch: Partial<NonNullable<SiteJson["sections"]>["hero"]>) => {
    setData((prev) => ({
      ...(prev ?? {}),
      sections: {
        ...(prev?.sections ?? {}),
        hero: { ...(prev?.sections?.hero ?? {}), ...patch },
      },
    }));
  };

  const setAbout = (patch: Partial<NonNullable<SiteJson["sections"]>["about"]>) => {
    setData((prev) => ({
      ...(prev ?? {}),
      sections: {
        ...(prev?.sections ?? {}),
        about: { ...(prev?.sections?.about ?? {}), ...patch },
      },
    }));
  };

  const setSectionSubtitle = (key: "projects" | "experience" | "certifications", subtitle: string) => {
    setData((prev) => ({
      ...(prev ?? {}),
      sections: {
        ...(prev?.sections ?? {}),
        [key]: { ...((prev?.sections as any)?.[key] ?? {}), subtitle },
      },
    }));
  };

  const publish = async () => {
    if (!data) return;
    setSaving(true);
    try {
      await saveCollection("site", data);
      setSavedSnapshot(JSON.stringify(data));
      toast.success("Site content published to GitHub", { description: "Site will rebuild in ~2 minutes." });
    } catch (err) {
      toast.error("Publish failed", { description: err instanceof Error ? err.message : "Unknown error" });
    } finally {
      setSaving(false);
    }
  };

  const discard = () => {
    if (!savedSnapshot) return;
    setData(JSON.parse(savedSnapshot) as SiteJson);
    toast.message("Changes discarded");
  };

  return (
    <AdminLayout
      title="Site Content"
      description="Edit the text and sections shown across your portfolio (hero, about, interests, skills, and stats)."
      actions={
        <>
          <Button variant="outline" size="sm" disabled={!isDirty || saving} onClick={discard}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Discard
          </Button>
          <Button size="sm" disabled={!isDirty || saving} onClick={() => void publish()}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Publishing..." : "Publish"}
          </Button>
        </>
      }
    >
      {loading || !data ? (
        <Card className="border-border/60 bg-card/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Loading…
            </CardTitle>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="border-border/60 bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Hero</CardTitle>
              <CardDescription>Text shown at the top of the website.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input value={hero.name ?? ""} onChange={(e) => setHero({ name: e.target.value })} />
              </div>

              <StringArrayInput
                label="Roles (rotating)"
                values={clampArray<string>(hero.roles)}
                placeholder="Add role"
                onChange={(roles) => setHero({ roles })}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">Tagline</label>
                <Textarea
                  value={hero.tagline ?? ""}
                  rows={3}
                  onChange={(e) => setHero({ tagline: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Primary CTA label</label>
                  <Input
                    value={hero.primaryCtaLabel ?? ""}
                    onChange={(e) => setHero({ primaryCtaLabel: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Secondary CTA label</label>
                  <Input
                    value={hero.secondaryCtaLabel ?? ""}
                    onChange={(e) => setHero({ secondaryCtaLabel: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle>About</CardTitle>
              <CardDescription>About paragraph, interests, technical skills, and stats.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">About subtitle (paragraph)</label>
                <Textarea
                  value={about.subtitle ?? ""}
                  rows={4}
                  onChange={(e) => setAbout({ subtitle: e.target.value })}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <label className="text-sm font-medium">Fields of Interest title</label>
                <Input
                  value={about.fieldsOfInterestTitle ?? ""}
                  onChange={(e) => setAbout({ fieldsOfInterestTitle: e.target.value })}
                />
              </div>

              <InterestsEditor
                items={clampArray<{ title: string; description: string }>(about.fieldsOfInterest)}
                onChange={(fieldsOfInterest) => setAbout({ fieldsOfInterest })}
              />

              <Separator />

              <div className="space-y-2">
                <label className="text-sm font-medium">Technical Arsenal title</label>
                <Input
                  value={about.technicalArsenalTitle ?? ""}
                  onChange={(e) => setAbout({ technicalArsenalTitle: e.target.value })}
                />
              </div>

              <ArsenalEditor
                items={clampArray<{ category: string; technologies: string[] }>(about.technicalArsenal)}
                onChange={(technicalArsenal) => setAbout({ technicalArsenal })}
              />

              <Separator />

              <StatsEditor
                items={clampArray<{ value: string; label: string }>(about.stats)}
                onChange={(stats) => setAbout({ stats })}
              />
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Section subtitles</CardTitle>
              <CardDescription>Paragraphs under section titles.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Experience subtitle</label>
                <Textarea
                  rows={3}
                  value={data.sections?.experience?.subtitle ?? ""}
                  onChange={(e) => setSectionSubtitle("experience", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Projects subtitle</label>
                <Textarea
                  rows={3}
                  value={data.sections?.projects?.subtitle ?? ""}
                  onChange={(e) => setSectionSubtitle("projects", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Certifications subtitle</label>
                <Textarea
                  rows={3}
                  value={data.sections?.certifications?.subtitle ?? ""}
                  onChange={(e) => setSectionSubtitle("certifications", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
}

function InterestsEditor({
  items,
  onChange,
}: {
  items: { title: string; description: string }[];
  onChange: (items: { title: string; description: string }[]) => void;
}) {
  const add = () => onChange([...items, { title: "", description: "" }]);
  const remove = (index: number) => onChange(items.filter((_, i) => i !== index));
  const update = (index: number, patch: Partial<{ title: string; description: string }>) => {
    const next = [...items];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Fields of Interest</p>
        <Button type="button" variant="outline" size="sm" onClick={add}>
          Add
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No items yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <Card key={index} className="border-border/50 bg-muted/10">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">Item {index + 1}</p>
                  <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                    Remove
                  </Button>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input value={item.title} onChange={(e) => update(index, { title: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      rows={3}
                      value={item.description}
                      onChange={(e) => update(index, { description: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ArsenalEditor({
  items,
  onChange,
}: {
  items: { category: string; technologies: string[] }[];
  onChange: (items: { category: string; technologies: string[] }[]) => void;
}) {
  const add = () => onChange([...items, { category: "", technologies: [] }]);
  const remove = (index: number) => onChange(items.filter((_, i) => i !== index));
  const update = (index: number, patch: Partial<{ category: string; technologies: string[] }>) => {
    const next = [...items];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Technical Arsenal</p>
        <Button type="button" variant="outline" size="sm" onClick={add}>
          Add category
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No categories yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <Card key={index} className="border-border/50 bg-muted/10">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">Category {index + 1}</p>
                  <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                    Remove
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Category name</label>
                  <Input value={item.category} onChange={(e) => update(index, { category: e.target.value })} />
                </div>

                <StringArrayInput
                  label="Technologies"
                  values={clampArray<string>(item.technologies)}
                  placeholder="Add technology"
                  onChange={(technologies) => update(index, { technologies })}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function StatsEditor({
  items,
  onChange,
}: {
  items: { value: string; label: string }[];
  onChange: (items: { value: string; label: string }[]) => void;
}) {
  const add = () => onChange([...items, { value: "", label: "" }]);
  const remove = (index: number) => onChange(items.filter((_, i) => i !== index));
  const update = (index: number, patch: Partial<{ value: string; label: string }>) => {
    const next = [...items];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Stats</p>
        <Button type="button" variant="outline" size="sm" onClick={add}>
          Add stat
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No stats yet.</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-3">
          {items.map((item, index) => (
            <Card key={index} className="border-border/50 bg-muted/10">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Stat {index + 1}</p>
                  <Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={() => remove(index)}>
                    Remove
                  </Button>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Value</label>
                  <Input value={item.value} onChange={(e) => update(index, { value: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Label</label>
                  <Input value={item.label} onChange={(e) => update(index, { label: e.target.value })} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

