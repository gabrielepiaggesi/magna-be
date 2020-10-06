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
const AdService_1 = require("../service/AdService");
const UserService_1 = require("../../ums/service/UserService");
const networkRoutes = express_1.default.Router();
// services
const adsService = new AdService_1.AdService();
const userService = new UserService_1.UserService();
// routes
networkRoutes.get("/feed/:lastPostId", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield adsService.getFeed(res, parseInt(req.params.lastPostId, 10), req.query); }));
networkRoutes.get("/my/:lastPostId", middleware_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield adsService.getMyAds(res, parseInt(req.params.lastPostId, 10)); }));
networkRoutes.get("/:postId", middleware_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield adsService.getAd(res, parseInt(req.params.postId, 10)); }));
networkRoutes.post("/delete/:postId", middleware_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield adsService.deleteAd(res, parseInt(req.params.postId, 10)); }));
networkRoutes.post("/push/:postId", middleware_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield adsService.pushAd(res, parseInt(req.params.postId, 10)); }));
networkRoutes.post("/feed", middleware_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield adsService.publishAd(res, req.body); }));
networkRoutes.post("/report", middleware_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield userService.blackListPublisher(res, req.body); }));
exports.default = networkRoutes;
//# sourceMappingURL=AdApi.js.map