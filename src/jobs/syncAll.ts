import { getAllPlayers} from "../db/players.ts";
import { syncLeague } from "../services/leagueSync.ts";
import { syncMatches } from "../services/matchSync.ts";

let running = false;

export const syncAllPlayers = async (): Promise<void> => {
    if (running) {
        console.log("Sync still running. Skipping tick");
        return;
    }
    try {
        for (const p of getAllPlayers()) {
            try {
                const saved = await syncMatches(p.puuid);
                console.log(`${p.game_name}#${p.tag_line}: ${saved} new matches`);
                if (!saved) continue;
            } catch (err) {
                console.error(`Sync failed for ${p.game_name}#${p.tag_line}:`, err);
            }
            try {
                syncLeague(p.puuid);
            } catch (err) {
                console.error(`Sync failed for ${p.game_name}#${p.tag_line}: `, err);
            }
        }
    } finally {
        running = false;
    }
};