import express from "express";
import { StockService } from "../services/StockService";
import { auth } from "./middleware/index";
const stockRoutes = express.Router();

// services
const stockService = new StockService();

// routes
stockRoutes.post("/preorder", auth.isUser, async (req, res) => await stockService.preorderStocks(res, req.body));
stockRoutes.post("/confirm", auth.isUser, async (req, res) => await stockService.confirmStocks(res, req.body));
stockRoutes.post("/sell", auth.isUser, async (req, res) => await stockService.sellStocks(res, req.body));
stockRoutes.post("/reset", auth.isUser, async (req, res) => await stockService.resetStocks(res, req.body));

export default stockRoutes;
