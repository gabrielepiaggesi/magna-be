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
const IndroError_1 = require("../../utils/IndroError");
const UserDiscount_1 = require("../model/UserDiscount");
const BusinessDiscountRepository_1 = require("../repository/BusinessDiscountRepository");
const UserDiscountRepository_1 = require("../repository/UserDiscountRepository");
const UserFidelityCardService_1 = require("./UserFidelityCardService");
const LOG = new Logger_1.Logger("CompanyService.class");
const db = require("../../connection");
const userDiscountRepository = new UserDiscountRepository_1.UserDiscountRepository();
const userBusinessRepository = new UserBusinessRepository_1.UserBusinessRepository();
const businessDiscountRepository = new BusinessDiscountRepository_1.BusinessDiscountRepository();
const userFidelityCardService = new UserFidelityCardService_1.UserFidelityCardService();
class UserDiscountService {
    addUserDiscount(dto, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            yield connection.newTransaction();
            const newUserDiscount = yield this.createUserDiscount(dto, userId, null, connection);
            yield connection.commit();
            yield connection.release();
            return newUserDiscount;
        });
    }
    addUserOriginDiscount(businessId, userId, origin, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const businessDiscount = yield businessDiscountRepository.findActiveByBusinessIdAndOrigin(businessId, origin, connection);
            if (!businessDiscount) {
                return;
            }
            const dto = {
                business_id: businessId,
                discount_id: businessDiscount.id
            };
            const newUserDiscount = yield this.createUserDiscount(dto, userId, null, connection);
            return newUserDiscount;
        });
    }
    addUserReferralDiscount(businessId, userId, referralId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const businessDiscount = yield businessDiscountRepository.findActiveByBusinessIdAndOrigin(businessId, 'REFERRAL', connection);
            if (!businessDiscount) {
                return;
            }
            const usersDiscount = yield userDiscountRepository.findByUserIdAndBusinessId(userId, businessId, connection);
            if (!usersDiscount.length) {
                yield userFidelityCardService.addUserFidelityCardInternal(businessId, userId, connection);
                const dto = {
                    business_id: businessId,
                    discount_id: businessDiscount.id
                };
                const newUserDiscount = yield this.createUserDiscount(dto, userId, referralId, connection);
                return newUserDiscount;
            }
            else {
                return null;
            }
        });
    }
    updateUserDiscount(dto, userDiscountId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            yield connection.newTransaction();
            const newUserDiscount = yield this.setUserDiscount(dto, userDiscountId, connection);
            yield connection.commit();
            yield connection.release();
            return newUserDiscount;
        });
    }
    suspendUserDiscount(userDiscountId, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const userBusinesses = yield userBusinessRepository.findByUserId(loggedUserId, connection);
            const businessesIds = userBusinesses.map(uB => uB.business_id);
            yield connection.newTransaction();
            const business = yield this.updateUserDiscountStatus('SUSPENDED', userDiscountId, businessesIds, connection);
            yield connection.commit();
            yield connection.release();
            return business;
        });
    }
    activateUserDiscount(businessDiscountId, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const userBusinesses = yield userBusinessRepository.findByUserId(loggedUserId, connection);
            const businessesIds = userBusinesses.map(uB => uB.business_id);
            yield connection.newTransaction();
            const business = yield this.updateUserDiscountStatus('ACTIVE', businessDiscountId, businessesIds, connection);
            yield connection.commit();
            yield connection.release();
            return business;
        });
    }
    getUserDiscounts(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const usersDiscounts = yield userDiscountRepository.findActiveByUserIdJoinBusiness(userId, connection);
            yield connection.release();
            return usersDiscounts;
        });
    }
    getUserDiscount(userDiscountId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const userDiscount = yield userDiscountRepository.findById(userDiscountId, connection);
            yield connection.release();
            return userDiscount;
        });
    }
    deleteUserDiscount(userDiscountId, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const userBusinesses = yield userBusinessRepository.findByUserId(loggedUserId, connection);
            const businessesIds = userBusinesses.map(uB => uB.business_id);
            yield connection.newTransaction();
            const business = yield this.removeUserDiscount(userDiscountId, businessesIds, connection);
            yield connection.commit();
            yield connection.release();
            return business;
        });
    }
    createUserDiscount(discountDTO, userId, referralId = null, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newDiscount = new UserDiscount_1.UserDiscount();
                newDiscount.user_id = userId;
                if (referralId)
                    newDiscount.referral_id = referralId;
                newDiscount.business_id = +discountDTO.business_id;
                newDiscount.discount_id = +discountDTO.discount_id;
                newDiscount.status = 'ACTIVE';
                const coInserted = yield userDiscountRepository.save(newDiscount, connection);
                newDiscount.id = coInserted.insertId;
                LOG.info("NEW USER DISCOUNT", newDiscount.id);
                return newDiscount;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Create USER DISCOUNT", 500, null, e);
            }
        });
    }
    setUserDiscount(discountDTO, userDiscountId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const discount = yield userDiscountRepository.findById(userDiscountId, connection);
                discount.business_id = +discountDTO.business_id;
                discount.discount_id = +discountDTO.discount_id;
                yield userDiscountRepository.update(discount, connection);
                LOG.info("UPDATE USER DISCOUNT", discount.id);
                return discount;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot UPDATE USER DISCOUNT", 500, null, e);
            }
        });
    }
    removeUserDiscount(businessDiscountId, businessesIds, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const discount = yield userDiscountRepository.findById(businessDiscountId, connection);
            if (!discount || !businessesIds.includes(discount.business_id))
                return discount;
            try {
                yield userDiscountRepository.delete(discount, connection);
                return discount;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Delete User Discount", 500, null, e);
            }
        });
    }
    updateUserDiscountStatus(status, userDiscountId, businessesIds, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const discount = yield userDiscountRepository.findById(userDiscountId, connection);
            if (!discount || !businessesIds.includes(discount.business_id))
                return discount;
            try {
                discount.status = status;
                yield userDiscountRepository.update(discount, connection);
                return discount;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Update User Discount Status", 500, null, e);
            }
        });
    }
}
exports.UserDiscountService = UserDiscountService;
//# sourceMappingURL=UserDiscountService.js.map