import express from "express";
import { auth } from "./middleware/index";
import { StoryService } from "../services/StoryService";
const storyRoutes = express.Router();

// services
const storyService = new StoryService();

// routes
storyRoutes.post("/create", auth.isUser, async (req, res) => await storyService.createStory(res, req.body));
storyRoutes.post("/edit", auth.isUser, async (req, res) => await storyService.editStory(res, req.body));
storyRoutes.delete("/:id", auth.isUser, async (req, res) => await storyService.deleteStory(res, parseInt(req.params.id, 10)));
storyRoutes.get("/:id", auth.isUser, async (req, res) => await storyService.getStory(res, parseInt(req.params.id, 10)));
storyRoutes.get("/feed/:id", auth.isUser, async (req, res) => await storyService.getStoriesList(res, parseInt(req.params.id, 10)));

export default storyRoutes;
