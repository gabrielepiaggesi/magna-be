import express from "express";
import { FinancialService } from "../service/FinancialService";
import { WebHookService } from "../service/WebHookService";
import { auth } from "../../framework/integrations/middleware";
const financialRoutes = express.Router();

// services
const financialService = new FinancialService();
const webHookService = new WebHookService();

// routes
financialRoutes.get("/subscription/:planId", auth.isUser, async (req, res) => await financialService.getUserSubScription(res, req, req.params.planId));
financialRoutes.get("/transactions", auth.isUser, async (req, res) => await financialService.getUserTransactions(res, req));
financialRoutes.get("/cards", auth.isUser, async (req, res) => await financialService.getUserCards(res, req));
financialRoutes.post("/pay", auth.isUser, async (req, res) => await financialService.payUserSubScription(res, req));
financialRoutes.post("/subscription/cancel/:subId", async (req, res) => await financialService.cancelSubScription(res, req.params.subId));

// webhook
financialRoutes.post("/webhook/subscription", async (req, res) => await webHookService.updateSubScriptionWH(res, req.body));

export default financialRoutes;
