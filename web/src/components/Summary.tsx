import useFetch from "../hooks/useFetch.ts";
import type { Summary as SummaryData } from "../types.ts";

export default function Summary({ puuid }: { puuid: string }) {
    const { data, loading, error} = useFetch<SummaryData>(
        `/api/players/${puuid}/summary`
    );

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