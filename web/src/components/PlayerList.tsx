
import useFetch from "../hooks/useFetch.ts";
import type { Player } from "../types.ts";

interface Props {
  selectedPuuid: string | null;
  onSelect: (puuid: string) => void;
}

export default function PlayerList({ selectedPuuid, onSelect }: Props) {
  const { data, loading, showLoading, error } = useFetch<Player[]>(
    `/api/players`
  );

  if (!data && loading) return showLoading ? <p>Loading...</p> : null;
  if (error) return <p>Error: {error}</p>;
  if (!data || data.length === 0) return <p>No players in the database.</p>

  return (
    <div style={{ opacity: showLoading ? 0.5 : 1 }}>
      <ul>
        {data.map((p) => (
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
    </div>
  );
}