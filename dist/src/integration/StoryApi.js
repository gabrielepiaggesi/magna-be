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
const index_1 = require("./middleware/index");
const StoryService_1 = require("../services/StoryService");
const storyRoutes = express_1.default.Router();
// services
const storyService = new StoryService_1.StoryService();
// routes
storyRoutes.post("/create", index_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield storyService.createStory(res, req.body); }));
storyRoutes.post("/edit", index_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield storyService.editStory(res, req.body); }));
storyRoutes.delete("/:id", index_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield storyService.deleteStory(res, parseInt(req.params.id, 10)); }));
storyRoutes.get("/:id", index_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield storyService.getStory(res, parseInt(req.params.id, 10)); }));
storyRoutes.get("/feed/:id", index_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield storyService.getStoriesList(res, parseInt(req.params.id, 10)); }));
storyRoutes.post("/like/:id", index_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield storyService.likeStory(res, parseInt(req.params.id, 10)); }));
storyRoutes.delete("/dislike/:likeId", index_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield storyService.dislikeStory(res, parseInt(req.params.likeId, 10)); }));
storyRoutes.post("/save/:id", index_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield storyService.saveStory(res, parseInt(req.params.id, 10)); }));
storyRoutes.delete("/unsave/:saveId", index_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield storyService.unsaveStory(res, parseInt(req.params.saveId, 10)); }));
exports.default = storyRoutes;
//# sourceMappingURL=StoryApi.js.map