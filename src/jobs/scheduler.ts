import cron from "node-cron";
import { syncAllPlayers } from "./syncAll.ts"
import { syncMeta } from "../services/metaSync.ts";

export const startJobs = (): void => {
    // Initial startup
    syncAllPlayers();

    // Setup schedules
    cron.schedule("*/30 * * * *", syncAllPlayers); // Sync once every hour
    cron.schedule("0 4 * * 5", syncMeta) // Sync every friday at 4 am
};