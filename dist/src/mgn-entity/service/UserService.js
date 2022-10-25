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
const Logger_1 = require("../../mgn-framework/services/Logger");
const UserFidelityCardRepository_1 = require("../../mgn-reward/repository/UserFidelityCardRepository");
const IndroError_1 = require("../../utils/IndroError");
const Preconditions_1 = require("../../utils/Preconditions");
const User_1 = require("../model/User");
const NotificationRepository_1 = require("../repository/NotificationRepository");
const UserRepository_1 = require("../repository/UserRepository");
const LOG = new Logger_1.Logger("CompanyService.class");
const db = require("../../connection");
const userRepository = new UserRepository_1.UserRepository();
const notificationRepository = new NotificationRepository_1.NotificationRepository();
const userFidelityCardRepository = new UserFidelityCardRepository_1.UserFidelityCardRepository();
class UserService {
    getLoggedUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const user = yield userRepository.findById(userId, connection);
            delete user.password;
            yield connection.release();
            return user;
        });
    }
    addUser(dto, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Preconditions_1.Precondition.checkIfFalse((!dto.name), "Incomplete Data");
            const connection = yield db.connection();
            yield connection.newTransaction();
            const newUser = yield this.updateOrCreateUser(dto, loggedUserId, connection);
            yield connection.commit();
            yield connection.release();
            return newUser;
        });
    }
    getUserNotifications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const userFidelityCards = yield userFidelityCardRepository.findActiveByUserIdJoinBusiness(userId, connection);
            const businessIds = userFidelityCards.map(c => c.business_id);
            const nots = yield notificationRepository.whereBusinessesIdsIn(businessIds, connection);
            yield connection.release();
            return nots;
        });
    }
    deleteUser(loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            yield connection.newTransaction();
            const business = yield this.removeUser(loggedUserId, connection);
            yield connection.commit();
            yield connection.release();
            return business;
        });
    }
    updateUser(dto, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            yield connection.newTransaction();
            const newUser = yield this.updateOrCreateUser(dto, loggedUserId, connection);
            yield connection.commit();
            yield connection.release();
            return newUser;
        });
    }
    getUser(businessId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const business = yield userRepository.findById(businessId, connection);
            yield Preconditions_1.Precondition.checkIfTrue((!!business), "Company does not exist", connection);
            yield connection.release();
            return business;
        });
    }
    updateOrCreateUser(newUserDTO, loggedUserId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            let newUser = new User_1.User();
            if (loggedUserId) {
                newUser = yield userRepository.findById(loggedUserId, connection);
                if (newUser && newUser.id != loggedUserId)
                    return null;
            }
            try {
                newUser.name = newUserDTO.name || newUser.name;
                newUser.status = loggedUserId ? newUser.status : 'ACTIVE';
                newUser.id = loggedUserId ? newUser.id : loggedUserId;
                const coInserted = loggedUserId ? yield userRepository.update(newUser, connection) : yield userRepository.save(newUser, connection);
                newUser.id = loggedUserId ? newUser.id : coInserted.insertId;
                !loggedUserId && LOG.info("NEW BUSINESS", newUser.id);
                return newUser;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Create BUSINESS", 500, null, e);
            }
        });
    }
    removeUser(loggedUserId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userRepository.findById(loggedUserId, connection);
            if (!user || user.id != loggedUserId)
                return user;
            try {
                yield userRepository.delete(user, connection);
                return user;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Delete User", 500, null, e);
            }
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map