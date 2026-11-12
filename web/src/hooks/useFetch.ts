import { useEffect, useState } from "react";

interface Result<T> {
    url: string;
    data: T | null;
    error: string | null;
}

export default function useFetch<T>(url: string) {
    const [result, setResult] = useState<Result<T> | null>(null);

    useEffect(() => {
        let cancelled = false;

        fetch(url)
            .then(res => {
                if (res.status === 404) return null;
                if (!res.ok) throw new Error(`Request failed: ${res.status}`);
                return res.json() as Promise<T>;
            })
            .then(data => {
                if (!cancelled) setResult({ url, data, error: null});
            })
            .catch(err => {
                if (!cancelled) setResult({ url, data: null, error: err})
            });

            return () => {
                cancelled = true;
            };
    
    }, [url]);

    const loading = result === null || result.url !== url;
    return {
        data: loading? null : result.data,
        error: loading ? null : result?.error,
        loading,
    };
}