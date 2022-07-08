import express from "express";
import { JobOfferController } from "./recruitment/controller/JobOfferController";
import { QuizController } from "./recruitment/controller/QuizController";
import { UserApplicationController } from "./recruitment/controller/UserApplicationController";
import { AuthController } from "./ums/Controllers/AuthController";
import { CompanyController } from "./ums/Controllers/CompanyController";
import { routeFromController } from "./utils/Helpers";
const routes = express.Router();

routes.use("/auth", routeFromController(new AuthController()));
routes.use("/company", routeFromController(new CompanyController()));

routes.use("/quiz", routeFromController(new QuizController()));
routes.use("/jobOffer", routeFromController(new JobOfferController()));
routes.use("/userApplication", routeFromController(new UserApplicationController()));

export default routes;
