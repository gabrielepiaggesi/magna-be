import express from "express";
import authRoutes from "../../ums/integrations/AuthApi";
import userRoutes from "../../ums/integrations/UserApi";
import relRoutes from "../../ums/integrations/ConnectionApi";
import networkRoutes from "../../network/integrations/FeedApi";
import financialRoutes from "../../financial/integrations/FinancialApi";
import retRoutes from "../../retention/integrations/RetentionApi";
const routes = express.Router();

routes.use("/auth", authRoutes);
routes.use("/user", userRoutes);
routes.use("/connection", relRoutes);
routes.use("/financial", financialRoutes);
routes.use("/network", networkRoutes);
routes.use("/retention", retRoutes);

export default routes;
