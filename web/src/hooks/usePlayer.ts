import type { Player } from "../types.ts";
import useFetch from "./useFetch.ts";


export const usePlayer = (name: string | undefined, tag: string | undefined) => {
    return useFetch<Player>(
        `/api/players/lookup/${encodeURIComponent(name ?? "")}/${encodeURIComponent(tag ?? "")}`
    );
}