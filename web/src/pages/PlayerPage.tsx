import { useParams } from "react-router";
import useFetch from "../hooks/useFetch.ts";
import type { Player } from "../types.ts";
import Summary from "../components/Summary.tsx";
import ChampionTable from "../components/ChampionTable.tsx";
import MatchList from "../components/MatchList.tsx";
import SearchBox from "../components/SearchBox.tsx";


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
            <h2>{player.game_name}</h2>
            <Summary puuid={player.puuid} />
            <MatchList puuid={player.puuid} pageSize={5} />
            <ChampionTable puuid={player.puuid} />
        </>
    );
}