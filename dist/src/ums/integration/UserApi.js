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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../../framework/integrations/middleware");
const multer_1 = __importStar(require("multer"));
const UserService_1 = require("../service/UserService");
const userRoutes = express_1.default.Router();
const multerConfig = {
    storage: multer_1.memoryStorage(),
    limits: {
        fileSize: 2 * 1024 * 1024 // no larger than 5mb, you can change as needed.
    }
};
// services
const userService = new UserService_1.UserService();
// routes
userRoutes.get("/me", middleware_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield userService.getLoggedUser(res); }));
userRoutes.get("/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield userService.getUser(res, parseInt(req.params.userId, 10)); }));
userRoutes.get("/total/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield userService.getTotalUsers(res); }));
userRoutes.post("/me", middleware_1.auth.isUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield userService.updateAccountDetails(res, req.body); }));
userRoutes.post("/profileImage", middleware_1.auth.isUser, multer_1.default(multerConfig).single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield userService.updateProfileImage(res, req); }));
exports.default = userRoutes;
//# sourceMappingURL=UserApi.js.map