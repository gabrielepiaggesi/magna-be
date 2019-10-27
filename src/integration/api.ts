import express from "express";
import authRoutes from "./AuthApi";
import userRoutes from "./UserApi";
const routes = express.Router();

routes.use("/users", userRoutes);
routes.use("/auth", authRoutes);

export default routes;
