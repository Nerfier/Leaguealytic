import { parseLaneMeta } from "../src/opgg/parse.js";
import { readFileSync } from "node:fs";

const versions = await (await fetch("https://ddragon.leagueoflegends.com/api/versions.json")).json();
const dd = await (await fetch(
  `https://ddragon.leagueoflegends.com/cdn/${versions[0]}/data/en_US/champion.json`
)).json();
const known = new Set(Object.keys(dd.data));

const rows = parseLaneMeta(readFileSync("scratch/opgg-text.txt", "utf8"));
console.log("rows:", rows.length);
console.log("unknown names:", [...new Set(rows.map((r) => r.championName))].filter((n) => !known.has(n)));