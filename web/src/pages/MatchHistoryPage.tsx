import {useParams, useSearchParams} from "react-router";
import usePlayer from "../hooks/usePlayer.ts";
import useFetch from "../hooks/useFetch.ts";
import type { MatchRow } from "../types.ts";
import { getQueueLabel, getQueueRange, QUEUES } from "../lib/queues.ts";

const PAGE_SIZE = 20;

export default function MatchHistoryPage() {
    return (
        <MatchList pageSize={PAGE_SIZE}/>
    );
};

const MatchList = ({pageSize} : {pageSize: number}) => {
    const {name, tag} = useParams();
    const {data: player} = usePlayer(name, tag);
    const [params, setParams] = useSearchParams();

    const page = Number(params.get("page")) || 0;
    const queueFilter = String(params.get("queue")) || "";

    const {min, max} = queueFilter
        ? getQueueRange({ key: queueFilter }) ?? {min: null, max: null}
        : {min: null, max: null};

    let url =
        `/api/players/${player?.puuid}/matches?limit=${pageSize}&offset=${page * pageSize}`
    if (min) url += `&queueMin=${min}&queueMax=${max}`;

    const {data: matches, loading, showLoading, error} = useFetch<MatchRow[]>(url);


    if (!matches && loading) return showLoading ? (<p>Loading...</p>) : null;
    if (error) return <p>Error: {error}</p>;
    if (!matches) return <p>No matches found for this player</p>;

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
           if (next) p.set("queue", String(next));
           else p.delete("queue");
           p.set("page", String(0));
           return p;
        });
    }

    return (
        <div>
            <select
                name="Queue"
                onChange={(e) => changeQueue(e.target.value)}
            >
                <option value="">All queues</option>
                {Object.entries(QUEUES).map(([key, [, , label]]) => (
                    <option key={key} value={key}>{label}</option>
                ))}
            </select>

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
                        <td>{getQueueLabel({ id: m.queue_id })}</td>
                        <td>{m.champion_name}</td>
                        <td>{m.win ? "Win" : "Loss"}</td>
                        <td>{m.kills}/{m.deaths}/{m.assists}</td>
                        <td>{m.cs}</td>
                        <td>{Math.floor(m.duration / 60)}m</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div>
                <button
                    onClick={() => changePage(0)}
                    disabled={page === 0}
                >{"<<"}</button>
                <button
                    onClick={() => changePage(page - 1)}
                    disabled={page === 0}
                >{"<"}</button>
                <span> Page {page + 1} </span>
                <button
                    onClick={() => changePage(page + 1)}
                    disabled={matches.length < pageSize}
                >{">"}</button>
            </div>
        </div>

    );
}