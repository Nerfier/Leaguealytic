import useFetch from "../hooks/useFetch.ts";
import type { Champion } from "../types.ts";

export default function ChampionTable({ puuid }: { puuid: string }) {
    const { data, loading, showLoading, error } = useFetch<Champion[]>(
        `/api/players/${puuid}/champions`
    );

    if (!data && loading) return showLoading ? <p>Loading...</p> : null;
    if (error) return <p>Error: {error}</p>;
    if (!data || data.length === 0) return <p>No registered champions for this player synced yet</p>;

    return (
        <div style={{ opacity: showLoading ? 0.5 : 1 }}>
            <table>
                <thead>
                    <tr>
                        <th>Champion</th>
                        <th>Games</th>
                        <th>Win rate</th>
                        <th>KDA</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(c => (
                        <tr key={c.champion}>
                            <td>{c.champion}</td>
                            <td>{c.games}</td>
                            <td>{c.win_rate ?? "-"}%</td>
                            <td>{c.kda ?? "-"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
