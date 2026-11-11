import "dotenv/config";
const key: string = String(process.env.RIOT_API_KEY);

const REGION = "europe";
const BASE_URL = `https://${REGION}.api.riotgames.com`;

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms)); 

const riotFetch = async <T> (path: string, retries = 3): Promise<T> => {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: {"X-Riot-Token": key}
    });
    if (res.status === 429 && retries > 0) {
        const wait = Number(res.headers.get("Retry-After") ?? 10);
        console.log(`Rate limited, waiting ${wait}s..`);
        await sleep(wait * 1000);
        return riotFetch<T>(path, retries - 1);
    }

    if (!res.ok) {
        throw new Error(`Failed to fetch ${path}: ${res.status} ${res.statusText}`);
    }
    return res.json() as Promise<T>;
}

export async function getPlayer(gameName: string, tagLine: string): Promise<any>;
export async function getPlayer(puuid: string): Promise<any>;
export async function getPlayer(gameName?: string, tagLine?: string, puuid?: string): Promise<any> {
    if (puuid) {
        return await riotFetch(
            `/riot/account/v1/accounts/by-puuid/${puuid}`
        );
    }
    if (gameName && tagLine) {
        return await riotFetch(
            `/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`
        );
    } 
    throw new TypeError("No arguments inputed!");
}

export async function getMatchIds(
    puuid: string,
    params?: {
    startTime?: number, 
    endTime?: number, 
    queueId?: number,
    type?: string, 
    startIndex?: number, 
    count?: number}): Promise<string[]> {
        return await riotFetch<string[]>(
            `/lol/match/v5/matches/by-puuid/${puuid}/ids?${params?.startTime ? `startTime=${params.startTime}` : ''}&${params?.endTime ? `endTime=${params?.endTime}` : ''}&${params?.queueId ? `queue=${params?.queueId}` : ''}&${params?.type ? `type=${params?.type}` : ''}&${params?.startIndex ? `start=${params?.startIndex}` : ''}&${params?.count ? `count=${params?.count}` : ''}`
        );
    }

export async function getMatch(match_id: string): Promise<any> {
    return await riotFetch(`/lol/match/v5/matches/${match_id}`);
}