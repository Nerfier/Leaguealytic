import db from "./index.ts";

const selectSummary = db.prepare(`
    SELECT  COUNT(*) AS games,
            SUM(win) AS wins,
            ROUND(100.0 * SUM(win) / COUNT(*), 1) AS win_rate,
            ROUND(1.0 * (SUM(kills) + SUM(assists)) / MAX(SUM(deaths), 1), 2) AS kda
    FROM match_participants
    WHERE puuid = ?
`);

const selectLeague = db.prepare(`
    SELECT  queue_type AS queue,
            tier,
            rank,
            league_points AS lp,
            wins,
            losses,
            ROUND(100.0 * wins / (wins + losses), 1) AS win_rate
    FROM league
    WHERE puuid = @puuid AND queue_type = @queue_type
`)

export const getSummary = (puuid: string) => {
  const rowMatches = selectSummary.get(puuid) as
    | { games: number; wins: number | null; win_rate: number | null; kda: number | null }
    | undefined

  const rowSolo = selectLeague.get({ puuid: puuid, queue_type: "RANKED_SOLO_5x5" }) as
    | { queue: string; tier: string; rank: string; lp: number; wins: number; losses: number; win_rate: number | null }
    | undefined

  const rowFlex = selectLeague.get({ puuid: puuid, queue_type: "RANKED_FLEX_SR" }) as
    | { queue: string; tier: string; rank: string; lp: number; wins: number; losses: number; win_rate: number | null }
    | undefined

  return {
    matchSummary: rowMatches && rowMatches.games > 0 ? rowMatches : null,
    soloSummary: rowSolo ?? null,
    flexSummary: rowFlex ?? null
  };
}

const selectChampions = db.prepare(`
  SELECT champion_name AS champion,
         COUNT(*) AS games,
         ROUND(100.0 * SUM(win) / COUNT(*), 1) AS win_rate,
         ROUND(1.0 * (SUM(kills) + SUM(assists)) / MAX(SUM(deaths), 1), 2) AS kda
  FROM match_participants
  WHERE puuid = ?
  GROUP BY champion_name
  ORDER BY games DESC
`);

export const getChampionStats = (puuid: string) => selectChampions.all(puuid);