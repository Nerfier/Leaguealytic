import db from "./index.ts";

const insertPlayer = db.prepare(`
    INSERT OR REPLACE INTO players (puuid, game_name, tag_line)
    VALUES (@puuid, @game_name, @tag_line)
`);

const updateLastSynced = db.prepare(`
    UPDATE players SET last_synced = @last_synced WHERE puuid = @puuid
`);

const selectLastSynced = db.prepare(
    `SELECT last_synced FROM players WHERE puuid = ?`
);

const updatePlayer = db.prepare(`
    UPDATE players SET game_name = @game_name, tag_line = @tag_line WHERE puuid = @puuid
`);

const selectAllPlayers = db.prepare(`
    SELECT puuid, game_name, tag_line FROM players
`);

export const savePlayer = (player: any) => {
    insertPlayer.run({
        puuid: player.puuid,
        game_name: player.gameName,
        tag_line: player.tagLine
    });
};    
        
export const touchPlayer = (puuid: string, lastSynced: number) => {
    updateLastSynced.run({
        puuid: puuid,
        last_synced: lastSynced
    })
};

export const getLastSynced = (puuid: string): number | null => {
    const row = selectLastSynced.get(puuid) as
        | { last_synced: number | null}
        | undefined;
    return row?.last_synced ?? null;
};

export const getAllPlayers = () => selectAllPlayers.all() as { puuid: string, game_name: string, tag_line: string}[];