import type { CollectionConfig } from "./content-config";

type ItemRecord = Record<string, unknown>;

function readFieldValue(item: ItemRecord, fieldName: string): string {
  const value = item[fieldName];
  if (value == null || value === "") return "";
  return String(value);
}

function getFieldLabel(config: CollectionConfig, fieldName: string): string {
  return config.fields.find((field) => field.name === fieldName)?.label ?? fieldName;
}

export interface ItemListDisplay {
  id: number;
  title: string;
  details: { label: string; value: string }[];
  thumbnail?: string;
}

export function getItemListDisplay(
  item: ItemRecord,
  config: CollectionConfig,
  index: number,
): ItemListDisplay {
  const id = typeof item.id === "number" ? item.id : index + 1;
  const [primaryField, ...detailFields] = config.summaryFields;

  const title =
    readFieldValue(item, primaryField) || `${config.itemLabel} ${id}`;

  const details = detailFields
    .map((fieldName) => {
      const value = readFieldValue(item, fieldName);
      if (!value) return null;
      return {
        label: getFieldLabel(config, fieldName),
        value,
      };
    })
    .filter((entry): entry is { label: string; value: string } => entry !== null);

  const thumbnail = typeof item.image === "string" && item.image.trim() ? item.image : undefined;

  return { id, title, details, thumbnail };
}
