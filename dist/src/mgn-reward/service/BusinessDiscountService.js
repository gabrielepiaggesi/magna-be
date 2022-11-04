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
const IndroError_1 = require("../../utils/IndroError");
const Preconditions_1 = require("../../utils/Preconditions");
const BusinessDiscount_1 = require("../model/BusinessDiscount");
const BusinessDiscountRepository_1 = require("../repository/BusinessDiscountRepository");
const UserDiscountRepository_1 = require("../repository/UserDiscountRepository");
const UserFidelityCardRepository_1 = require("../repository/UserFidelityCardRepository");
const BusinessFidelityCardService_1 = require("./BusinessFidelityCardService");
const UserDiscountService_1 = require("./UserDiscountService");
const UserReferralRepository_1 = require("../repository/UserReferralRepository");
const UserBusinessRepository_1 = require("../../mgn-entity/repository/UserBusinessRepository");
const Helpers_1 = require("../../utils/Helpers");
const LOG = new Logger_1.Logger("CompanyService.class");
const db = require("../../connection");
const businessDiscountRepository = new BusinessDiscountRepository_1.BusinessDiscountRepository();
const userDiscountRepository = new UserDiscountRepository_1.UserDiscountRepository();
const userBusinessRepository = new UserBusinessRepository_1.UserBusinessRepository();
const userFidelityCardRepository = new UserFidelityCardRepository_1.UserFidelityCardRepository();
const businessFidelityCardService = new BusinessFidelityCardService_1.BusinessFidelityCardService();
const userDiscountService = new UserDiscountService_1.UserDiscountService();
const userReferralRepository = new UserReferralRepository_1.UserReferralRepository();
class BusinessDiscountService {
    addBusinessDiscount(dto, businessId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            yield connection.newTransaction();
            const newBusinessDiscount = yield this.createBusinessDiscount(dto, businessId, connection);
            yield connection.commit();
            yield connection.release();
            return newBusinessDiscount;
        });
    }
    updateBusinessDiscount(dto, businessDiscountId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            yield connection.newTransaction();
            const newBusinessDiscount = yield this.setBusinessDiscount(dto, businessDiscountId, connection);
            yield connection.commit();
            yield connection.release();
            return newBusinessDiscount;
        });
    }
    suspendBusinessDiscount(businessDiscountId, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const userBusinesses = yield userBusinessRepository.findByUserId(loggedUserId, connection);
            const businessesIds = userBusinesses.map(uB => uB.business_id);
            yield connection.newTransaction();
            const business = yield this.updateBusinessDiscountStatus('SUSPENDED', businessDiscountId, businessesIds, connection);
            yield connection.commit();
            yield connection.release();
            return business;
        });
    }
    activateBusinessDiscount(businessDiscountId, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const userBusinesses = yield userBusinessRepository.findByUserId(loggedUserId, connection);
            const businessesIds = userBusinesses.map(uB => uB.business_id);
            yield connection.newTransaction();
            const business = yield this.updateBusinessDiscountStatus('ACTIVE', businessDiscountId, businessesIds, connection);
            yield connection.commit();
            yield connection.release();
            return business;
        });
    }
    checkUserDiscountValidity(userDiscountId, businessId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const userDiscount = yield userDiscountRepository.findById(userDiscountId, connection);
            const userCards = yield userFidelityCardRepository.findActiveByUserIdAndBusinessId(userDiscount.user_id, userDiscount.business_id, connection);
            if (!userCards.length) {
                LOG.error('Premio senza carta!', userDiscount.id);
                yield connection.release();
                return;
            }
            const userFidelityCard = userCards[0];
            yield Preconditions_1.Precondition.checkIfTrue(userDiscount &&
                !Helpers_1.isDateToday(userDiscount.last_scan) &&
                // !isDateToday(userFidelityCard.last_scan) && 
                userDiscount.business_id === +businessId &&
                userDiscount.status == 'ACTIVE', 'USER DISCOUNT INVALID', connection, 403);
            // if (isDateToday(userDiscount.last_scan) || isDateToday(userFidelityCard.last_scan)) {
            //     await connection.release();
            //     return;
            // }
            if (Helpers_1.isDateToday(userDiscount.last_scan)) {
                yield connection.release();
                return;
            }
            const businessDiscount = yield businessDiscountRepository.findById(userDiscount.discount_id, connection);
            yield Preconditions_1.Precondition.checkIfTrue(businessDiscount && businessDiscount.status == 'ACTIVE', 'BUSINESS DISCOUNT INVALID', connection, 403);
            yield connection.newTransaction();
            const business = yield this.updateUserDiscountStatus('USED', userDiscount.id, [businessId], connection);
            if (userDiscount.referral_id) {
                const referral = yield userReferralRepository.findById(userDiscount.referral_id, connection);
                yield userDiscountService.addUserOriginDiscount(userDiscount.business_id, referral.user_id, 'REFERRAL', connection);
            }
            yield businessFidelityCardService.checkUserFidelityCardValidityInternal(userFidelityCard.id, userDiscount.business_id, connection);
            yield connection.commit();
            yield connection.release();
            return business;
        });
    }
    getBusinessDiscounts(businessId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const businessDiscounts = yield businessDiscountRepository.findByBusinessId(businessId, connection);
            yield connection.release();
            return businessDiscounts;
        });
    }
    getBusinessDiscount(businessDiscountId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const businessDiscount = yield businessDiscountRepository.findById(businessDiscountId, connection);
            yield connection.release();
            return businessDiscount;
        });
    }
    deleteBusinessDiscount(businessDiscountId, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const userBusinesses = yield userBusinessRepository.findByUserId(loggedUserId, connection);
            const businessesIds = userBusinesses.map(uB => uB.business_id);
            yield connection.newTransaction();
            const business = yield this.removeBusinessDiscount(businessDiscountId, businessesIds, connection);
            yield connection.commit();
            yield connection.release();
            return business;
        });
    }
    createBusinessDiscount(discountDTO, businessId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newDiscount = new BusinessDiscount_1.BusinessDiscount();
                newDiscount.type = discountDTO.type;
                newDiscount.business_id = +businessId;
                newDiscount.origin = discountDTO.origin;
                newDiscount.amount = +discountDTO.amount;
                if (discountDTO.monthly_limit)
                    newDiscount.monthly_limit = +discountDTO.monthly_limit;
                if (discountDTO.slogan)
                    newDiscount.slogan = discountDTO.slogan;
                newDiscount.minimum_expense = +discountDTO.minimum_expense;
                newDiscount.status = 'ACTIVE';
                const coInserted = yield businessDiscountRepository.save(newDiscount, connection);
                newDiscount.id = coInserted.insertId;
                LOG.info("NEW BUSINESS DISCOUNT", newDiscount.id);
                return newDiscount;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Create BUSINESS DISCOUNT", 500, null, e);
            }
        });
    }
    setBusinessDiscount(discountDTO, businessDiscountId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const discount = yield businessDiscountRepository.findById(businessDiscountId, connection);
                discount.type = discountDTO.type || discount.type;
                discount.business_id = discountDTO.business_id;
                discount.origin = discount.origin;
                discount.amount = +discountDTO.amount >= 0 ? +discountDTO.amount : discount.amount;
                if (discountDTO.monthly_limit)
                    discount.monthly_limit = +discountDTO.monthly_limit >= 0 ? +discountDTO.monthly_limit : discount.monthly_limit;
                discount.minimum_expense = +discountDTO.minimum_expense >= 0 ? +discountDTO.minimum_expense : discount.minimum_expense;
                discount.status = 'ACTIVE';
                if (discountDTO.slogan)
                    discount.slogan = discountDTO.slogan || discount.slogan;
                yield businessDiscountRepository.update(discount, connection);
                LOG.info("UPDATE BUSINESS DISCOUNT", discount.id);
                return discount;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Create BUSINESS DISCOUNT", 500, null, e);
            }
        });
    }
    updateBusinessDiscountStatus(status, businessDiscountId, businessesIds, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const discount = yield businessDiscountRepository.findById(businessDiscountId, connection);
            if (!discount || !businessesIds.includes(discount.business_id))
                return discount;
            try {
                discount.status = status;
                yield businessDiscountRepository.update(discount, connection);
                return discount;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Update Business Discount Status", 500, null, e);
            }
        });
    }
    removeBusinessDiscount(businessDiscountId, businessesIds, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const discount = yield businessDiscountRepository.findById(businessDiscountId, connection);
            if (!discount || !businessesIds.includes(discount.business_id))
                return discount;
            try {
                yield businessDiscountRepository.delete(discount, connection);
                return discount;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Delete Business Discount", 500, null, e);
            }
        });
    }
    updateUserDiscountStatus(status, userDiscountId, businessesIds, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const discount = yield userDiscountRepository.findById(userDiscountId, connection);
            if (!discount || !businessesIds.includes(discount.business_id))
                return discount;
            const now = new Date(Date.now()).toLocaleString('sv', { timeZone: 'Europe/Rome' });
            try {
                discount.last_scan = now;
                discount.status = status;
                yield userDiscountRepository.update(discount, connection);
                return discount;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Update Business Discount Status", 500, null, e);
            }
        });
    }
}
exports.BusinessDiscountService = BusinessDiscountService;
//# sourceMappingURL=BusinessDiscountService.js.map