import {useSearchParams} from "react-router";
import {getQueueLabel, QUEUES} from "../lib/queues.ts";
import useFetch from "../hooks/useFetch.ts";
import type {MatchRow} from "../types.ts";

const PAGE_SIZE = 10;

interface Props {
    puuid: string;
    pageSize?: number;
    showPager?: boolean;
}

export default function MatchHistory({
    puuid,
    pageSize = PAGE_SIZE,
    showPager = true,
}: Props) {
    const [params, setParams] = useSearchParams();

    const page = showPager
        ? Math.max(0, Math.floor(Number(params.get("page"))) || 0)
        : 0;
    const rawQueue = params.get("queue") ?? "";
    const queue = (showPager && rawQueue in QUEUES) ? rawQueue : "";

    const query = new URLSearchParams({
        limit: String(pageSize),
        offset: String(page * pageSize),
    });
    if (queue) query.set("queue", queue);

    const {data: matches, loading, showLoading, error} = useFetch<MatchRow[]>(
        `/api/players/${puuid}/matches?${query}`,
    );

    if (!matches && loading) return showLoading ? (<p>Loading...</p>) : null;
    if (error) return <p>Error: {error}</p>;

    const changePage = (next: number) => {
        setParams(prev => {
            const p = new URLSearchParams(prev);
            p.set("page", String(next));
            return p;
        });
    }

    const changeQueue = (next: string) => {
        setParams(prev => {
            const p = new URLSearchParams(prev);
            if (next) p.set("queue", next);
            else p.delete("queue");
            p.delete("page");
            return p;
        });
    }

    return (
        <div>
            {showPager && (
                <label>
                    Queue{" "}
                    <select value={queue} onChange={e => changeQueue(e.target.value)}>
                        <option value="">All queues</option>
                        {Object.entries(QUEUES).map(([key, [, , label]]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>
                </label>
            )}

            {error ? (
                <p>Error: {error}</p>
            ) : !matches || matches.length === 0 ? (
                <p>No games found.</p>
            ) : (
                <div style={{ opacity: loading && showLoading ? 0.5 : 1 }}>
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
                        {matches.map(m => (
                            <tr key={m.match_id}>
                                <td>{new Date(m.game_start).toLocaleDateString()}</td>
                                <td>{getQueueLabel({id: m.queue_id})}</td>
                                <td>{m.champion_name}</td>
                                <td>{m.win ? "Win" : "Loss"}</td>
                                <td>{m.kills}/{m.deaths}/{m.assists}</td>
                                <td>{m.cs}</td>
                                <td>{Math.floor(m.duration / 60)}m</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showPager && (
                <div>
                    <button
                        onClick={() => changePage(0)}
                        disabled={page === 0}
                        aria-label={"Start"}
                    >{"<<"}</button>
                    <button
                        onClick={() => changePage(page - 1)}
                        disabled={page === 0}
                        aria-label={"Previous"}
                    >{"<"}</button>
                    <span> Page {page + 1} </span>
                    <button
                        onClick={() => changePage(page + 1)}
                        disabled={!matches || (matches.length < pageSize)}
                        aria-label={"Next"}
                    >{">"}</button>
                </div>
            )}
        </div>
    );
}