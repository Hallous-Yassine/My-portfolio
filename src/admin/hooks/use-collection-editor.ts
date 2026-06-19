import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { fetchCollection, saveCollection } from "@/admin/lib/cms-api";
import { getCollection } from "@/admin/lib/content-config";
import type { CollectionKey } from "./types";

type ItemRecord = Record<string, unknown>;

function getItems(data: Record<string, unknown> | null, dataKey: string): ItemRecord[] {
  if (!data) return [];
  const items = data[dataKey];
  return Array.isArray(items) ? (items as ItemRecord[]) : [];
}

function reindexItems(items: ItemRecord[]): ItemRecord[] {
  return items.map((item, index) => ({ ...item, id: index + 1 }));
}

function createEmptyItem(config: ReturnType<typeof getCollection>): ItemRecord {
  const item: ItemRecord = { id: 0 };
  for (const field of config.fields) {
    if (field.type === "string-list" || field.type === "image-list") {
      item[field.name] = [];
    } else if (field.type === "number") {
      item[field.name] = field.name === "year" ? new Date().getFullYear() : 0;
    } else if (field.name === "credentialUrl") {
      item[field.name] = null;
    } else {
      item[field.name] = "";
    }
  }
  return item;
}

export function useCollectionEditor(collectionKey: CollectionKey) {
  const config = useMemo(() => getCollection(collectionKey), [collectionKey]);
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [savedSnapshot, setSavedSnapshot] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const items = useMemo(() => getItems(data, config.dataKey), [data, config.dataKey]);

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items.map((item, index) => ({ item, index }));
    const query = search.toLowerCase();
    return items
      .map((item, index) => ({ item, index }))
      .filter(({ item }) =>
        config.summaryFields.some((field) =>
          String(item[field] ?? "")
            .toLowerCase()
            .includes(query),
        ),
      );
  }, [items, search, config.summaryFields]);

  const isDirty = useMemo(() => {
    if (!data) return false;
    return JSON.stringify(data) !== savedSnapshot;
  }, [data, savedSnapshot]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = (await fetchCollection(collectionKey)) as Record<string, unknown>;
      setData(result);
      setSavedSnapshot(JSON.stringify(result));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load content.");
    } finally {
      setLoading(false);
    }
  }, [collectionKey]);

  useEffect(() => {
    void load();
  }, [load]);

  const updateItems = useCallback(
    (nextItems: ItemRecord[]) => {
      setData((prev) => {
        if (!prev) return prev;
        return { ...prev, [config.dataKey]: reindexItems(nextItems) };
      });
    },
    [config.dataKey],
  );

  const addItem = useCallback(() => {
    const next = [...items, createEmptyItem(config)];
    updateItems(next);
    setEditingIndex(next.length - 1);
  }, [items, config, updateItems]);

  const deleteItem = useCallback(
    (index: number) => {
      const next = items.filter((_, i) => i !== index);
      updateItems(next);
      setEditingIndex(null);
    },
    [items, updateItems],
  );

  const moveItem = useCallback(
    (index: number, direction: -1 | 1) => {
      const target = index + direction;
      if (target < 0 || target >= items.length) return;
      const next = [...items];
      [next[index], next[target]] = [next[target], next[index]];
      updateItems(next);
      setEditingIndex(target);
    },
    [items, updateItems],
  );

  const updateItem = useCallback(
    (index: number, nextItem: ItemRecord) => {
      const next = [...items];
      next[index] = nextItem;
      updateItems(next);
    },
    [items, updateItems],
  );

  const save = useCallback(async () => {
    if (!data) return;
    setSaving(true);
    try {
      const payload = {
        ...data,
        [config.dataKey]: reindexItems(getItems(data, config.dataKey)),
      };
      await saveCollection(collectionKey, payload);
      setData(payload);
      setSavedSnapshot(JSON.stringify(payload));
      toast.success(`${config.label} published to GitHub`, {
        description: "Site will rebuild in ~2 minutes.",
      });
    } catch (err) {
      toast.error("Publish failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setSaving(false);
    }
  }, [data, config, collectionKey]);

  const discard = useCallback(() => {
    if (!savedSnapshot) return;
    setData(JSON.parse(savedSnapshot) as Record<string, unknown>);
    setEditingIndex(null);
    toast.message("Changes discarded");
  }, [savedSnapshot]);

  return {
    config,
    items,
    filteredItems,
    loading,
    saving,
    error,
    search,
    setSearch,
    editingIndex,
    setEditingIndex,
    isDirty,
    load,
    addItem,
    deleteItem,
    moveItem,
    updateItem,
    save,
    discard,
  };
}
