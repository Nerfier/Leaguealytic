import { Router } from "express";
import { getComboChampions, getCombos } from "../db/combos.ts";

const router = Router();

router.get("/champions", (req, res) => {
  res.json(getComboChampions());
});

router.get("/:champion", (req, res) => {
  res.json(getCombos(req.params.champion));
});

export default router;