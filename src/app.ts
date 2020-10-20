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
app.use(function(req, res, next) {
  var authorization = req.headers.authorization.split(' ')[1],
  decoded;
  decoded = jwt.verify(authorization, jwtConfig.secretOrKey);
  var userId = decoded.id;
  res.locals.user = userId;
  next();
});

// start server
app.listen(port, () => {
  return console.log(`server listen on ${port}`);
});
