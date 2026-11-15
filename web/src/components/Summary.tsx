import useFetch from "../hooks/useFetch.ts";
import type { Summary as SummaryData } from "../types.ts";

export default function Summary({ puuid }: { puuid: string }) {
    const { data, loading, showLoading, error} = useFetch<SummaryData>(
        `/api/players/${puuid}/summary`
    );

    if (!data && loading) return showLoading ? <p>Loading...</p> : null;
    if (error) return <p>Error: {error}</p>;
    if (!data) return <p>No matches synced for this player yet.</p>;

    return (
        <div style={{ opacity: showLoading ? 0.5 : 1}}>
            {matchHTML(data.matchSummary)}
            {LeagueHTML(data.soloSummary)}
            {LeagueHTML(data.flexSummary)}
        </div>
    );
}


const matchHTML = (data: SummaryData["matchSummary"]) => {
    return (
        <div>
            <b>All queues</b>
            <p>Games: {data.games}</p>
            <p>Win rate: {data.win_rate}%</p>
            <p>KDA: {data.kda}</p>
        </div>
    );
}

const LeagueHTML = (data: SummaryData["soloSummary"] | SummaryData["flexSummary"]) => {
    return (
        <div>
            <b>{cleanupQueue(data.queue)}</b>
            <p>Rank: {data.tier} {data.rank} {data.lp}</p>
            <p>Wins: {data.wins}</p>
            <p>Losses: {data.losses}</p>
            <p>Win Rate: {data.win_rate ?? 0}%</p>
            <p></p>
        </div>
    );
}

const cleanupQueue = (queue: string) => 
    queue === "RANKED_FLEX_SR" ? "Ranked Flex" : "Ranked Solo/Duo";