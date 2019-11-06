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
const CreatorService_1 = require("../services/CreatorService");
const creatorRoutes = express_1.default.Router();
// services
const creatorService = new CreatorService_1.CreatorService();
// routes
creatorRoutes.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield creatorService.getCreator(res, parseInt(req.params.id, 10)); }));
exports.default = creatorRoutes;
//# sourceMappingURL=CreatorApi.js.map