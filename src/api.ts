import express from "express";
import { ExamController } from "./recruitment/controller/ExamController";
import { auth } from ".";
import { JobOfferController } from "./recruitment/controller/JobOfferController";
import { QuizController } from "./recruitment/controller/QuizController";
import { UserApplicationController } from "./recruitment/controller/UserApplicationController";
import { AuthController } from "./ums/Controllers/AuthController";
import { CompanyController } from "./ums/Controllers/CompanyController";
import { routeFromController } from "./utils/Helpers";
import { ExamApplicationController } from "./recruitment/controller/ExamApplicationController";
const routes = express.Router();

routes.use("/auth", routeFromController(new AuthController()));
routes.use("/company", auth.isUser, routeFromController(new CompanyController()));

routes.use("/quiz", auth.isUser, routeFromController(new QuizController()));
routes.use("/jobOffer", routeFromController(new JobOfferController()));
routes.use("/exam", routeFromController(new ExamController()));
routes.use("/userApplication/job", auth.isUser, routeFromController(new UserApplicationController()));
routes.use("/userApplication/exam", auth.isUser, routeFromController(new ExamApplicationController()));

export default routes;
