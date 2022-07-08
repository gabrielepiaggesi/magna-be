"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../../framework/integrations/middleware");
const UserApplicationController_1 = require("../controller/UserApplicationController");
const userApplicationRoute = express_1.default.Router();
// services
const userApplicationController = new UserApplicationController_1.UserApplicationController();
// routes
userApplicationRoute.post("/createUserApplication", middleware_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield userApplicationController.createUserApplication(res, req); }));
userApplicationRoute.post("/createUserQuiz", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield userApplicationController.createUserQuiz(res, req); }));
userApplicationRoute.post("/createUserTest", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield userApplicationController.createUserTest(res, req); }));
userApplicationRoute.post("/updateUserTest/:userTestId", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield userApplicationController.updateUserTest(res, req); }));
userApplicationRoute.post("/confirmAndSendUserQuiz/:userQuizId", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield userApplicationController.confirmAndSendUserQuiz(res, req); }));
userApplicationRoute.get("/getUserApplication/:userId/:jobOfferId", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield userApplicationController.getUserApplication(res, req); }));
userApplicationRoute.get("/getUserQuiz/:quizId/:jobOfferId", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield userApplicationController.getUserQuiz(res, req); }));
exports.default = userApplicationRoute;
//# sourceMappingURL=UserApplicationRoute.js.map