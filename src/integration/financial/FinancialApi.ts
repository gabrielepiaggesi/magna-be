import express from "express";
import { auth } from "../middleware/index";
import { FinancialService } from "../../services/financial/FinancialService";
import { WebHookService } from "../../services/financial/WebHookService";
const storyRoutes = express.Router();

// services
const financialService = new FinancialService();
const webHookService = new WebHookService();

// routes
storyRoutes.get("/subscription/:planId", auth.isUser, async (req, res) => await financialService.getUserSubScription(res, req.params.planId));
storyRoutes.post("/pay", auth.isUser, async (req, res) => await financialService.payUserSubScription(res, req.body));

// webhook
storyRoutes.post("/webhook/subscription", async (req, res) => await webHookService.updateSubScriptionWH(res, req.body));

export default storyRoutes;
