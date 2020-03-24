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
const InsightService_1 = require("../services/InsightService");
const insightRoutes = express_1.default.Router();
// services
const insightService = new InsightService_1.InsightService();
// routes
insightRoutes.get("/today/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield insightService.getTodayUsers(res); }));
insightRoutes.get("/today/stories", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield insightService.getTodayStories(res); }));
insightRoutes.get("/total/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield insightService.getTotalUsers(res); }));
insightRoutes.get("/total/stories", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield insightService.getTotalStories(res); }));
exports.default = insightRoutes;
//# sourceMappingURL=InsightApi.js.map