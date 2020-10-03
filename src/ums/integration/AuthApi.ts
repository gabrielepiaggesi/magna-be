import express from "express";
import { AuthService } from "../services/AuthService";
const authRoutes = express.Router();

// services
const authService = new AuthService();

// routes
authRoutes.post("/login", async (req, res) => await authService.login(res, req.body));
authRoutes.post("/preorder", async (req, res) => await authService.preorder(res, req.body));
authRoutes.post("/signup", async (req, res) => await authService.signup(res, req.body));
authRoutes.post("/business", async (req, res) => await authService.signupBusiness(res, req.body));

export default authRoutes;
