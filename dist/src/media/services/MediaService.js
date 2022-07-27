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
const Logger_1 = require("../../framework/services/Logger");
const StorageService_1 = require("./StorageService");
const LOG = new Logger_1.Logger("MediaService.class");
const uploadService = new StorageService_1.StorageService();
class MediaService {
    uploadFile(dto, conn) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!conn) {
                throw "Connection error!";
            }
            ;
            try {
                const obj = {
                    file: dto.file,
                    user_id: dto.user_id,
                    type: (dto.file.mimetype || dto.file.mimeType || dto.file.type) || 'unknown'
                };
                const url = yield uploadService.uploadMedia(obj, conn);
                return url;
            }
            catch (e) {
                throw e;
            }
        });
    }
    uploadPostMedia(req, conn) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!conn) {
                throw "Connection error!";
            }
            try {
                const obj = {
                    file: req.file,
                    user_id: req.user_id,
                    type: 'post'
                };
                const url = yield uploadService.uploadMedia(obj, conn);
                return url;
            }
            catch (e) {
                throw e;
            }
        });
    }
}
exports.MediaService = MediaService;
//# sourceMappingURL=MediaService.js.map