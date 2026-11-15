import db from "./index.ts";

const insertLeague = db.prepare(`
    INSERT OR REPLACE INTO league (puuid, queue_type, tier, rank, league_points, wins, losses, raw_json)
    VALUES (@puuid, @queue_type, @tier, @rank, @league_points, @wins, @losses, @raw_json)
`);


export const saveLeague = db.transaction((leagues: any[]) => {
    leagues.forEach(league => {
        insertLeague.run({
            puuid: league.puuid,
            queue_type: league.queueType,
            tier: league.tier,
            rank: league.rank,
            league_points: league.leaguePoints,
            wins: league.wins,
            losses: league.losses,
            raw_json: JSON.stringify(league)
        });
    });
});