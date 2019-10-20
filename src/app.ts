// imports
import bodyParser from "body-parser";
import express from "express";
import { connect } from "./connection";
import { UserService } from "./services/UserService";

// initialize
const app = express();
const port = 3000;
connect();
app.use(bodyParser.json());

// services
const userService = new UserService();

// routes
app.get("/users", async (req, res) => await userService.getUsers(res));
app.get("/users/:id", async (req, res) => await userService.getUser(res, parseInt(req.params.id, 10)));
app.post("/users/create", async (req, res) => await userService.createUser(res, req.body));

// start server
app.listen(port, (err) => {
  if (err) { return console.error(err); }
  return console.log(`server listen on ${port}`);
});
