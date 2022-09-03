// imports
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import api from "./api";
import { initMiddlewares } from ".";
import { initJobs } from "./cron";

process.env['SENDINBLUE_API_KEY'] = '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';

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ', err);
});

// initialize
const app = express();
const port = process.env.PORT || 8000;

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
