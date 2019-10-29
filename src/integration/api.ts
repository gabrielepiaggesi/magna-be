import express from "express";
import authRoutes from "./AuthApi";
import stockRoutes from "./StockApi";
import userRoutes from "./UserApi";
const routes = express.Router();

routes.use("/auth", authRoutes);
routes.use("/users", userRoutes);
routes.use("/stocks", stockRoutes);

export default routes;
