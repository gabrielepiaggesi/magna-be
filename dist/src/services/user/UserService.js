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
const User_1 = require("../../models/user/User");
const UserRepository_1 = require("../../repositories/user/UserRepository");
const Logger_1 = require("../../utils/Logger");
const Detail_1 = require("../../models/user/Detail");
const DetailRepository_1 = require("../../repositories/user/DetailRepository");
const database_1 = require("../../database");
const LOG = new Logger_1.Logger("UserService.class");
const userRepository = new UserRepository_1.UserRepository();
const detailRepository = new DetailRepository_1.DetailRepository();
const db = new database_1.Database();
class UserService {
    getUsers(res) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield userRepository.findAll();
            LOG.debug("users", users);
            return res.status(200).send(users);
        });
    }
    getUser(res, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userRepository.findById(userId);
            delete user.password;
            LOG.debug("user", user);
            return res.status(200).send(user);
        });
    }
    getLoggedUser(res) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedId = index_1.auth.loggedId;
            const user = yield userRepository.findById(loggedId);
            delete user.password;
            LOG.debug("user", user);
            return res.status(200).send(user);
        });
    }
    createUser(res, user) {
        return __awaiter(this, void 0, void 0, function* () {
            LOG.debug("userDTO", user);
            const newUser = new User_1.User();
            newUser.email = user.email;
            newUser.lang = 'it';
            const userInserted = yield userRepository.save(newUser);
            LOG.debug("newUserId ", userInserted.insertId);
            return res.status(200).send(userInserted);
        });
    }
    updateUser(res, userDto) {
        return __awaiter(this, void 0, void 0, function* () {
            LOG.debug("userDTO", userDto);
            const user = yield userRepository.findById(userDto.id);
            user.email = userDto.email;
            const userUpdated = yield userRepository.update(user);
            LOG.debug("userUpdated ", userUpdated);
            return res.status(200).send(userUpdated);
        });
    }
    saveEmail(res, body) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db.newTransaction();
            try {
                const detail = new Detail_1.Detail();
                detail.user_id = 0;
                detail.type = "SAVE";
                detail.text1 = body.email;
                const detailInserted = yield detailRepository.save(detail);
                yield db.commit();
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
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map