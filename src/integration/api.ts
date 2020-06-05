import express from "express";
import authRoutes from "./AuthApi";
import userRoutes from "./business/BusinessApi";
import financialRoutes from "./financial/FinancialApi";
import menuRoutes from "./menu/MenuApi";
const routes = express.Router();

routes.use("/auth", authRoutes);
routes.use("/menu", menuRoutes);
routes.use("/business", userRoutes);
routes.use("/financial", financialRoutes);

export default routes;
