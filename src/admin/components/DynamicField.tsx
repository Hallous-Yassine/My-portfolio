import type { FieldConfig } from "@/admin/lib/content-config";
import StringArrayInput from "@/admin/components/StringArrayInput";
import ImagePicker, { ImageListPicker } from "@/admin/components/ImagePicker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ItemRecord = Record<string, unknown>;

interface DynamicFieldProps {
  field: FieldConfig;
  value: unknown;
  onChange: (value: unknown) => void;
}

export default function DynamicField({ field, value, onChange }: DynamicFieldProps) {
  switch (field.type) {
    case "textarea":
      return (
        <div className="space-y-2">
          <label className="text-sm font-medium">{field.label}</label>
          <Textarea
            value={String(value ?? "")}
            placeholder={field.placeholder}
            rows={4}
            onChange={(e) => onChange(e.target.value)}
          />
          {field.hint && <p className="text-xs text-muted-foreground">{field.hint}</p>}
        </div>
      );

    case "number":
      return (
        <div className="space-y-2">
          <label className="text-sm font-medium">{field.label}</label>
          <Input
            type="number"
            value={String(value ?? 0)}
            onChange={(e) => onChange(Number(e.target.value) || 0)}
          />
        </div>
      );

    case "select": {
      const currentValue = String(value ?? "");
      const options = field.options ?? [];
      const selectOptions =
        currentValue && !options.includes(currentValue) ? [currentValue, ...options] : options;

      return (
        <div className="space-y-2">
          <label className="text-sm font-medium">{field.label}</label>
          <Select value={currentValue || undefined} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}…`} />
            </SelectTrigger>
            <SelectContent>
              {selectOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {currentValue && !options.includes(currentValue) && (
            <p className="text-xs text-amber-400">
              Current value is not in the preset list. Pick an option or keep &quot;{currentValue}&quot;.
            </p>
          )}
        </div>
      );
    }

    case "string-list":
      return (
        <StringArrayInput
          label={field.label}
          values={Array.isArray(value) ? (value as string[]) : []}
          placeholder={field.placeholder}
          onChange={onChange}
        />
      );

    case "image":
      return (
        <ImagePicker
          label={field.label}
          value={String(value ?? "")}
          hint={field.hint}
          onChange={onChange}
        />
      );

    case "image-list":
      return (
        <ImageListPicker
          label={field.label}
          values={Array.isArray(value) ? (value as string[]) : []}
          hint={field.hint}
          onChange={onChange}
        />
      );

    default:
      return (
        <div className="space-y-2">
          <label className="text-sm font-medium">{field.label}</label>
          <Input
            value={value == null ? "" : String(value)}
            placeholder={field.placeholder}
            onChange={(e) => {
              const next = e.target.value;
              onChange(field.name === "credentialUrl" && !next.trim() ? null : next);
            }}
          />
          {field.hint && <p className="text-xs text-muted-foreground">{field.hint}</p>}
        </div>
      );
  }
}

interface ItemEditorProps {
  fields: FieldConfig[];
  item: ItemRecord;
  onChange: (item: ItemRecord) => void;
}

export function ItemEditor({ fields, item, onChange }: ItemEditorProps) {
  return (
    <div className="space-y-5">
      {fields.map((field) => (
        <DynamicField
          key={field.name}
          field={field}
          value={item[field.name]}
          onChange={(value) => onChange({ ...item, [field.name]: value })}
        />
      ))}
    </div>
  );
}
