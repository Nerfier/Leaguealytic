import "dotenv/config";
const key: string = String(process.env.RIOT_API_KEY);

const REGION = "europe";
const BASE_URL = `https://${REGION}.api.riotgames.com`;



const riotFetch = async <T> (path: string): Promise<T> => {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: {"X-Riot-Token": key}
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch ${path}: ${res.status} ${res.statusText}`);
    }
    return res.json() as Promise<T>;
}

const getPUUID = async (gameName: string, tagLine: string): Promise<string> => {
    const data = await riotFetch< {puuid: string}>(
        `/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}}`
    );
    return data.puuid;
}

const getMatchIds = async (
    puuid: string,
    params?: {
    startTime?: number, 
    endTime?: number, 
    queueId?: number,
    type?: string, 
    startIndex?: number, 
    count?: number}) => {
        return await riotFetch<string[]>(
            `/lol/match/v5/matches/by-puuid/${puuid}/ids?${params?.startTime ? `startTime=${params.startTime}` : ''}&${params?.endTime ? `endTime=${params?.endTime}` : ''}&${params?.queueId ? `queue=${params?.queueId}` : ''}&${params?.type ? `type=${params?.type}` : ''}&${params?.startIndex ? `start=${params?.startIndex}` : ''}&${params?.count ? `count=${params?.count}` : ''}`
        );
    }

const getMatch = async (match_id: string) => {
    return await riotFetch(`/lol/match/v5/matches/${match_id}`);
}