import express from "express";
import { auth } from "../middleware/index";
import { BusinessService } from "../../services/business/BusinessService";
const userRoutes = express.Router();

// services
const userService = new BusinessService();

// routes
userRoutes.get("/me", auth.isUser, async (req, res) => await userService.getLoggedBusiness(res));
userRoutes.post("/me", auth.isUser, async (req, res) => await userService.updateBusiness(res, req.body));
userRoutes.get("/:businessId", async (req, res) => await userService.getBusiness(res, parseInt(req.params.businessId, 10)));

export default userRoutes;
