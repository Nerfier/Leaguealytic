import express from "express";
import { startJobs } from "./jobs/scheduler.ts"
import playersRouter from "./routes/players.ts"

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(express.static("web/dist"));
app.use("/api/players", playersRouter);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})

startJobs();