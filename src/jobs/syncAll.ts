import { getAllPlayers} from "../db/players.ts";
import { syncPlayer } from "../services/sync.ts";

let running = false;

export const syncAllPlayers = async (): Promise<void> => {
    if (running) {
        console.log("Sync still running. Skipping tick");
        return;
    }
    try {
        for (const p of getAllPlayers()) {
            try {
                const saved = await syncPlayer(p.puuid);
                console.log(`${p.game_name}#${p.tag_line}: ${saved} new matches`);
            } catch (err) {
                console.error(`Sync failed for ${p.game_name}#${p.tag_line}:`, err);
            }
        }
    } finally {
        running = false;
    }
};