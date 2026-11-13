import { useState } from "react";
import PlayerList from "./components/PlayerList.tsx";
import Summary from "./components/Summary.tsx";
import ChampionTable from "./components/ChampionTable.tsx";
import MatchList from "./components/MatchList.tsx";
import ComboLookup from "./components/ComboLookup.tsx";

export default function App() {
    const [selectedPuuid, setSelectedPuuid] = useState<string | null>(null);

    return (
        <div>
            <h1>League Stats</h1>
            <PlayerList selectedPuuid={selectedPuuid} onSelect={setSelectedPuuid} />
            {/* {selectedPuuid && <Summary puuid={selectedPuuid} />}
            {selectedPuuid && <ChampionTable puuid={selectedPuuid} />}
            {selectedPuuid && <MatchList puuid={selectedPuuid} />} */}
            {selectedPuuid && <ComboLookup puuid={selectedPuuid} />}
        </div>
    );
}