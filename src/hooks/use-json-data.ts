import { useEffect, useState } from "react";
import { getAssetPath } from "@/lib/paths";

interface JsonDataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useJsonData<T>(relativePath: string): JsonDataState<T> {
  const [state, setState] = useState<JsonDataState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    setState({ data: null, loading: true, error: null });

    fetch(getAssetPath(relativePath))
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load data (${res.status})`);
        return res.json();
      })
      .then((json) => {
        if (!cancelled) {
          setState({ data: json as T, loading: false, error: null });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error: err instanceof Error ? err.message : "Failed to load data",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [relativePath]);

  return state;
}
