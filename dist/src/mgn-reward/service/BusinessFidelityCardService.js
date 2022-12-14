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
const UserBusinessRepository_1 = require("../../mgn-entity/repository/UserBusinessRepository");
const Logger_1 = require("../../mgn-framework/services/Logger");
const PushNotificationSender_1 = require("../../mgn-framework/services/PushNotificationSender");
const Helpers_1 = require("../../utils/Helpers");
const IndroError_1 = require("../../utils/IndroError");
const Preconditions_1 = require("../../utils/Preconditions");
const BusinessFidelityCard_1 = require("../model/BusinessFidelityCard");
const BusinessFidelityCardRepository_1 = require("../repository/BusinessFidelityCardRepository");
const UserFidelityCardRepository_1 = require("../repository/UserFidelityCardRepository");
const UserDiscountService_1 = require("./UserDiscountService");
const LOG = new Logger_1.Logger("CompanyService.class");
const db = require("../../connection");
const businessFidelityCardRepository = new BusinessFidelityCardRepository_1.BusinessFidelityCardRepository();
const userBusinessRepository = new UserBusinessRepository_1.UserBusinessRepository();
const userFidelityCardRepository = new UserFidelityCardRepository_1.UserFidelityCardRepository();
const userDiscountService = new UserDiscountService_1.UserDiscountService();
class BusinessFidelityCardService {
    addBusinessFidelityCard(dto, businessId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            yield connection.newTransaction();
            const newBusinessFidelityCard = yield this.createBusinessFidelityCard(dto, businessId, connection);
            yield connection.commit();
            yield connection.release();
            return newBusinessFidelityCard;
        });
    }
    updateBusinessFidelityCard(dto, businessFidelityCardId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            yield connection.newTransaction();
            const newBusinessFidelityCard = yield this.setBusinessFidelityCard(dto, businessFidelityCardId, connection);
            yield connection.commit();
            yield connection.release();
            return newBusinessFidelityCard;
        });
    }
    suspendBusinessFidelityCard(businessFidelityCardId, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const userBusinesses = yield userBusinessRepository.findByUserId(loggedUserId, connection);
            const businessesIds = userBusinesses.map(uB => uB.business_id);
            yield connection.newTransaction();
            const business = yield this.updateBusinessFidelityCardStatus('SUSPENDED', businessFidelityCardId, businessesIds, connection);
            yield connection.commit();
            yield connection.release();
            return business;
        });
    }
    activateBusinessFidelityCard(businessFidelityCardId, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const userBusinesses = yield userBusinessRepository.findByUserId(loggedUserId, connection);
            const businessesIds = userBusinesses.map(uB => uB.business_id);
            yield connection.newTransaction();
            const business = yield this.updateBusinessFidelityCardStatus('ACTIVE', businessFidelityCardId, businessesIds, connection);
            yield connection.commit();
            yield connection.release();
            return business;
        });
    }
    checkUserFidelityCardValidityInternal(userFidelityCardId, businessId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const userFidelityCard = yield userFidelityCardRepository.findById(userFidelityCardId, connection);
            yield Preconditions_1.Precondition.checkIfTrue(userFidelityCard &&
                // !isDateToday(userFidelityCard.last_scan) && 
                userFidelityCard.business_id === +businessId &&
                userFidelityCard.status == 'ACTIVE', 'USER FIDELITY CARD INVALID', connection, 403);
            const businessFidelityCard = yield businessFidelityCardRepository.findActiveByBusinessId(businessId, connection);
            yield Preconditions_1.Precondition.checkIfTrue(businessFidelityCard && businessFidelityCard.status == 'ACTIVE', 'BUSINESS FIDELITY CARD INVALID', connection, 403);
            // if (businessFidelityCard.type !== 'points' && isDateToday(userFidelityCard.last_scan)) {
            //     return;
            // }
            const newUserFidelityCard = businessFidelityCard.type === 'points' ?
                yield this.updateUserFidelityCardCountdownPOINTS(userFidelityCard.id, [businessId], businessFidelityCard.expenses_amount, 1, connection) :
                yield this.updateUserFidelityCardCountdown(userFidelityCard.id, [businessId], businessFidelityCard.expenses_amount, connection);
            if (newUserFidelityCard.discount) {
                yield userDiscountService.addUserOriginDiscount(userFidelityCard.business_id, userFidelityCard.user_id, 'FIDELITY_CARD', connection);
            }
            return newUserFidelityCard.fidelityCard;
        });
    }
    checkUserFidelityCardValidity(userFidelityCardId, businessId, pointsToAdd = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const userFidelityCard = yield userFidelityCardRepository.findById(userFidelityCardId, connection);
            yield Preconditions_1.Precondition.checkIfTrue(userFidelityCard &&
                // !isDateToday(userFidelityCard.last_scan) && 
                userFidelityCard.business_id === +businessId &&
                userFidelityCard.status == 'ACTIVE', 'USER FIDELITY CARD INVALID', connection, 403);
            const businessFidelityCard = yield businessFidelityCardRepository.findActiveByBusinessId(businessId, connection);
            yield Preconditions_1.Precondition.checkIfTrue(businessFidelityCard && businessFidelityCard.status == 'ACTIVE', 'BUSINESS FIDELITY CARD INVALID', connection, 403);
            if (businessFidelityCard.type !== 'points' && Helpers_1.isDateToday(userFidelityCard.last_scan)) {
                yield connection.release();
                return;
            }
            yield connection.newTransaction();
            const newUserFidelityCard = businessFidelityCard.type === 'points' ?
                yield this.updateUserFidelityCardCountdownPOINTS(userFidelityCard.id, [businessId], businessFidelityCard.expenses_amount, pointsToAdd, connection) :
                yield this.updateUserFidelityCardCountdown(userFidelityCard.id, [businessId], businessFidelityCard.expenses_amount, connection);
            if (newUserFidelityCard.discount) {
                yield userDiscountService.addUserOriginDiscount(userFidelityCard.business_id, userFidelityCard.user_id, 'FIDELITY_CARD', connection);
            }
            yield connection.commit();
            yield connection.release();
            PushNotificationSender_1.PushNotificationSender.sendToUser(userFidelityCard.user_id, 'Carta Fedelt??', 'Timbrata con successo!', 'user-card');
            return newUserFidelityCard.fidelityCard;
        });
    }
    resetUserFidelityCardValidity(userFidelityCardId, businessId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const userFidelityCard = yield userFidelityCardRepository.findById(userFidelityCardId, connection);
            yield Preconditions_1.Precondition.checkIfTrue(userFidelityCard &&
                userFidelityCard.business_id === +businessId &&
                userFidelityCard.status == 'ACTIVE', 'USER FIDELITY CARD INVALID', connection, 403);
            const businessFidelityCard = yield businessFidelityCardRepository.findById(userFidelityCard.discount_id, connection);
            yield Preconditions_1.Precondition.checkIfTrue(businessFidelityCard && businessFidelityCard.status == 'ACTIVE', 'BUSINESS FIDELITY CARD INVALID', connection, 403);
            yield connection.newTransaction();
            const newUserFidelityCard = yield this.resetAtZeroUserFidelityCardCountdown(userFidelityCard.id, [businessId], connection);
            yield connection.commit();
            yield connection.release();
            return newUserFidelityCard;
        });
    }
    getBusinessFidelityCards(businessId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const businessFidelityCards = yield businessFidelityCardRepository.findByBusinessId(businessId, connection);
            yield connection.release();
            return businessFidelityCards;
        });
    }
    getClientsFidelityCards(businessId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const clientsFidelityCards = yield userFidelityCardRepository.findActiveByBusinessId(businessId, connection);
            yield connection.release();
            return clientsFidelityCards;
        });
    }
    getBusinessFidelityCard(businessId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const businessFidelityCard = yield businessFidelityCardRepository.findByBusinessId(businessId, connection);
            yield connection.release();
            return businessFidelityCard;
        });
    }
    deleteBusinessFidelityCard(businessFidelityCardId, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const userBusinesses = yield userBusinessRepository.findByUserId(loggedUserId, connection);
            const businessesIds = userBusinesses.map(uB => uB.business_id);
            yield connection.newTransaction();
            const business = yield this.removeBusinessFidelityCard(businessFidelityCardId, businessesIds, connection);
            yield connection.commit();
            yield connection.release();
            return business;
        });
    }
    createBusinessFidelityCard(fidelityCardDTO, businessId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newFidelityCard = new BusinessFidelityCard_1.BusinessFidelityCard();
                newFidelityCard.business_id = +businessId;
                if (fidelityCardDTO.discount_id)
                    newFidelityCard.discount_id = +fidelityCardDTO.discount_id;
                newFidelityCard.expenses_amount = +fidelityCardDTO.expenses_amount;
                newFidelityCard.status = 'ACTIVE';
                newFidelityCard.type = fidelityCardDTO.type || 'times';
                const coInserted = yield businessFidelityCardRepository.save(newFidelityCard, connection);
                newFidelityCard.id = coInserted.insertId;
                LOG.info("NEW BUSINESS FIDELITY CARD", newFidelityCard.id);
                return newFidelityCard;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Create BUSINESS FIDELITY CARD", 500, null, e);
            }
        });
    }
    setBusinessFidelityCard(fidelityCardDTO, businessFidelityCardId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newFidelityCard = yield businessFidelityCardRepository.findById(businessFidelityCardId, connection);
                if (fidelityCardDTO.discount_id || newFidelityCard.discount_id)
                    newFidelityCard.discount_id = +fidelityCardDTO.discount_id || newFidelityCard.discount_id;
                newFidelityCard.expenses_amount = +fidelityCardDTO.expenses_amount;
                if (fidelityCardDTO.type)
                    newFidelityCard.type = fidelityCardDTO.type;
                yield businessFidelityCardRepository.update(newFidelityCard, connection);
                LOG.info("UPDATE BUSINESS FIDELITY CARD", newFidelityCard.id);
                return newFidelityCard;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Create BUSINESS FIDELITY CARD", 500, null, e);
            }
        });
    }
    updateBusinessFidelityCardStatus(status, businessFidelityCardId, businessesIds, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const fidelityCard = yield businessFidelityCardRepository.findById(businessFidelityCardId, connection);
            if (!fidelityCard || !businessesIds.includes(fidelityCard.business_id))
                return fidelityCard;
            try {
                fidelityCard.status = status;
                yield businessFidelityCardRepository.update(fidelityCard, connection);
                return fidelityCard;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Update Business Fidelity Card Status", 500, null, e);
            }
        });
    }
    removeBusinessFidelityCard(businessFidelityCardId, businessesIds, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const discount = yield businessFidelityCardRepository.findById(businessFidelityCardId, connection);
            if (!discount || !businessesIds.includes(discount.business_id))
                return discount;
            try {
                yield businessFidelityCardRepository.delete(discount, connection);
                return discount;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Delete Business Fidelity Card", 500, null, e);
            }
        });
    }
    updateUserFidelityCardCountdown(userFidelityCardId, businessesIds, businessExpensesAmount, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const fidelityCard = yield userFidelityCardRepository.findById(userFidelityCardId, connection);
            if (!fidelityCard || !businessesIds.includes(fidelityCard.business_id))
                return { fidelityCard, discount: false };
            const now = new Date(Date.now()).toLocaleString('sv', { timeZone: 'Europe/Rome' });
            fidelityCard.last_scan = now;
            fidelityCard.type = 'times';
            try {
                if (fidelityCard.discount_countdown <= 0 || !fidelityCard.discount_countdown) {
                    LOG.error("HELP !!! COUNTDOWN LESS THAN ZERO! WTF", fidelityCard.id);
                    fidelityCard.discount_countdown = businessExpensesAmount;
                    yield userFidelityCardRepository.update(fidelityCard, connection);
                    return { fidelityCard, discount: false };
                }
                else if (fidelityCard.discount_countdown <= 2) {
                    if (fidelityCard.discount_countdown == 2) {
                        // BONUS!
                        fidelityCard.discount_countdown = fidelityCard.discount_countdown - 1;
                        fidelityCard.expenses_amount = businessExpensesAmount;
                        fidelityCard.usage_amount = (+fidelityCard.usage_amount) + 1;
                        yield userFidelityCardRepository.update(fidelityCard, connection);
                        return { fidelityCard, discount: true };
                    }
                    else if (fidelityCard.discount_countdown == 1) {
                        // USING BONUS!
                        fidelityCard.discount_countdown = businessExpensesAmount;
                        fidelityCard.expenses_amount = businessExpensesAmount;
                        fidelityCard.usage_amount = (+fidelityCard.usage_amount) + 1;
                        yield userFidelityCardRepository.update(fidelityCard, connection);
                        return { fidelityCard, discount: false };
                    }
                }
                else if (fidelityCard.expenses_amount != businessExpensesAmount) {
                    const timesWentThereIncludedNow = fidelityCard.expenses_amount - (fidelityCard.discount_countdown - 1);
                    if (timesWentThereIncludedNow >= businessExpensesAmount) {
                        // BONUS!
                        fidelityCard.discount_countdown = businessExpensesAmount;
                        fidelityCard.usage_amount = (+fidelityCard.usage_amount) + 1;
                        fidelityCard.expenses_amount = businessExpensesAmount;
                        yield userFidelityCardRepository.update(fidelityCard, connection);
                        return { fidelityCard, discount: true };
                    }
                    else {
                        fidelityCard.discount_countdown = businessExpensesAmount - timesWentThereIncludedNow;
                        fidelityCard.usage_amount = (+fidelityCard.usage_amount) + 1;
                        fidelityCard.expenses_amount = businessExpensesAmount;
                        yield userFidelityCardRepository.update(fidelityCard, connection);
                        return { fidelityCard, discount: false };
                    }
                }
                else {
                    fidelityCard.discount_countdown = (+fidelityCard.discount_countdown) - 1;
                    fidelityCard.usage_amount = (+fidelityCard.usage_amount) + 1;
                    yield userFidelityCardRepository.update(fidelityCard, connection);
                    return { fidelityCard, discount: false };
                }
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Update User Fidelity Card COUNTDOWN", 500, null, e);
            }
        });
    }
    updateUserFidelityCardCountdownPOINTS(userFidelityCardId, businessesIds, businessExpensesAmount, pointsToAdd, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const fidelityCard = yield userFidelityCardRepository.findById(userFidelityCardId, connection);
            if (!fidelityCard || !businessesIds.includes(fidelityCard.business_id))
                return { fidelityCard, discount: false };
            const now = new Date(Date.now()).toLocaleString('sv', { timeZone: 'Europe/Rome' });
            fidelityCard.last_scan = now;
            fidelityCard.type = 'points';
            try {
                if (fidelityCard.discount_countdown < 0 || !fidelityCard.discount_countdown) {
                    LOG.error("HELP !!! COUNTDOWN LESS THAN ZERO! WTF", fidelityCard.id);
                    fidelityCard.discount_countdown = businessExpensesAmount;
                    yield userFidelityCardRepository.update(fidelityCard, connection);
                    return { fidelityCard, discount: false };
                }
                else if (fidelityCard.expenses_amount != businessExpensesAmount) {
                    let newCountDown = (fidelityCard.discount_countdown - pointsToAdd);
                    let pointsUntilNow = 0;
                    if (newCountDown >= 0) {
                        pointsUntilNow = fidelityCard.expenses_amount - newCountDown;
                    }
                    else { // newCountDown = 5 - 7 = -2
                        pointsUntilNow = fidelityCard.expenses_amount + (-1 * newCountDown); // 10 + 2 = 12
                    }
                    if (pointsUntilNow >= businessExpensesAmount) {
                        // BONUS!
                        fidelityCard.discount_countdown = 1;
                        fidelityCard.usage_amount = (+fidelityCard.usage_amount) + 1;
                        fidelityCard.expenses_amount = businessExpensesAmount;
                        yield userFidelityCardRepository.update(fidelityCard, connection);
                        return { fidelityCard, discount: true };
                    }
                    else {
                        newCountDown = businessExpensesAmount - pointsUntilNow;
                        if (newCountDown > businessExpensesAmount || newCountDown < 0)
                            newCountDown = businessExpensesAmount;
                        if (newCountDown == 1)
                            newCountDown = 2;
                        fidelityCard.discount_countdown = newCountDown;
                        fidelityCard.usage_amount = (+fidelityCard.usage_amount) + 1;
                        fidelityCard.expenses_amount = businessExpensesAmount;
                        yield userFidelityCardRepository.update(fidelityCard, connection);
                        return { fidelityCard, discount: false };
                    }
                }
                else {
                    let newCountDown = (fidelityCard.discount_countdown - pointsToAdd);
                    if (newCountDown > 1) {
                        if (newCountDown > fidelityCard.expenses_amount)
                            newCountDown = fidelityCard.expenses_amount;
                        fidelityCard.discount_countdown = newCountDown;
                        fidelityCard.usage_amount = (+fidelityCard.usage_amount) + 1;
                        yield userFidelityCardRepository.update(fidelityCard, connection);
                        return { fidelityCard, discount: false };
                    }
                    else if (newCountDown == 0 && fidelityCard.discount_countdown == 1) {
                        fidelityCard.discount_countdown = fidelityCard.expenses_amount;
                        fidelityCard.usage_amount = (+fidelityCard.usage_amount) + 1;
                        yield userFidelityCardRepository.update(fidelityCard, connection);
                        return { fidelityCard, discount: false };
                    }
                    else {
                        fidelityCard.discount_countdown = 1;
                        fidelityCard.usage_amount = (+fidelityCard.usage_amount) + 1;
                        yield userFidelityCardRepository.update(fidelityCard, connection);
                        return { fidelityCard, discount: true };
                    }
                }
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Update User Fidelity Card COUNTDOWN", 500, null, e);
            }
        });
    }
    resetAtZeroUserFidelityCardCountdown(userFidelityCardId, businessesIds, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const fidelityCard = yield userFidelityCardRepository.findById(userFidelityCardId, connection);
            if (!fidelityCard || !businessesIds.includes(fidelityCard.business_id))
                return fidelityCard;
            try {
                fidelityCard.discount_countdown = 0;
                yield userFidelityCardRepository.update(fidelityCard, connection);
                return fidelityCard;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Reset AT ZERO User Fidelity Card COUNTDOWN", 500, null, e);
            }
        });
    }
}
exports.BusinessFidelityCardService = BusinessFidelityCardService;
//# sourceMappingURL=BusinessFidelityCardService.js.map