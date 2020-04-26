import express from "express";
import authRoutes from "./AuthApi";
import userRoutes from "./user/UserApi";
import financialRoutes from "./financial/FinancialApi";
import detailRoutes from "./user/DetailApi";
import mediaRoutes from "./media/MediaApi";
const routes = express.Router();

routes.use("/auth", authRoutes);
routes.use("/user", userRoutes);
routes.use("/detail", detailRoutes);
routes.use("/media", mediaRoutes);
routes.use("/financial", financialRoutes);

export default routes;
