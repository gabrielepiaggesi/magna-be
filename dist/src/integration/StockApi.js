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
const StockService_1 = require("../services/StockService");
const index_1 = require("./middleware/index");
const stockRoutes = express_1.default.Router();
// services
const stockService = new StockService_1.StockService();
// routes
stockRoutes.post("/preorder", index_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield stockService.preorderStocks(res, req.body); }));
stockRoutes.post("/confirm", index_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield stockService.confirmStocks(res, req.body); }));
stockRoutes.post("/sell", index_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield stockService.sellStocks(res, req.body); }));
stockRoutes.post("/reset", index_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield stockService.resetStocks(res, req.body); }));
exports.default = stockRoutes;
//# sourceMappingURL=StockApi.js.map