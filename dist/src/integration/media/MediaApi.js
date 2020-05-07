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
const MediaService_1 = require("../../services/media/MediaService");
const index_1 = require("../middleware/index");
const multer_1 = __importStar(require("multer"));
const mediaRoutes = express_1.default.Router();
const multerConfig = {
    storage: multer_1.memoryStorage(),
    limits: {
        fileSize: 2 * 1024 * 1024 // no larger than 5mb, you can change as needed.
    }
};
// services
const mediaService = new MediaService_1.MediaService();
// <form action="/upload" method="post" enctype="multipart/form-data">
//   <input type="file" name="avatar" />
// </form>
// routes
mediaRoutes.post("/upload", index_1.auth.isUser, multer_1.default(multerConfig).single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () { return yield mediaService.uploadMedia(res, req); }));
exports.default = mediaRoutes;
//# sourceMappingURL=MediaApi.js.map