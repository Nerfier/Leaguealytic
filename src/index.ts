import express from "express";
import { startJobs } from "./jobs/scheduler.ts"
import playersRouter from "./routes/players.ts"
import combosRouter from "./routes/combos.ts";
import { syncMeta } from "./services/metaSync.ts";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(express.static("web/dist"));
app.use("/api/players", playersRouter);
app.use("/api/combos", combosRouter);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})

startJobs();