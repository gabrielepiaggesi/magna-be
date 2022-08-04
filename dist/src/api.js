"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const JobOfferController_1 = require("./recruitment/controller/JobOfferController");
const QuizController_1 = require("./recruitment/controller/QuizController");
const UserApplicationController_1 = require("./recruitment/controller/UserApplicationController");
const AuthController_1 = require("./ums/Controllers/AuthController");
const CompanyController_1 = require("./ums/Controllers/CompanyController");
const Helpers_1 = require("./utils/Helpers");
const routes = express_1.default.Router();
routes.use("/auth", Helpers_1.routeFromController(new AuthController_1.AuthController()));
routes.use("/company", Helpers_1.routeFromController(new CompanyController_1.CompanyController()));
routes.use("/quiz", Helpers_1.routeFromController(new QuizController_1.QuizController()));
routes.use("/jobOffer", Helpers_1.routeFromController(new JobOfferController_1.JobOfferController()));
routes.use("/userApplication", Helpers_1.routeFromController(new UserApplicationController_1.UserApplicationController()));
exports.default = routes;
//# sourceMappingURL=api.js.map