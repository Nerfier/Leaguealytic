import db from "./index.ts";

const selectSummary = db.prepare(`
    SELECT  COUNT(*) AS games,
            SUM(win) AS wins,
            ROUND(100.0 * SUM(win) / COUNT(*), 1) AS win_rate,
            ROUND(1.0 * (SUM(kills) + SUM(assists)) / MAX(SUM(deaths), 1), 2) AS kda
    FROM match_participants
    WHERE puuid = ?
`);

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

const selectMatches = db.prepare(`
  SELECT m.match_id, m.game_start, m.duration, m.queue_id,
         p.champion_name, p.position, p.win, p.kills, p.deaths, p.assists, p.cs
  FROM match_participants p
  JOIN matches m ON m.match_id = p.match_id
  WHERE p.puuid = ?
  ORDER BY m.game_start DESC
  LIMIT ? OFFSET ?
`);

export const getSummary = (puuid: string) => {
    const row = selectSummary.get(puuid) as 
        | { games: number; wins: number | null; win_rate: number | null; kda: number | null }
        | undefined
    return row && row.games > 0 ? row : null;
}

export const getChampionStats = (puuid: string) => selectChampions.all(puuid);

export const getRecentMatches = (puuid: string, limit: number = 20, offset: number = 0) =>
  selectMatches.all(puuid, limit, offset);