import express from "express";
import { startJobs } from "./jobs/scheduler.ts"
import playersRouter from "./routes/players.ts"







startJobs();