import { useParams } from "react-router";
import useFetch from "../hooks/useFetch";
import type { Player } from "../types";
import Summary from "../components/Summary";
import ChampionTable from "../components/ChampionTable";
import MatchList from "../components/MatchList";


export default function PlayerPage() {
    const { name, tag } = useParams();
    const { data: player, loading, showLoading, error } = useFetch<Player>(
        `/api/players/lookup/${encodeURIComponent(name ?? "")}/${encodeURIComponent(tag ?? "")}`
    );

    if (!player && loading) return showLoading ? (<p>Loading...</p>) : null;
    if (error) return <p>Error: {error}</p>;
    if (!player) return <p>No such player in the database</p>;

    return (
        <>
            <Summary puuid={player.puuid}></Summary>
            <MatchList puuid={player.puuid} pageSize={5} ></MatchList>
            <ChampionTable puuid={player.puuid}></ChampionTable>
        </>
    );
}