// imports
import bodyParser from "body-parser";
import express from "express";
import { connect } from "./connection";
import api from "./integration/api";
import { initMiddlewares } from "./integration/middleware/index";

// initialize
const app = express();
const port = 3000;

connect();
initMiddlewares(app);

app.use(bodyParser.json());
app.use("/", api);

// start server
app.listen(port, (err) => {
  if (err) { return console.error(err); }
  return console.log(`server listen on ${port}`);
});
