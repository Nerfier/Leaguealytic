import useFetch from "./useFetch.ts";
import type { Champion } from "./types.ts";

export default function ChampionTable({ puuid }: { puuid: string }) {
    const { data, error, loading} = useFetch<Champion[]>(
        `/api/players/${puuid}/champions`
    );

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!data || data.length === 0) return <p>No registered champions for this player synced yet</p>;

    return (
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
    );
}
