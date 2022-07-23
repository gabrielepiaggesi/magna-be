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
const __1 = require("../..");
const MediaService_1 = require("../../media/services/MediaService");
const UserRepository_1 = require("../repository/UserRepository");
const LOG = new Logger_1.Logger("UserService.class");
const userRepository = new UserRepository_1.UserRepository();
const mediaService = new MediaService_1.MediaService();
const db = require("../../connection");
class UserService {
    getUser(res, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const user = yield userRepository.findById(userId, connection);
            delete user.password;
            const userFound = { email: user.email, image_url: user.image_url, user_id: user.id, bio: user.description };
            LOG.debug("getUser", userFound.user_id);
            yield connection.release();
            return res.status(200).send(userFound);
        });
    }
    getLoggedUser(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const loggedId = __1.auth.getLoggedUserId(req);
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
                user.description = obj.description;
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
    updateProfileImage(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedId = __1.auth.getLoggedUserId(req);
            const file = req.file;
            if (file && file.size && (file.size > (3 * 1024 * 1024))) { // > 1MB
                return res.status(500).send("Immagine troppo pesante, cambiala");
            }
            const connection = yield db.connection();
            yield connection.newTransaction();
            LOG.debug("file 1", file.name);
            try {
                let user = yield userRepository.findById(loggedId, connection);
                let media = yield mediaService.uploadFile({ file, user_id: loggedId }, connection);
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
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map