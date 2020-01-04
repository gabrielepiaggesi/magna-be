import express from "express";
import authRoutes from "./AuthApi";
import userRoutes from "./UserApi";
import storyRoutes from "./StoryApi";
const routes = express.Router();

routes.use("/auth", authRoutes);
routes.use("/users", userRoutes);
routes.use("/stories", storyRoutes);

export default routes;
