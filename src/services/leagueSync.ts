import { saveLeague } from "../db/league.ts";
import { getLeague } from "../riot/index.ts";

export const syncLeague = async (puuid: string, leagueRegion = "euw1") => {
    const league = await getLeague(puuid, leagueRegion);
    saveLeague(league);
};