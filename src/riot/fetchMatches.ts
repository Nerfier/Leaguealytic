import key from "./key.ts";

export const fetchMatches = async (
    puuid: string,
    params?: {
    startTime?: number, 
    endTime?: number, 
    queueId?: number,
    type?: string, 
    startIndex?: number, 
    count?: number}) => {
        if (params?.count && params.count >= 20 ) {
            throw new Error("Will exceed API limi t of 20 matches per request. Please reduce the count to 20 or less.");
        }
        const res = await fetch(
            `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?${params?.startTime ? `startTime=${params.startTime}` : ''}&${params?.endTime ? `endTime=${params.endTime}` : ''}&${params?.queueId ? `queue=${params.queueId}` : ''}&${params?.type ? `type=${params.type}` : ''}&${params?.startIndex ? `start=${params.startIndex}` : ''}&${params?.count ? `count=${params.count}` : ''}&${`api_key=${key}`}`
        );
        if (!res.ok) {
            throw new Error(`Failed to fetch matches: ${res.status} ${res.statusText}`);
        }

        const match_ids = await res.json();
        return await Promise.all(match_ids.map(async (match_id: string) => {
            const match = await fetchMatch(match_id);
            return match;
        }));
    }

export const fetchMatch = async (match_id: string) => {
    const res = await fetch(
        `https://europe.api.riotgames.com/lol/match/v5/matches/${match_id}?api_key=${key}`
    );
    if (!res.ok) {
        throw new Error(`Failed to fetch match: ${res.status} ${res.statusText}`);
    }
    return await res.json();
}