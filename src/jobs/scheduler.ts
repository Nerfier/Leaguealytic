import cron from "node-cron";
import { syncAllPlayers } from "./syncAll.ts"

export const startJobs = (): void => {
    // Initial startup
    syncAllPlayers();

    // Setup schedules
    cron.schedule("*/30 * * * *", syncAllPlayers); // Sync once every hour
};