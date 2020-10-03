import express from "express";
import authRoutes from "../../ums/integration/AuthApi";
import userRoutes from "../../ums/integration/UserApi";
import financialRoutes from "../../financial/integration/FinancialApi";
import networkRoutes from "../../network/integration/AdApi";
const routes = express.Router();

routes.use("/auth", authRoutes);
routes.use("/user", userRoutes);
routes.use("/financial", financialRoutes);
routes.use("/network", networkRoutes);

export default routes;
