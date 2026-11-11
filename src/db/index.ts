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

CREATE INDEX IF NOT EXISTS idx_participants_puuid ON match_participants(puuid);
CREATE INDEX IF NOT EXISTS idx_participants_champion ON match_participants(champion_id);
CREATE INDEX IF NOT EXISTS idx_matches_start ON matches(game_start);
`);

export default db;
