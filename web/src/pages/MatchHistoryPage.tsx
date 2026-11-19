import { useParams } from "react-router";
import usePlayer from "../hooks/usePlayer.ts";
import MatchHistory from "../components/MatchHistory.tsx";


export default function MatchHistoryPage() {
    const {name, tag} = useParams();
    const {data: player, loading, showLoading, error} = usePlayer(name, tag);

    if (!player && loading) return showLoading ? (<p>Loading...</p>) : null;
    if (error) return <p>Error: {error}</p>;
    if (!player) return <p>This player isn't tracked</p>;

    return <MatchHistory key={player.puuid} puuid={player.puuid}/>;
}