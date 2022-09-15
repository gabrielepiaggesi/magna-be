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
const BusinessRepository_1 = require("../../mgn-entity/repository/BusinessRepository");
const Logger_1 = require("../../mgn-framework/services/Logger");
const IndroError_1 = require("../../utils/IndroError");
const UserFidelityCard_1 = require("../model/UserFidelityCard");
const BusinessFidelityCardRepository_1 = require("../repository/BusinessFidelityCardRepository");
const UserFidelityCardRepository_1 = require("../repository/UserFidelityCardRepository");
const LOG = new Logger_1.Logger("CompanyService.class");
const db = require("../../connection");
const userFidelityCardRepository = new UserFidelityCardRepository_1.UserFidelityCardRepository();
const businessFidelityCardRepository = new BusinessFidelityCardRepository_1.BusinessFidelityCardRepository();
const businessRepository = new BusinessRepository_1.BusinessRepository();
class UserFidelityCardService {
    addUserFidelityCard(dto, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            yield connection.newTransaction();
            const newUserFidelityCard = yield this.createUserFidelityCard(dto, userId, connection);
            yield connection.commit();
            yield connection.release();
            return newUserFidelityCard;
        });
    }
    updateUserFidelityCard(dto, userFidelityCardId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            yield connection.newTransaction();
            const newUserFidelityCard = yield this.setUserFidelityCard(dto, userFidelityCardId, connection);
            yield connection.commit();
            yield connection.release();
            return newUserFidelityCard;
        });
    }
    suspendUserFidelityCard(userFidelityCardId, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const userBusinesses = yield businessRepository.findByUserId(loggedUserId, connection);
            const businessesIds = userBusinesses.map(uB => uB.id);
            yield connection.newTransaction();
            const business = yield this.updateUserFidelityCardStatus('SUSPENDED', userFidelityCardId, businessesIds, connection);
            yield connection.commit();
            yield connection.release();
            return business;
        });
    }
    activateUserFidelityCard(userFidelityCardId, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const userBusinesses = yield businessRepository.findByUserId(loggedUserId, connection);
            const businessesIds = userBusinesses.map(uB => uB.id);
            yield connection.newTransaction();
            const business = yield this.updateUserFidelityCardStatus('ACTIVE', userFidelityCardId, businessesIds, connection);
            yield connection.commit();
            yield connection.release();
            return business;
        });
    }
    getUserFidelityCards(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const userFidelityCards = yield userFidelityCardRepository.findByUserId(userId, connection);
            yield connection.release();
            return userFidelityCards;
        });
    }
    getUserFidelityCard(userFidelityCardId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const userFidelityCard = yield userFidelityCardRepository.findById(userFidelityCardId, connection);
            yield connection.release();
            return userFidelityCard;
        });
    }
    deleteUserFidelityCard(userFidelityCardId, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            yield connection.newTransaction();
            const business = yield this.removeUserFidelityCard(userFidelityCardId, loggedUserId, connection);
            yield connection.commit();
            yield connection.release();
            return business;
        });
    }
    createUserFidelityCard(fidelityCardDTO, userId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const businessFidelityCard = yield businessFidelityCardRepository.findById(+fidelityCardDTO.fidelity_card_id, connection);
            if (!businessFidelityCard || businessFidelityCard.business_id != +fidelityCardDTO.businessId)
                return businessFidelityCard;
            try {
                const newFidelityCard = new UserFidelityCard_1.UserFidelityCard();
                newFidelityCard.business_id = +fidelityCardDTO.businessId;
                newFidelityCard.discount_id = +fidelityCardDTO.discount_id;
                newFidelityCard.fidelity_card_id = +fidelityCardDTO.fidelity_card_id;
                newFidelityCard.user_id = userId;
                newFidelityCard.status = 'ACTIVE';
                newFidelityCard.usage_amount = 0;
                newFidelityCard.discount_countdown = businessFidelityCard.expenses_amount;
                const coInserted = yield userFidelityCardRepository.save(newFidelityCard, connection);
                newFidelityCard.id = coInserted.insertId;
                LOG.info("NEW USER FIDELITY CARD", newFidelityCard.id);
                return newFidelityCard;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Create USER FIDELITY CARD", 500, null, e);
            }
        });
    }
    setUserFidelityCard(fidelityCardDTO, userFidelityCardId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newFidelityCard = yield userFidelityCardRepository.findById(userFidelityCardId, connection);
                newFidelityCard.discount_countdown = fidelityCardDTO.discount_countdown || 0;
                yield userFidelityCardRepository.update(newFidelityCard, connection);
                LOG.info("UPDATE USER FIDELITY CARD", newFidelityCard.id);
                return newFidelityCard;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot UPDATE USER FIDELITY CARD", 500, null, e);
            }
        });
    }
    updateUserFidelityCardStatus(status, userFidelityCardId, businessesIds, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const fidelityCard = yield userFidelityCardRepository.findById(userFidelityCardId, connection);
            if (!fidelityCard || !businessesIds.includes(fidelityCard.business_id))
                return fidelityCard;
            try {
                fidelityCard.status = status;
                yield userFidelityCardRepository.update(fidelityCard, connection);
                return fidelityCard;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Update User Fidelity Card Status", 500, null, e);
            }
        });
    }
    removeUserFidelityCard(userFidelityCardId, userId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const fidelityCard = yield userFidelityCardRepository.findById(userFidelityCardId, connection);
            if (!fidelityCard || fidelityCard.user_id != userId)
                return fidelityCard;
            try {
                yield userFidelityCardRepository.delete(fidelityCard, connection);
                return fidelityCard;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Delete User Fidelity Card", 500, null, e);
            }
        });
    }
}
exports.UserFidelityCardService = UserFidelityCardService;
//# sourceMappingURL=UserFidelityCardService.js.map