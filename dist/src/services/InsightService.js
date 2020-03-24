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
Object.defineProperty(exports, "__esModule", { value: true });
const UserRepository_1 = require("../repositories/UserRepository");
const Logger_1 = require("../utils/Logger");
const StoryRepository_1 = require("../repositories/StoryRepository");
const LOG = new Logger_1.Logger("InsightService.class");
const userRepository = new UserRepository_1.UserRepository();
const storyRepository = new StoryRepository_1.StoryRepository();
class InsightService {
    getTodayUsers(res) {
        return __awaiter(this, void 0, void 0, function* () {
            const num = yield userRepository.findTodayUsers();
            return res.status(200).send(num);
        });
    }
    getTodayStories(res) {
        return __awaiter(this, void 0, void 0, function* () {
            const num = yield storyRepository.findTodayStories();
            return res.status(200).send(num);
        });
    }
    getTotalUsers(res) {
        return __awaiter(this, void 0, void 0, function* () {
            const num = yield userRepository.findTotalUsers();
            return res.status(200).send(num);
        });
    }
    getTotalStories(res) {
        return __awaiter(this, void 0, void 0, function* () {
            const num = yield storyRepository.findTotalStories();
            return res.status(200).send(num);
        });
    }
}
exports.InsightService = InsightService;
//# sourceMappingURL=InsightService.js.map