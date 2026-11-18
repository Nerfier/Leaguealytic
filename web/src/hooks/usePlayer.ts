import type { Player } from "../types.ts";
import useFetch from "./useFetch.ts";


export default function usePlayer(name: string | undefined, tag: string | undefined) {
    return useFetch<Player>(
        `/api/players/lookup/${encodeURIComponent(name ?? "")}/${encodeURIComponent(tag ?? "")}`
    );
}