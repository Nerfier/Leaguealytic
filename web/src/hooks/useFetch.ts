import { useEffect, useState } from "react";

interface Result<T> {
  url: string;
  data: T | null;
  error: string | null;
}

export default function useFetch<T>(url: string | null, delayMs = 200) {
  const [result, setResult] = useState<Result<T> | null>(null);
  const [showLoading, setShowLoading] = useState(false);

  // Fetch
  useEffect(() => {
    let cancelled = false;

    if (url === null) return;

    fetch(url)
      .then((res) => {
        if (res.status === 404) return null;
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json() as Promise<T>;
      })
      .then((data) => {
        if (!cancelled) setResult({ url, data, error: null });
      })
      .catch((err) => {
        if (!cancelled) setResult({ url, data: null, error: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  const loading = url !== null && (result === null || result.url !== url);

  // Delayed loading flag
  useEffect(() => {
    if (!loading) {
      const reset = setTimeout(() => setShowLoading(false), 0);
      return () => clearTimeout(reset);
    }
    const timer = setTimeout(() => setShowLoading(true), delayMs);
    return () => clearTimeout(timer);
  }, [loading, delayMs]);

  return {
    dataUrl: result?.url ?? null,
    data: result?.data ?? null,   // keeps the previous data while loading
    error: loading ? null : result?.error ?? null,
    loading,                      // true during any fetch (use for dimming)
    showLoading,                  // true only if loading lasts longer than delayMs
  };
}