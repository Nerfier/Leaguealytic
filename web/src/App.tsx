import { useState } from "react";
import PlayerList from "./PlayerList.tsx";
import Summary from "./Summary.tsx";
import ChampionTable from "./ChampionTable.tsx";

export default function App() {
    const [selectedPuuid, setSelectedPuuid] = useState<string | null>(null);

    return (
        <div>
            <h1>League Stats</h1>
            <PlayerList selectedPuuid={selectedPuuid} onSelect={setSelectedPuuid} />
            {selectedPuuid && <Summary puuid={selectedPuuid} />}
            {selectedPuuid && <ChampionTable puuid={selectedPuuid} />}
        </div>
    );
}