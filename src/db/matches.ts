import db from "./index.ts";

// Insert or replace match data
const insertMatch = db.prepare(`
    INSERT OR REPLACE INTO matches (match_id, game_start, duration, queue_id, game_version, raw_json)
    VALUES (@match_id, @game_start, @duration, @queue_id, @game_version, @raw_json)
`);

// Insert or replace participant data for a match
const insertParticipant = db.prepare(`
    INSERT OR REPLACE INTO match_participants (match_id, puuid, champion_id, champion_name, position, team_id, win, kills, deaths, assists, cs, gold, damage, vision_score)
    VALUES (@match_id, @puuid, @champion_id, @champion_name, @position, @team_id, @win, @kills, @deaths, @assists, @cs, @gold, @damage, @vision_score)
`);

// Save a match and its participants to the database
export const saveMatch = db.transaction((match: any) => {
    if (matchExists(match.metadata.matchId)) {
        console.log(`Match ${match.metadata.matchId} already exists in the database.`);
        return;
    }
    const match_id = match.metadata.matchId;
    
    insertMatch.run({
        match_id: match_id,
        game_start: match.info.gameStartTimestamp,
        duration: match.info.gameDuration,
        queue_id: match.info.queueId,
        game_version: match.info.gameVersion,
        raw_json: JSON.stringify(match)
    });

    match.info.participants.forEach((participant: any) => {
        insertParticipant.run({
            match_id: match_id,
            puuid: participant.puuid,
            champion_id: participant.championId,
            champion_name: participant.championName,
            position: participant.teamPosition,
            team_id: participant.teamId,
            win: Number(participant.win),
            kills: participant.kills,
            deaths: participant.deaths,
            assists: participant.assists,
            cs: participant.totalMinionsKilled + participant.neutralMinionsKilled,
            gold: participant.goldEarned,
            damage: participant.totalDamageDealtToChampions,
            vision_score: participant.visionScore
        });
    });
});

// Check if a match exists in the database
export const matchExists = (matchId : string) => {
    const row = db.prepare("SELECT 1 FROM matches WHERE match_id = ?").get(matchId);
    return !!row;
}

const selectMatches = db.prepare(`
  SELECT m.match_id, m.game_start, m.duration, m.queue_id,
         p.champion_name, p.position, p.win, p.kills, p.deaths, p.assists, p.cs
  FROM match_participants p
  JOIN matches m ON m.match_id = p.match_id
  WHERE p.puuid = @puuid AND (@queue_id IS NULL OR m.queue_id = @queue_id)
  ORDER BY m.game_start DESC
  LIMIT @limit OFFSET @offset
`);

export const getRecentMatches = (
    puuid: string, 
    limit: number = 20, 
    offset: number = 0,
    queue_id: number | null = null) =>
        selectMatches.all({
            puuid: puuid,
            limit: limit,
            offset: offset,
            queue_id: queue_id
        });