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
const LOG = new Logger_1.Logger("CompanyService.class");
const db = require("../../connection");
const businessRepository = new BusinessRepository_1.BusinessRepository();
class BusinessService {
    addBusiness(dto, loggedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Preconditions_1.Precondition.checkIfFalse((!dto.name), "Incomplete Data");
            const connection = yield db.connection();
            yield connection.newTransaction();
            const newBusiness = yield this.updateOrCreateBusiness(dto, null, loggedUserId, connection);
            yield connection.commit();
            yield connection.release();
            return newBusiness;
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
            const businesses = yield businessRepository.findByUserId(userId, connection);
            yield connection.release();
            return businesses;
        });
    }
    updateOrCreateBusiness(newBusinessDTO, businessId, loggedUserId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            let newBusiness = new Business_1.Business();
            if (businessId) {
                newBusiness = yield businessRepository.findById(businessId, connection);
                if (newBusiness && newBusiness.user_id != loggedUserId)
                    return null;
            }
            try {
                newBusiness.name = newBusinessDTO.name || newBusiness.name;
                newBusiness.status = businessId ? newBusiness.status : 'ACTIVE';
                newBusiness.user_id = businessId ? newBusiness.user_id : loggedUserId;
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
    removeBusiness(businessId, loggedUserId, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const business = yield businessRepository.findById(businessId, connection);
            if (!business || business.user_id != loggedUserId)
                return business;
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