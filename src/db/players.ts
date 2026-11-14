import db from "./index.ts";

const insertPlayer = db.prepare(`
    INSERT OR REPLACE INTO players (puuid, game_name, tag_line)
    VALUES (@puuid, @game_name, @tag_line)
`);

export const savePlayer = (player: any) => {
    insertPlayer.run({
        puuid: player.puuid,
        game_name: player.gameName,
        tag_line: player.tagLine
    });
};    
    
const updateLastSynced = db.prepare(`
    UPDATE players SET last_synced = @last_synced WHERE puuid = @puuid
`);

export const touchPlayer = (puuid: string, lastSynced: number) => {
    updateLastSynced.run({
        puuid: puuid,
        last_synced: lastSynced
    })
};

const selectLastSynced = db.prepare(
    `SELECT last_synced FROM players WHERE puuid = ?`
);

export const getLastSynced = (puuid: string): number | null => {
    const row = selectLastSynced.get(puuid) as
        | { last_synced: number | null}
        | undefined;
    return row?.last_synced ?? null;
};

const selectAllPlayers = db.prepare(`
    SELECT puuid, game_name, tag_line FROM players
`);

export const getAllPlayers = () => selectAllPlayers.all() as { puuid: string, game_name: string, tag_line: string}[];

const selectPlayer = db.prepare(
    `SELECT * FROM players WHERE game_name = @name COLLATE NOCASE AND tag_line = @tag COLLATE NOCASE`
);

export const findPlayer = (args: { name: string, tag: string}) => {
    const row = selectPlayer.get(args) as
        | { puuid: number; game_name: string, tag_line: string, last_synced: number }
        | undefined;
    return row ?? null;
}