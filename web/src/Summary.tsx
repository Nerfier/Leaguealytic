import { useEffect, useState } from "react";
import type { Summary as SummaryData } from "./types.tsx";

export default function Summary({ puuid }: { puuid: string }) {
    const [data, setData] = useState<SummaryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        fetch(`/api/players/${puuid}/summary`)
            .then((res) => {
                if (res.status === 404) return null;
                if (!res.ok) throw new Error(`Request failed: ${res.status}`);
                return res.json() as Promise<SummaryData>;
            })
            .then((d) => { if (!cancelled) setData(d); })
            .catch((err) => { if (!cancelled) setError(err.message); })
            .finally(() => { if (!cancelled) setLoading(false); });

        return () => { cancelled = true; };
    }, [puuid]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!data) return <p>No matches synced for this player yet.</p>;

    return (
        <div>
            <p>Games: {data.games}</p>
            <p>Win rate: {data.win_rate}%</p>
            <p>KDA: {data.kda}</p>
        </div>
    );
}