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
const Business_1 = require("../model/Business");
const BusinessRepository_1 = require("../repository/BusinessRepository");
const UserBusiness_1 = require("../model/UserBusiness");
const UserBusinessRepository_1 = require("../repository/UserBusinessRepository");
const LOG = new Logger_1.Logger("CompanyService.class");
const db = require("../../connection");
const businessRepository = new BusinessRepository_1.BusinessRepository();
const userBusinessRepository = new UserBusinessRepository_1.UserBusinessRepository();
class BusinessService {
    addBusiness(dto, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Preconditions_1.Precondition.checkIfFalse((!dto.name), "Incomplete Data");
            const connection = yield db.connection();
            yield connection.newTransaction();
            const newBusiness = yield this.updateOrCreateBusiness(dto, null, loggedUserId, connection);
            const newUserBusiness = yield this.createUserBusiness(newBusiness.id, newBusiness.user_id, connection);
            yield connection.commit();
            yield connection.release();
            return newBusiness;
        });
    }
    getUserBusinesses(businessId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const usersBusinessEmails = yield userBusinessRepository.findByBusinessIdJoinUserEmail(businessId, connection);
            yield connection.release();
            return usersBusinessEmails;
        });
    }
    addUserBusiness(businessId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const uBusiness = yield userBusinessRepository.findByUserIdAndUserBusinessId(businessId, userId, connection);
            if (uBusiness) {
                LOG.info("GIA CE STA");
                yield connection.release();
                return uBusiness;
            }
            LOG.info("NUOVO");
            yield connection.newTransaction();
            const newUserBusiness = yield this.createUserBusiness(businessId, userId, connection);
            yield connection.commit();
            yield connection.release();
            return newUserBusiness;
        });
    }
    removeUserBusiness(businessId, userId, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const uBusiness = yield userBusinessRepository.findByUserIdAndUserBusinessId(businessId, userId, connection);
            if (!uBusiness || uBusiness.user_id != userId || uBusiness.user_id === loggedUserId) {
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Delete User Business", 500, null, 'not_allowed');
            }
            yield connection.newTransaction();
            try {
                yield userBusinessRepository.delete(uBusiness, connection);
                yield connection.commit();
                yield connection.release();
                return uBusiness;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Delete User Business", 500, null, e);
            }
        });
    }
    deleteBusiness(businessId, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            yield connection.newTransaction();
            const business = yield this.removeBusiness(businessId, loggedUserId, connection);
            yield connection.commit();
            yield connection.release();
            return business;
        });
    }
    updateBusiness(businessId, dto, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            yield connection.newTransaction();
            const newBusiness = yield this.updateOrCreateBusiness(dto, businessId, loggedUserId, connection);
            yield connection.commit();
            yield connection.release();
            return newBusiness;
        });
    }
    getBusiness(businessId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const business = yield businessRepository.findById(businessId, connection);
            yield connection.release();
            return business;
        });
    }
    getUserBusinessesList(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield db.connection();
            const userBusinesses = yield userBusinessRepository.findByUserId(userId, connection);
            const businessIds = userBusinesses.map(uB => uB.business_id);
            const businesses = yield businessRepository.whereBusinessesIdsIn(businessIds, connection);
            yield connection.release();
            return businesses;
        });
    }
    updateOrCreateBusiness(newBusinessDTO, businessId, loggedUserId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            let newBusiness = new Business_1.Business();
            if (businessId) {
                newBusiness = yield businessRepository.findById(businessId, connection);
                // if (newBusiness && newBusiness.user_id != loggedUserId) return null; // CHECK USER BUSINESS!
            }
            try {
                const today = new Date(Date.now());
                if (newBusinessDTO.phoneNumber && newBusinessDTO.phoneNumber != newBusiness.phone_number)
                    newBusiness.phone_number = newBusinessDTO.phoneNumber;
                newBusiness.name = newBusinessDTO.name || newBusiness.name;
                newBusiness.status = businessId ? newBusiness.status : 'ACTIVE';
                newBusiness.user_id = businessId ? newBusiness.user_id : loggedUserId;
                newBusiness.accept_reservations = newBusinessDTO.acceptReservations >= 0 ? newBusinessDTO.acceptReservations : newBusiness.accept_reservations;
                newBusiness.disable_reservation_today =
                    newBusinessDTO.disableReservationToday >= 0 ?
                        newBusinessDTO.disableReservationToday === 1 ? today.toISOString().substring(0, 10) + ' 20:00:00' : new Date(today.setDate(today.getDate() - 1)).toISOString().substring(0, 10) + ' 20:00:00'
                        : newBusiness.disable_reservation_today;
                const coInserted = businessId ? yield businessRepository.update(newBusiness, connection) : yield businessRepository.save(newBusiness, connection);
                newBusiness.id = businessId ? newBusiness.id : coInserted.insertId;
                !businessId && LOG.info("NEW BUSINESS", newBusiness.id);
                return newBusiness;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Create BUSINESS", 500, null, e);
            }
        });
    }
    createUserBusiness(businessId, userId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let newBusiness = new UserBusiness_1.UserBusiness();
                newBusiness.user_id = userId;
                newBusiness.business_id = businessId;
                const coInserted = yield userBusinessRepository.save(newBusiness, connection);
                newBusiness.id = businessId ? newBusiness.id : coInserted.insertId;
                !businessId && LOG.info("NEW USER BUSINESS", newBusiness.id);
                return newBusiness;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Create USER BUSINESS", 500, null, e);
            }
        });
    }
    removeBusiness(businessId, loggedUserId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const business = yield businessRepository.findById(businessId, connection);
            // if (!business || business.user_id != loggedUserId) return business; // CHECK USER BUSINESS!
            try {
                yield businessRepository.delete(business, connection);
                return business;
            }
            catch (e) {
                LOG.error(e);
                yield connection.rollback();
                yield connection.release();
                throw new IndroError_1.IndroError("Cannot Delete Business", 500, null, e);
            }
        });
    }
}
exports.BusinessService = BusinessService;
//# sourceMappingURL=BusinessService.js.map