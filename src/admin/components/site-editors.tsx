import StringArrayInput from "@/admin/components/StringArrayInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function clampArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export function InterestsEditor({
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

export function ArsenalEditor({
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

export function StatsEditor({
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
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => remove(index)}
                  >
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
