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
const index_1 = require("../middleware/index");
const FinancialService_1 = require("../../services/financial/FinancialService");
const WebHookService_1 = require("../../services/financial/WebHookService");
const storyRoutes = express_1.default.Router();
// services
const financialService = new FinancialService_1.FinancialService();
const webHookService = new WebHookService_1.WebHookService();
// routes
storyRoutes.get("/subscription/:planId", index_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield financialService.getUserSubScription(res, req.params.planId); }));
storyRoutes.get("/transactions", index_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield financialService.getUserTransactions(res); }));
storyRoutes.get("/cards", index_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield financialService.getUserCards(res); }));
storyRoutes.post("/pay", index_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield financialService.payUserSubScription(res, req.body); }));
// webhook
storyRoutes.post("/webhook/subscription", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield webHookService.updateSubScriptionWH(res, req.body); }));
exports.default = storyRoutes;
//# sourceMappingURL=FinancialApi.js.map