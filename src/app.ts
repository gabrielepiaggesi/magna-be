// imports
import bodyParser from "body-parser";
import express from "express";
import { db } from "./connection";
import api from "./integration/api";
import { initMiddlewares } from "./integration/middleware/index";

// initialize
const app = express();
const port = process.env.PORT || 3000;

// db.connect();
initMiddlewares(app);

app.use(bodyParser.json());
app.use(api);

// start server
app.listen(port, () => {
  return console.log(`server listen on ${port}`);
});
