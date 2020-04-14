import express from "express";
import authRoutes from "./AuthApi";
import userRoutes from "./user/UserApi";
import financialRoutes from "./financial/FinancialApi";
const routes = express.Router();

routes.use("/auth", authRoutes);
routes.use("/user", userRoutes);
routes.use("/financial", financialRoutes);

export default routes;
