import { saveMetaSnapshot } from "../db/meta.ts";
import { fetchLaneMetaText } from "../opgg/clients.ts";
import { parseLaneMeta } from "../opgg/parse.ts";


export const syncMeta = async (): Promise<number> => {
    const text = await fetchLaneMetaText();
    const rows = parseLaneMeta(text);
    saveMetaSnapshot(text, rows);
    return rows.length;
}