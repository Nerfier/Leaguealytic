import { Router } from "express";
import { getAllPlayers } from "../db/players.ts";
import { getSummary, getChampionStats, getRecentMatches } from "../db/stats.ts"

const router = Router();

router.get("/", (req, res) => {
    res.json(getAllPlayers());
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
    res.json(getRecentMatches(req.params.puuid, limit, offset));
});

export default router;