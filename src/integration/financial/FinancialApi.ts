import express from "express";
import { auth } from "../middleware/index";
import { FinancialService } from "../../services/financial/FinancialService";
const storyRoutes = express.Router();

// services
const financialService = new FinancialService();

// routes
storyRoutes.post("/pay", auth.isUser, async (req, res) => await financialService.trySubScription(res, req.body));
storyRoutes.post("/updateSubScription", async (req, res) => await financialService.updateSubScription(req.body));

export default storyRoutes;
