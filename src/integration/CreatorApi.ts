import express from "express";
import { CreatorService } from "../services/CreatorService";
import { UserService } from "../services/UserService";
import { auth } from "./middleware/index";
const creatorRoutes = express.Router();

// services
const creatorService = new CreatorService();

// routes
creatorRoutes.get("/:id", async (req, res) => await creatorService.getCreator(res, parseInt(req.params.id, 10)));

export default creatorRoutes;
