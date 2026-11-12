import { useEffect, useState } from "react";
import type { Player } from "./types.ts";

interface Props {
  selectedPuuid: string | null;
  onSelect: (puuid: string) => void;
}

export default function PlayerList({ selectedPuuid, onSelect }: Props) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/players")
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json() as Promise<Player[]>;
      })
      .then(setPlayers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {players.map((p) => (
        <li key={p.puuid}>
          <button
            onClick={() => onSelect(p.puuid)}
            disabled={p.puuid === selectedPuuid}
          >
            {p.game_name}#{p.tag_line}
          </button>
        </li>
      ))}
    </ul>
  );
}