import {Link, useParams} from "react-router";
import Summary from "../components/Summary.tsx";
import ChampionTable from "../components/ChampionTable.tsx";
import usePlayer from "../hooks/usePlayer.ts";
import MatchHistory from "../components/MatchHistory.tsx";

export default function PlayerPage() {
    const { name, tag } = useParams();
    const { data: player, loading, showLoading, error } = usePlayer(name, tag);

    if (!player && loading) return showLoading ? (<p>Loading...</p>) : null;
    if (error) return <p>Error: {error}</p>;
    if (!player) return <p>No such player in the database</p>;

    return (
        <>
            <h2>{player.game_name}</h2>
            <Summary puuid={player.puuid} />
            <div>
                <Link to={`/player/${name}/${tag}/matches`}>View all matches</Link>
                <MatchHistory puuid={player.puuid} pageSize={5} showPager={false} />
            </div>
            <ChampionTable puuid={player.puuid} />
        </>
    );
}