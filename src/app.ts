// imports
import bodyParser from "body-parser";
import cors from "cors";
import jwt from "jsonwebtoken";
import express from "express";
import api from "./framework/integrations/api";
import { initMiddlewares } from "./framework/integrations/middleware";
import { jwtConfig } from "../environment/dev/jwt";
import { initJobs } from "./cron";

// initialize
const app = express();
const port = process.env.PORT || 3000;

// db.connect();
initMiddlewares(app);
// startConnection();

// init all crons/jobs
initJobs(app);

app.use(cors());
app.use(bodyParser.json());
app.use(api);

// start server
app.listen(port, () => {
  return console.log(`server listen on ${port}`);
});
