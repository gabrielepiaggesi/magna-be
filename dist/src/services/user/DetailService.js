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
const Detail_1 = require("../../models/user/Detail");
const database_1 = require("../../database");
const LOG = new Logger_1.Logger("DetailService.class");
const userRepository = new UserRepository_1.UserRepository();
const detailRepository = new DetailRepository_1.DetailRepository();
const db = new database_1.Database();
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
    updateBio(res, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db.newTransaction();
            try {
                const loggedId = index_1.auth.loggedId;
                let detail;
                let detailInserted;
                if (obj.detail_id) {
                    detail = yield detailRepository.findById(obj.detail_id);
                    detail.user_id = loggedId;
                    detail.type = DetailType_1.DetailType.BIO;
                    detail.text1 = obj.text1;
                    detailInserted = yield detailRepository.update(detail);
                }
                else {
                    detail = new Detail_1.Detail();
                    detail.user_id = loggedId;
                    detail.type = DetailType_1.DetailType.BIO;
                    detail.text1 = obj.text1;
                    detailInserted = yield detailRepository.save(detail);
                }
                LOG.debug("updateBio success", detailInserted);
                return res.status(200).send(detailInserted);
            }
            catch (e) {
                yield db.rollback();
                LOG.error("updateBio error", e);
                return res.status(500).send(e);
            }
        });
    }
    updateNow(res, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db.newTransaction();
            try {
                const loggedId = index_1.auth.loggedId;
                let detail;
                let detailInserted;
                if (obj.detail_id) {
                    detail = yield detailRepository.findById(obj.detail_id);
                    detail.user_id = loggedId;
                    detail.type = DetailType_1.DetailType.NOW;
                    detail.text1 = obj.text1;
                    detail.text2 = obj.text2;
                    detailInserted = yield detailRepository.update(detail);
                }
                else {
                    detail = new Detail_1.Detail();
                    detail.user_id = loggedId;
                    detail.type = DetailType_1.DetailType.BIO;
                    detail.text1 = obj.text1;
                    detail.text2 = obj.text2;
                    detailInserted = yield detailRepository.save(detail);
                }
                LOG.debug("updateBio success", detailInserted);
                return res.status(200).send(detailInserted);
            }
            catch (e) {
                yield db.rollback();
                LOG.error("updateBio error", e);
                return res.status(500).send(e);
            }
        });
    }
    updateNameLastName(res, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db.newTransaction();
            try {
                const loggedId = index_1.auth.loggedId;
                let detail;
                let detailInserted;
                if (obj.detail_id) {
                    detail = yield detailRepository.findById(obj.detail_id);
                    detail.user_id = loggedId;
                    detail.type = DetailType_1.DetailType.NAME_LASTNAME;
                    detail.text1 = obj.text1;
                    detailInserted = yield detailRepository.update(detail);
                }
                else {
                    detail = new Detail_1.Detail();
                    detail.user_id = loggedId;
                    detail.type = DetailType_1.DetailType.NAME_LASTNAME;
                    detail.text1 = obj.text1;
                    detailInserted = yield detailRepository.save(detail);
                }
                LOG.debug("updateBio success", detailInserted);
                return res.status(200).send(detailInserted);
            }
            catch (e) {
                yield db.rollback();
                LOG.error("updateBio error", e);
                return res.status(500).send(e);
            }
        });
    }
    updateLinks(res, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db.newTransaction();
            try {
                const loggedId = index_1.auth.loggedId;
                const items = obj.items;
                for (let i = 0; i <= items.length; i++) {
                    let item = items[i];
                    let detail;
                    if (item.detail_id) {
                        detail = yield detailRepository.findById(item.detail_id);
                        detail.user_id = loggedId;
                        detail.type = DetailType_1.DetailType.LINK;
                        detail.text1 = item.text1;
                        detail.text2 = item.text2;
                        detail.text3 = item.text3;
                        yield detailRepository.update(detail);
                    }
                    else {
                        detail = new Detail_1.Detail();
                        detail.user_id = loggedId;
                        detail.type = DetailType_1.DetailType.LINK;
                        detail.text1 = item.text1;
                        detail.text2 = item.text2;
                        detail.text3 = item.text3;
                        yield detailRepository.save(detail);
                    }
                }
                return res.status(200).send("success");
            }
            catch (e) {
                yield db.rollback();
                LOG.error("updateBio error", e);
                return res.status(500).send(e);
            }
        });
    }
    updateJobs(res, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db.newTransaction();
            try {
                const loggedId = index_1.auth.loggedId;
                const items = obj.items;
                for (let i = 0; i <= items.length; i++) {
                    let item = items[i];
                    let detail;
                    if (item.detail_id) {
                        detail = yield detailRepository.findById(item.detail_id);
                        detail.user_id = loggedId;
                        detail.type = DetailType_1.DetailType.JOB;
                        detail.text1 = item.text1;
                        detail.text2 = item.text2;
                        detail.start_date = item.start_date;
                        detail.end_date = item.end_date;
                        yield detailRepository.update(detail);
                    }
                    else {
                        detail = new Detail_1.Detail();
                        detail.user_id = loggedId;
                        detail.type = DetailType_1.DetailType.LINK;
                        detail.text1 = item.text1;
                        detail.text2 = item.text2;
                        detail.start_date = item.start_date;
                        detail.end_date = item.end_date;
                        yield detailRepository.save(detail);
                    }
                }
                return res.status(200).send("success");
            }
            catch (e) {
                yield db.rollback();
                LOG.error("updateBio error", e);
                return res.status(500).send(e);
            }
        });
    }
    updateEducations(res, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db.newTransaction();
            try {
                const loggedId = index_1.auth.loggedId;
                const items = obj.items;
                for (let i = 0; i <= items.length; i++) {
                    let item = items[i];
                    let detail;
                    if (item.detail_id) {
                        detail = yield detailRepository.findById(item.detail_id);
                        detail.user_id = loggedId;
                        detail.type = DetailType_1.DetailType.EDUCATION;
                        detail.text1 = item.text1;
                        detail.text2 = item.text2;
                        detail.start_date = item.start_date;
                        detail.end_date = item.end_date;
                        yield detailRepository.update(detail);
                    }
                    else {
                        detail = new Detail_1.Detail();
                        detail.user_id = loggedId;
                        detail.type = DetailType_1.DetailType.LINK;
                        detail.text1 = item.text1;
                        detail.text2 = item.text2;
                        detail.start_date = item.start_date;
                        detail.end_date = item.end_date;
                        yield detailRepository.save(detail);
                    }
                }
                return res.status(200).send("success");
            }
            catch (e) {
                yield db.rollback();
                LOG.error("updateBio error", e);
                return res.status(500).send(e);
            }
        });
    }
}
exports.DetailService = DetailService;
//# sourceMappingURL=DetailService.js.map