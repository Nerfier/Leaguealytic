import db from "./index.ts";

const selectCombos = db.prepare(`
  SELECT 'ADC' AS role, support AS partner, combo_type
  FROM bot_combos WHERE adc = ? COLLATE NOCASE
  UNION ALL
  SELECT 'Support' AS role, adc AS partner, combo_type
  FROM bot_combos WHERE support = ? COLLATE NOCASE
  ORDER BY role, combo_type, partner
`);



export const getCombos = (champion: string) => {
  return selectCombos.all(champion, champion) as {
    role: "ADC" | "Support";
    partner: string;
    combo_type: string;
  }[];
}

const selectChampions = db.prepare(`
  SELECT adc AS name FROM bot_combos
  UNION
  SELECT support FROM bot_combos
  ORDER BY name
`);

export const getComboChampions = () =>
  (selectChampions.all() as { name: string }[]).map(r => r.name);

const selectComboStats = db.prepare(`
  SELECT c.role, c.partner, c.combo_type,
         COALESCE(s.games, 0) AS games,
         s.win_rate
  FROM (
    SELECT 'ADC' AS role, adc AS me, support AS partner, combo_type
    FROM bot_combos WHERE adc = @champion COLLATE NOCASE
    UNION ALL
    SELECT 'Support', support, adc, combo_type
    FROM bot_combos WHERE support = @champion COLLATE NOCASE
  ) c
  LEFT JOIN (
    SELECT a.champion_name AS me, a.position AS my_pos,
         t.champion_name AS partner, t.position AS partner_pos,
         COUNT(*) AS games,
         ROUND(100.0 * SUM(a.win) / COUNT(*), 1) AS win_rate
    FROM match_participants a
    JOIN matches m
      ON m.match_id = a.match_id
    JOIN match_participants t
      ON t.match_id = a.match_id AND t.team_id = a.team_id AND t.puuid != a.puuid
    WHERE a.puuid = @puuid
      AND m.queue_id = @queueId
    GROUP BY a.champion_name, a.position, t.champion_name, t.position
  ) s
    ON s.me = c.me
   AND s.partner = c.partner
   AND s.my_pos = CASE c.role WHEN 'ADC' THEN 'BOTTOM' ELSE 'UTILITY' END
   AND s.partner_pos = CASE c.role WHEN 'ADC' THEN 'UTILITY' ELSE 'BOTTOM' END
  ORDER BY c.role, c.combo_type, games DESC, c.partner
`);

interface ComboStatsRow {
  role: "ADC" | "Support";
  partner: string;
  combo_type: "string";
  games: number;
  win_rate: number | null;
}

export const getComboStats = (args: { champion: string; puuid: string; queueId: number }): ComboStatsRow[] =>
  selectComboStats.all(args) as ComboStatsRow[]