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
const UserReferral_1 = require("../model/UserReferral");
const BusinessDiscountRepository_1 = require("../repository/BusinessDiscountRepository");
const UserReferralRepository_1 = require("../repository/UserReferralRepository");
const UserDiscountService_1 = require("./UserDiscountService");
const LOG = new Logger_1.Logger("CompanyService.class");
const shortid = require('shortid');
const db = require("../../connection");
const userReferralRepository = new UserReferralRepository_1.UserReferralRepository();
const businessRepository = new BusinessRepository_1.BusinessRepository();
const businessDiscountRepository = new BusinessDiscountRepository_1.BusinessDiscountRepository();
const userDiscountService = new UserDiscountService_1.UserDiscountService();
class UserReferralService {
    generateUserReferral(userId, businessId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            yield connection.newTransaction();
            const newUserReferral = yield this.createUserReferral(userId, businessId, connection);
            yield connection.commit();
            yield connection.release();
            return newUserReferral;
        });
    }
    getUserReferralInsight(referralId) {
        return __awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
    generateUserDiscountFromReferral(uuid, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const referralCode = yield userReferralRepository.findByUUID(uuid, connection);
            const userReferral = yield userReferralRepository.findByUserIdAndBusinessId(userId, referralCode.business_id, connection);
            if (!userReferral) {
                yield connection.newTransaction();
                yield userDiscountService.addUserReferralDiscount(referralCode.business_id, userId, referralCode.id, connection);
                const newUserReferral = yield this.createUserReferral(userId, referralCode.business_id, connection);
                yield connection.commit();
            }
            yield connection.release();
            return userReferral;
        });
    }
    getUserReferral(userId, businessId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const userReferral = yield userReferralRepository.findByUserIdAndBusinessId(userId, businessId, connection);
            yield connection.release();
            return userReferral;
        });
    }
    createUserReferral(userId, businessId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newReferral = new UserReferral_1.UserReferral();
                newReferral.user_id = userId;
                newReferral.uuid = shortid.generate().toUpperCase();
                newReferral.business_id = +businessId;
                newReferral.status = 'ACTIVE';
                const coInserted = yield userReferralRepository.save(newReferral, connection);
                newReferral.id = coInserted.insertId;
                LOG.info("NEW USER REFERRAL", newReferral.id);
                return newReferral;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Create USER REFERRAL", 500, null, e);
            }
        });
    }
}
exports.UserReferralService = UserReferralService;
//# sourceMappingURL=UserReferralService.js.map