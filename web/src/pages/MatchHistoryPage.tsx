import { useParams } from "react-router";
import { usePlayer } from "../hooks/usePlayer.ts";


export default function MatchHistoryPage() {
    const { name, tag} = useParams();
    const { data: player, loading, showLoading, error } = usePlayer(name, tag);

    if (!player && loading) return showLoading ? (<p>Loading...</p>) : null;
    if (error) return <p>Error: {error}</p>;
    if (!player) return <p>No such player in the database</p>;

    return (
        <>
        </>
    );
}