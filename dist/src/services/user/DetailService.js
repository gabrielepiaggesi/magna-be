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
const index_1 = require("../../integration/middleware/index");
const UserRepository_1 = require("../../repositories/user/UserRepository");
const Logger_1 = require("../../utils/Logger");
const DetailRepository_1 = require("../../repositories/user/DetailRepository");
const DetailType_1 = require("../../enums/user/DetailType");
const LOG = new Logger_1.Logger("DetailService.class");
const userRepository = new UserRepository_1.UserRepository();
const detailRepository = new DetailRepository_1.DetailRepository();
class DetailService {
    getBio(res) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedId = index_1.auth.loggedId;
            const detail = yield detailRepository.findByType(DetailType_1.DetailType.BIO, loggedId);
            LOG.debug("detail getBio", detail[0] || null);
            return res.status(200).send(detail[0] || null);
        });
    }
    getNow(res) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedId = index_1.auth.loggedId;
            const detail = yield detailRepository.findByType(DetailType_1.DetailType.NOW, loggedId);
            LOG.debug("detail getNow", detail[0] || null);
            return res.status(200).send(detail[0] || null);
        });
    }
    getJobs(res) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedId = index_1.auth.loggedId;
            const detail = yield detailRepository.findByType(DetailType_1.DetailType.JOB, loggedId);
            LOG.debug("detail getJobs", detail.length);
            return res.status(200).send(detail);
        });
    }
    getEducations(res) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedId = index_1.auth.loggedId;
            const detail = yield detailRepository.findByType(DetailType_1.DetailType.EDUCATION, loggedId);
            LOG.debug("detail getEducations", detail.length);
            return res.status(200).send(detail);
        });
    }
    getLinks(res) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedId = index_1.auth.loggedId;
            const detail = yield detailRepository.findByType(DetailType_1.DetailType.LINK, loggedId);
            LOG.debug("detail getLinks", detail.length);
            return res.status(200).send(detail);
        });
    }
    getNameAndLastName(res) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedId = index_1.auth.loggedId;
            const detail = yield detailRepository.findByType(DetailType_1.DetailType.NAME_LASTNAME, loggedId);
            LOG.debug("detail getNameAndLastName", detail[0] || null);
            return res.status(200).send(detail[0] || null);
        });
    }
    getImage(res) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedId = index_1.auth.loggedId;
            const detail = yield detailRepository.findByType(DetailType_1.DetailType.IMAGE, loggedId);
            LOG.debug("detail getImage", detail[0] || null);
            return res.status(200).send(detail[0] || null);
        });
    }
}
exports.DetailService = DetailService;
//# sourceMappingURL=DetailService.js.map