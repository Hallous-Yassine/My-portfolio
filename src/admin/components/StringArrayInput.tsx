import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface StringArrayInputProps {
  label: string;
  values: string[];
  placeholder?: string;
  onChange: (values: string[]) => void;
}

export default function StringArrayInput({
  label,
  values,
  placeholder = "Add item",
  onChange,
}: StringArrayInputProps) {
  const add = () => onChange([...values, ""]);
  const remove = (index: number) => onChange(values.filter((_, i) => i !== index));
  const update = (index: number, value: string) => {
    const next = [...values];
    next[index] = value;
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <Button type="button" variant="outline" size="sm" onClick={add}>
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
      {values.length === 0 ? (
        <p className="text-sm text-muted-foreground">No items yet.</p>
      ) : (
        <div className="space-y-2">
          {values.map((value, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={value}
                placeholder={placeholder}
                onChange={(e) => update(index, e.target.value)}
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-1">
          {values.filter(Boolean).map((value, index) => (
            <Badge key={`${value}-${index}`} variant="secondary">
              {value}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
