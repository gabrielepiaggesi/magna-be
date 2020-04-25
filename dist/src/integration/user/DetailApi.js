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
const DetailService_1 = require("../../services/user/DetailService");
const detailRoutes = express_1.default.Router();
// services
const detailService = new DetailService_1.DetailService();
// routes
detailRoutes.get("/profile/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield detailService.getProfileInfo(res, req.params.username); }));
detailRoutes.get("/me/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield detailService.getProfileInfo(res, req.params.username, false); }));
detailRoutes.get("/bio", index_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield detailService.getBio(res); }));
detailRoutes.get("/now", index_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield detailService.getNow(res); }));
detailRoutes.get("/jobs", index_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield detailService.getJobs(res); }));
detailRoutes.get("/educations", index_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield detailService.getEducations(res); }));
detailRoutes.get("/nameLastname", index_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield detailService.getNameAndLastName(res); }));
detailRoutes.get("/links", index_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield detailService.getLinks(res); }));
detailRoutes.get("/image", index_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield detailService.getImage(res); }));
detailRoutes.post("/bio", index_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield detailService.updateBio(res, req.body); }));
detailRoutes.post("/now", index_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield detailService.updateNow(res, req.body); }));
detailRoutes.post("/jobs", index_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield detailService.updateJobs(res, req.body); }));
detailRoutes.post("/educations", index_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield detailService.updateEducations(res, req.body); }));
detailRoutes.post("/nameLastname", index_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield detailService.updateNameLastName(res, req.body); }));
detailRoutes.post("/links", index_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield detailService.updateLinks(res, req.body); }));
// detailRoutes.post("/image", auth.isUser, async (req, res) => await detailService.updateLinks(res, req.body));
exports.default = detailRoutes;
//# sourceMappingURL=DetailApi.js.map