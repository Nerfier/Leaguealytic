import { getMatch, getMatchIds } from "../riot/index.ts"
import { touchPlayer, getLastSynced} from "../db/players.ts"
import { matchExists, saveMatch} from "../db/matches.ts"

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export const syncMatches = async (puuid: string) => {
    const fullyBackfilled = getLastSynced(puuid) !== null;
    let saved = 0;
    let start = 0;
    
    while (true) {
        const matchIds = await getMatchIds(puuid, {
            startIndex: start,
            count: 100
        });
        if (matchIds.length === 0) break;

        for (const id of matchIds) {
            if (matchExists(id)) {
                if (fullyBackfilled) {
                    touchPlayer(puuid, Date.now());
                    return saved;
                }
                continue;
            }
            const match = await getMatch(id);
            saveMatch(match);
            saved++;
            await sleep(200);
        }
        
        start += 100;
    }

    touchPlayer(puuid, Date.now());
    return saved;
}