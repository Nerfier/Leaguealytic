import key from "./key.ts";

export const fetchPUUID = async (gameName: string, tagLine: string) => {
    const res = await fetch(
        `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${key}`
    );
    if (!res.ok) {
        throw new Error(`Failed to fetch PUUID: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log(data);
    return data.puuid;
}