import express from "express";
import { auth } from "./middleware/index";
import { StoryService } from "../services/StoryService";
const stockRoutes = express.Router();

// services
const storyService = new StoryService();

// routes
stockRoutes.post("/create", auth.isUser, async (req, res) => await storyService.createStory(res, req.body));
stockRoutes.post("/edit", auth.isUser, async (req, res) => await storyService.editStory(res, req.body));
stockRoutes.delete("/:id", auth.isUser, async (req, res) => await storyService.deleteStory(res, parseInt(req.params.id, 10)));
stockRoutes.get("/:id", auth.isUser, async (req, res) => await storyService.getStory(res, parseInt(req.params.id, 10)));

export default stockRoutes;
