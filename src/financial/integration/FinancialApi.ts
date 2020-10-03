import express from "express";
import { FinancialService } from "../service/FinancialService";
import { WebHookService } from "../service/WebHookService";
import { auth } from "../../framework/integrations/middleware";
const storyRoutes = express.Router();

// services
const financialService = new FinancialService();
const webHookService = new WebHookService();

// routes
storyRoutes.get("/subscription/:planId", auth.isUser, async (req, res) => await financialService.getUserSubScription(res, req.params.planId));
storyRoutes.get("/transactions", auth.isUser, async (req, res) => await financialService.getUserTransactions(res));
storyRoutes.get("/cards", auth.isUser, async (req, res) => await financialService.getUserCards(res));
storyRoutes.post("/pay", auth.isUser, async (req, res) => await financialService.payUserSubScription(res, req.body));

// webhook
storyRoutes.post("/webhook/subscription", async (req, res) => await webHookService.updateSubScriptionWH(res, req.body));

export default storyRoutes;
