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
const middleware_1 = require("../../framework/integrations/middleware");
const MediaService_1 = require("../../media/services/MediaService");
const UserRepository_1 = require("../repository/UserRepository");
const BlackList_1 = require("../model/BlackList");
const BlackListRepository_1 = require("../repository/BlackListRepository");
const UserStatus_1 = require("./classes/UserStatus");
const BlackListReason_1 = require("./classes/BlackListReason");
const UserSubStatus_1 = require("./classes/UserSubStatus");
const LOG = new Logger_1.Logger("UserService.class");
const userRepository = new UserRepository_1.UserRepository();
const blackRepository = new BlackListRepository_1.BlackListRepository();
const mediaService = new MediaService_1.MediaService();
const db = require("../../connection");
class UserService {
    getUser(res, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const user = yield userRepository.findById(userId, connection);
            delete user.password;
            const userFound = { email: user.email, image_url: user.image_url, user_id: user.id, bio: user.bio };
            LOG.debug("getUser", userFound.user_id);
            yield connection.release();
            return res.status(200).send(userFound);
        });
    }
    getLoggedUser(res) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const loggedId = middleware_1.auth.loggedId;
            const user = yield userRepository.findById(loggedId, connection);
            delete user.password;
            LOG.debug("getLoggedUser", user.id);
            yield connection.release();
            return res.status(200).send(user);
        });
    }
    getTotalUsers(res) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const num = yield userRepository.findTotalUsers(connection);
            yield connection.release();
            return res.status(200).send(num);
        });
    }
    updateAccountDetails(res, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!obj.age || obj.age < 18)
                return res.status(500).send("Error, age not valid!");
            const connection = yield db.connection();
            yield connection.newTransaction();
            try {
                let user = yield userRepository.findById(obj.id, connection);
                user.age = obj.age;
                user.bio = obj.bio;
                user.whatsapp = obj.whatsapp;
                user.telegram = obj.telegram;
                const id = yield userRepository.update(user, connection);
                yield connection.commit();
                yield connection.release();
                delete user.password;
                LOG.debug("updateNameAndLastName", user.id);
                return res.status(200).send(user);
            }
            catch (e) {
                yield connection.rollback();
                yield connection.release();
                LOG.error("update user error", e);
                return res.status(500).send(e);
            }
        });
    }
    updateProfileImage(res, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedId = middleware_1.auth.loggedId;
            if (file && file.size && (file.size > (1 * 1024 * 1024))) { // > 1MB
                return res.status(500).send("Immagine troppo pesante, cambiala");
            }
            const connection = yield db.connection();
            yield connection.newTransaction();
            LOG.debug("file 1", file.name);
            try {
                let user = yield userRepository.findById(loggedId, connection);
                let media = yield mediaService.uploadProfileMedia({ file, user_id: loggedId }, connection);
                user.image_url = media.url;
                const id = yield userRepository.update(user, connection);
                yield connection.commit();
                yield connection.release();
                delete user.password;
                LOG.debug("updateProfileImage", user.id);
                return res.status(200).send(user);
            }
            catch (e) {
                yield connection.rollback();
                yield connection.release();
                LOG.error("update user image error", e);
                return res.status(500).send(e);
            }
        });
    }
    blackListPublisher(res, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedId = middleware_1.auth.loggedId;
            console.log("new ad", obj);
            const connection = yield db.connection();
            const statusNotIn = [
                BlackListReason_1.BlackListReason.ASK_MONEY,
                BlackListReason_1.BlackListReason.FRAUD,
                BlackListReason_1.BlackListReason.DANGER
            ];
            yield connection.newTransaction();
            try {
                const countRep = yield blackRepository.countByReporterIdAndUserId(loggedId, obj.user_id, statusNotIn, connection);
                const countUniqRep = yield blackRepository.countByReporterId(loggedId, statusNotIn, connection);
                if (countRep > 5 || countUniqRep > 20) {
                    let user = yield userRepository.findById(loggedId, connection);
                    user.bad_report_times = user.bad_report_times + 1;
                    user.sub_status = UserSubStatus_1.UserSubStatus.BAD_REPORTER;
                    yield userRepository.update(user, connection);
                }
                else {
                    let report = new BlackList_1.BlackList();
                    report.user_id = obj.user_id;
                    report.ad_id = obj.ad_id;
                    report.reporter_id = loggedId;
                    report.reason = BlackListReason_1.BlackListReason[obj.reason] || null;
                    report.text = obj.text;
                    const postInserted = yield blackRepository.save(report, connection);
                    report.id = postInserted.insertId;
                    const countUs = yield blackRepository.countByUserId(obj.user_id, statusNotIn, connection);
                    if (countUs > 5) {
                        let user = yield userRepository.findById(obj.user_id, connection);
                        if (user.banned_times > 5) {
                            user.status = UserStatus_1.UserStatus.ENDED;
                        }
                        else if (user.suspended_times > 10) {
                            user.banned_times = user.banned_times + 1;
                            user.status = UserStatus_1.UserStatus.BANNED;
                        }
                        else {
                            user.suspended_times = user.suspended_times + 1;
                            user.status = UserStatus_1.UserStatus.SUSPENDED;
                        }
                        user.sub_status = UserSubStatus_1.UserSubStatus.BAD_PUBLISHER;
                        yield userRepository.update(user, connection);
                    }
                }
                yield connection.commit();
                yield connection.release();
                return res.status(200).send({ message: "done" });
            }
            catch (e) {
                yield connection.rollback();
                yield connection.release();
                LOG.error("blacklist error", e);
                return res.status(500).send({ message: e });
            }
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map