import { useState } from "react";
import useFetch from "../hooks/useFetch.ts";
import type { ComboRow } from "../types.ts";

const Results = ({ champion, puuid }: { champion: string, puuid: string | null }) => {
    const name = encodeURIComponent(champion);
    const url = puuid
        ? `api/players/${puuid}/combos/${name}`
        : `api/combos/${name}`;

    const { data, loading, showLoading, error } = useFetch<ComboRow[]>(url);

    if (!data && loading) return showLoading ? <p>Loading...</p> : null;
    if (error) return <p>Error: {error}</p>;
    if (!data || data.length === 0) return <p>No combos found for {champion}</p>;

    return (
        <div style={{ opacity: loading ? 0.5 : 1 }}>
            <table>
                <thead>
                    <tr>
                        <th>{champion} as</th>
                        <th>Partner</th>
                        <th>Combo type</th>
                        {puuid && <th>Games</th>}
                        {puuid && <th>Win rate</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.map((c) => (
                        <tr key={`${c.role}-${c.partner}`}>
                            <td>{c.role}</td>
                            <td>{c.partner}</td>
                            <td>{c.combo_type}</td>
                            {puuid && <td>{c.games}</td>}
                            {puuid && <td>{c.win_rate != null ? `${c.win_rate}%` : "-"}</td>}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default function ComboLookup({ puuid }: { puuid: string | null }) {
    const { data: champions } = useFetch<string[]>(
        `/api/combos/champions`
    );
    const [input, setInput] = useState("");

    const match = champions?.find(c => c.toLowerCase() === input.trim().toLowerCase());

    return (
        <div>
            <h2>Bot lane combos</h2>
            <input
                list="combo-champions"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter an ADC or support"
            />
            <datalist id="combo-champions">
                {champions?.map((c) => <option key={c} value={c} />)}
            </datalist>
            {match && <Results champion={match} puuid={puuid} />}
        </div>
    );
}
