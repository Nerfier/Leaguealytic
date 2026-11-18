import { Router } from "express";
import { findPlayer, getAllPlayers, getPlayersLike } from "../db/players.ts";
import { getSummary, getChampionStats } from "../db/stats.ts"
import { getComboStats } from "../db/combos.ts";
import { getRecentMatches } from "../db/matches.ts";

const router = Router();

router.get("/", (req, res) => {
    res.json(getAllPlayers());
});

router.get("/suggest", (req, res) => {
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
    if (q.length < 2) { res.json([]); return; }

    const playerSuggestions = getPlayersLike(q);
    if (!playerSuggestions || playerSuggestions.length === 0) { res.status(404).json({ error: "No matching players"}); return; }
    res.set("Cache-Control", "no-store");
    res.json(playerSuggestions);
});

router.get("/lookup/:name/:tag", (req, res) => {
    const player = findPlayer({ name: req.params.name, tag: req.params.tag});
    if (!player) { res.status(404).json({ error: "Player not tracked "}); return; }
    res.json(player);
});

router.get("/:puuid/summary", (req, res) => {
    const summary = getSummary(req.params.puuid);
    if (!summary) {
        res.status(404).json({ error: "No data for this player" });
        return;
    }
    res.json(summary);
});

router.get("/:puuid/champions", (req, res) => {
    res.json(getChampionStats(req.params.puuid));
});

router.get("/:puuid/matches", (req, res) => {
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const offset = Math.max(Number(req.query.offset) || 0, 0);
    const queue = String(req.query.queue) || null;
    res.json(getRecentMatches(req.params.puuid, limit, offset, queue));
});

router.get("/:puuid/combos/:champion", (req, res) => {
    res.json(getComboStats({ champion: req.params.champion, puuid: req.params.puuid, queueId: 420}));
});


export default router;