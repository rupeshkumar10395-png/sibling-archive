import "./load-env.js";
import path from "path";

import express from "express";
import cors from "cors";
import { archiveRouter } from "./routes/archive.routes.js";
import { memoryRouter } from "./routes/memory.routes.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/archives", archiveRouter);
app.use("/v1/archives", archiveRouter);
app.use("/", memoryRouter);

const port = Number(process.env.API_PORT ?? 4000);
app.listen(port, () => console.log(`Sibling Archive API listening on :${port}`));

export { app };
