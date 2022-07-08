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
const QuizController_1 = require("../controller/QuizController");
const quizRoute = express_1.default.Router();
// services
const quizController = new QuizController_1.QuizController();
// routes
quizRoute.post("/createQuiz", middleware_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield quizController.createQuiz(res, req); }));
quizRoute.post("/updateQuiz", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield quizController.updateQuiz(res, req); }));
quizRoute.post("/createTest", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield quizController.createTest(res, req); }));
quizRoute.post("/updateTest/:testId", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield quizController.updateTest(res, req); }));
quizRoute.post("/editTestOption/:optionId", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield quizController.editTestOption(res, req); }));
quizRoute.post("/removeTestOption/:optionId", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield quizController.removeTestOption(res, req); }));
quizRoute.post("/editTestText/:textId", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield quizController.editTestText(res, req); }));
quizRoute.post("/removeTestText/:textId", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield quizController.removeTestText(res, req); }));
quizRoute.post("/createNewTestImage/:testId", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield quizController.createNewTestImage(res, req); }));
quizRoute.post("/removeTestImage/:imageId", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield quizController.removeTestImage(res, req); }));
quizRoute.post("/getTest/:testId", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield quizController.getTest(res, req); }));
quizRoute.get("/getQuiz/:quizId", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield quizController.getQuiz(res, req); }));
exports.default = quizRoute;
//# sourceMappingURL=QuizRoute.js.map