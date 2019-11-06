import express from "express";
import authRoutes from "./AuthApi";
import creatorRoutes from "./CreatorApi";
import stockRoutes from "./StockApi";
import userRoutes from "./UserApi";
const routes = express.Router();

routes.use("/auth", authRoutes);
routes.use("/users", userRoutes);
routes.use("/stocks", stockRoutes);
routes.use("/creators", creatorRoutes);

export default routes;
