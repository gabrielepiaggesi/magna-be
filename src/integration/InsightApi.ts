import express from "express";
import { UserService } from "../services/UserService";
import { InsightService } from "../services/InsightService";
const insightRoutes = express.Router();

// services
const insightService = new InsightService();

// routes
insightRoutes.get("/today/users", async (req, res) => await insightService.getTodayUsers(res));
insightRoutes.get("/today/stories", async (req, res) => await insightService.getTodayStories(res));

insightRoutes.get("/total/users", async (req, res) => await insightService.getTotalUsers(res));
insightRoutes.get("/total/stories", async (req, res) => await insightService.getTotalStories(res));

export default insightRoutes;
