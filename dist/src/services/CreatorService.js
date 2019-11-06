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
const CreatorRepository_1 = require("../repositories/CreatorRepository");
const Logger_1 = require("../utils/Logger");
const LOG = new Logger_1.Logger("CreatorService.class");
const creatorRepository = new CreatorRepository_1.CreatorRepository();
class CreatorService {
    getCreator(res, creatorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const creator = yield creatorRepository.findById(creatorId);
            LOG.debug("creator", creator);
            return res.status(200).send(creator);
        });
    }
}
exports.CreatorService = CreatorService;
//# sourceMappingURL=CreatorService.js.map