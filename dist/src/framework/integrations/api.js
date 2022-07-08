"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const JobOfferRoute_1 = __importDefault(require("../../recruitment/integration/JobOfferRoute"));
const QuizRoute_1 = __importDefault(require("../../recruitment/integration/QuizRoute"));
const UserApplicationRoute_1 = __importDefault(require("../../recruitment/integration/UserApplicationRoute"));
const AuthApi_1 = require("../../ums/integration/AuthApi");
const UserApi_1 = __importDefault(require("../../ums/integration/UserApi"));
const routes = express_1.default.Router();
routes.use("/auth", AuthApi_1.authRoutes);
routes.use("/user", UserApi_1.default);
routes.use("/quiz", QuizRoute_1.default);
routes.use("/jobOffer", JobOfferRoute_1.default);
routes.use("/userApplication", UserApplicationRoute_1.default);
exports.default = routes;
//# sourceMappingURL=api.js.map