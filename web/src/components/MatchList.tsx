import useFetch from "../hooks/useFetch.ts";
import type { MatchRow } from "../types.ts";
import { useState } from "react";

const PAGE_SIZE = 20;

const QUEUES: Record<number, string> = {
    420: "Ranked Solo",
    440: "Ranked Flex",
    450: "ARAM",
    400: "Normal Draft",
    480: "Swiftplay",
};

const getQueueName = (id: number): string => {
    if (id >= 1700 && id < 1800) return "Arena";
    return QUEUES[id] ?? String(id);
}


export default function MatchList({ puuid }: { puuid: string }) {
    const [page, setPage] = useState(0);
    const { data, loading, showLoading, error } = useFetch<MatchRow[]>(
        `/api/players/${puuid}/matches?limit=${PAGE_SIZE}&offset=${page * PAGE_SIZE}`
    );

    if (!data && loading) return showLoading ? <p>Loading...</p> : null;
    if (error) return <p>Error: {error}</p>;
    if (!data || data.length === 0) return <p>No games yet.</p>;

    return (
        <div style={{ opacity: showLoading ? 0.5 : 1}}>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Queue</th>
                        <th>Champion</th>
                        <th>Result</th>
                        <th>K/D/A</th>
                        <th>CS</th>
                        <th>Length</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((m) => (
                        <tr key={m.match_id}>
                            <td>{new Date(m.game_start).toLocaleDateString()}</td>
                            <td>{getQueueName(m.queue_id)}</td>
                            <td>{m.champion_name}</td>
                            <td>{m.win ? "Win" : "Loss"}</td>
                            <td>{m.kills}/{m.deaths}/{m.assists}</td>
                            <td>{m.cs}</td>
                            <td>{Math.floor(m.duration / 60)}m</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={() => setPage((p) => p - 1)} disabled={page === 0}>
                Previous
            </button>
            <span> Page {page + 1} </span>
            <button
                onClick={() => setPage((p) => p + 1)}
                disabled={data.length < PAGE_SIZE}
            >
                Next
            </button>
        </div>
    );
}