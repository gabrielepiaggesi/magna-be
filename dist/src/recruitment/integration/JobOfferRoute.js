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
const JobOfferController_1 = require("../controller/JobOfferController");
const jobOfferRoute = express_1.default.Router();
// services
const jobOfferController = new JobOfferController_1.JobOfferController();
// routes
jobOfferRoute.post("/createJobOffer", middleware_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield jobOfferController.createJobOffer(res, req); }));
jobOfferRoute.post("/updateJobOffer/:jobOfferId", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield jobOfferController.updateJobOffer(res, req); }));
jobOfferRoute.post("/editJobOfferSkill/:skillId", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield jobOfferController.editJobOfferSkill(res, req); }));
jobOfferRoute.post("/removeJobOfferSkill/:skillId", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield jobOfferController.removeJobOfferSkill(res, req); }));
jobOfferRoute.post("/setJobOfferUserData/:jobOfferId", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield jobOfferController.setJobOfferUserData(res, req); }));
jobOfferRoute.post("/addJobOfferUserData/:jobOfferId/:optionId", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield jobOfferController.addJobOfferUserData(res, req); }));
jobOfferRoute.post("/removejobOfferUserData/:jobOfferId/:optionId", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield jobOfferController.removejobOfferUserData(res, req); }));
jobOfferRoute.get("/getJobOffers/:companyId", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield jobOfferController.getJobOffers(res, req); }));
jobOfferRoute.get("/getJobOffer/:jobOfferId", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield jobOfferController.getJobOffer(res, req); }));
jobOfferRoute.get("/getJobOfferSkills/:jobOfferId", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield jobOfferController.getJobOfferSkills(res, req); }));
jobOfferRoute.get("/getUsersDataOptions", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield jobOfferController.getUsersDataOptions(res, req); }));
jobOfferRoute.get("/getJobOfferUserData/:jobOfferId", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield jobOfferController.getJobOfferUserData(res, req); }));
jobOfferRoute.get("/getJobOfferUserApplicationsList/:jobOfferId", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield jobOfferController.getJobOfferUserApplicationsList(res, req); }));
exports.default = jobOfferRoute;
//# sourceMappingURL=JobOfferRoute.js.map