import express from "express";
import { UserService } from "../services/UserService";
import { auth } from "./middleware/index";
const userRoutes = express.Router();

// services
const userService = new UserService();

// routes
userRoutes.get("/", auth.isUser, async (req, res) => await userService.getUsers(res));
userRoutes.get("/:id", auth.isUser, async (req, res) => await userService.getUser(res, parseInt(req.params.id, 10)));
userRoutes.post("/create", auth.isUser, async (req, res) => await userService.createUser(res, req.body));

export default userRoutes;
