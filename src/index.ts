import db from "./db/index.ts";
import { fetchMatches } from "./riot/fetchMatches.ts";
import { saveMatch, matchExists } from "./db/matches.ts";
import "dotenv/config";

const key = process.env.RIOT_API_KEY;

if (!key) {
    throw new Error("RIOT_API_KEY is not set in the environment variables.");
}

// const puuid = "sPrfdIyGMwRf2tnwRj95c7puxWQac-gXnBI87uLM5HXO51_ROtXPTLmr3Bwr4NK5IByqvU4iwz8v-w";
// db.prepare(`SELECT * FROM match_participants WHERE puuid = ?`).all(puuid).forEach((row: any) => {
//     console.log(`Match ID: ${row.match_id}, Champion: ${row.champion_name}, K/D/A: ${row.kills}/${row.deaths}/${row.assists}`);
// });

// db.close();

// I GOT DATA IN THIS BITCH