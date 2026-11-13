import Database from "better-sqlite3";

const db: InstanceType<typeof Database> = new Database("./data/stats.db");
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
CREATE TABLE IF NOT EXISTS players (
  puuid TEXT PRIMARY KEY,
  game_name TEXT NOT NULL,
  tag_line TEXT NOT NULL,
  last_synced INTEGER
);

CREATE TABLE IF NOT EXISTS matches (
  match_id TEXT PRIMARY KEY,
  game_start INTEGER NOT NULL,
  duration INTEGER NOT NULL,
  queue_id INTEGER NOT NULL,
  game_version TEXT NOT NULL,
  raw_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS match_participants (
  match_id TEXT NOT NULL REFERENCES matches(match_id),
  puuid TEXT NOT NULL,
  champion_id INTEGER NOT NULL,
  champion_name TEXT NOT NULL,
  position TEXT,
  team_id INTEGER NOT NULL,
  win INTEGER NOT NULL,
  kills INTEGER NOT NULL,
  deaths INTEGER NOT NULL,
  assists INTEGER NOT NULL,
  cs INTEGER NOT NULL,
  gold INTEGER NOT NULL,
  damage INTEGER NOT NULL,
  vision_score INTEGER NOT NULL,
  PRIMARY KEY (match_id, puuid)
);

CREATE TABLE IF NOT EXISTS bot_combos (
  adc TEXT NOT NULL,
  support TEXT NOT NULL,
  combo_type TEXT NOT NULL,
  PRIMARY KEY (adc, support)
);

CREATE TABLE IF NOT EXISTS meta_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fetched_at INTEGER NOT NULL,
  raw_text TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS champion_meta (
  snapshot_id INTEGER NOT NULL REFERENCES meta_snapshots(id),
  champion_name TEXT NOT NULL,
  position TEXT NOT NULL,
  games INTEGER NOT NULL,
  wins INTEGER NOT NULL,
  kills INTEGER NOT NULL,
  win_rate REAL NOT NULL,
  pick_rate REAL,
  ban_rate REAL,
  role_rate REAL,
  kda REAL,
  meta_tier INTEGER,
  meta_rank INTEGER,
  rank_prev INTEGER,
  is_rip INTEGER NOT NULL,
  PRIMARY KEY (snapshot_id, champion_name, position)
);


CREATE INDEX IF NOT EXISTS idx_participants_puuid ON match_participants(puuid);
CREATE INDEX IF NOT EXISTS idx_participants_champion ON match_participants(champion_id);
CREATE INDEX IF NOT EXISTS idx_matches_start ON matches(game_start);
CREATE INDEX IF NOT EXISTS idx_matches_queue ON matches(queue_id);
CREATE INDEX IF NOT EXISTS idx_meta_champ ON champion_meta(champion_name, position);
`);

export default db;
