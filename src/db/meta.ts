import db from "./index.ts";
import type { MetaRow } from "../opgg/parse.ts";

const insertSnapshot = db.prepare(
    `INSERT INTO meta_snapshots (fetched_at, raw_text) VALUES (?, ?)`
);
const insertRow = db.prepare(`
  INSERT INTO champion_meta
    (snapshot_id, champion_name, position, games, wins, kills, win_rate,
     pick_rate, ban_rate, role_rate, kda, meta_tier, meta_rank, rank_prev, is_rip)
  VALUES
    (@snapshotId, @championName, @position, @games, @wins, @kills, @winRate,
     @pickRate, @banRate, @roleRate, @kda, @metaTier, @metaRank, @rankPrev, @isRip)
`);

const saveSnapshotTx = db.transaction((rawText: string, rows: MetaRow[]) => {
    const { lastInsertRowid } = insertSnapshot.run(Date.now(), rawText);
    for (const r of rows) insertRow.run({ snapshotId: Number(lastInsertRowid), ...r});
    return Number(lastInsertRowid);
});

export function saveMetaSnapshot(rawText: string, rows: MetaRow[]): number {
    return saveSnapshotTx(rawText, rows);
}