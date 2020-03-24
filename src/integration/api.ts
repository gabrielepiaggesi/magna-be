import express from "express";
import authRoutes from "./AuthApi";
import userRoutes from "./UserApi";
import storyRoutes from "./StoryApi";
import insightRoutes from "./InsightApi";
const routes = express.Router();

routes.use("/auth", authRoutes);
routes.use("/users", userRoutes);
routes.use("/stories", storyRoutes);
routes.use("/insights", insightRoutes);

export default routes;
