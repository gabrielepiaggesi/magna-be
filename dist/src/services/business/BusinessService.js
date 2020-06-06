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
const BusinessRepository_1 = require("../../repositories/business/BusinessRepository");
const Logger_1 = require("../../utils/Logger");
const LOG = new Logger_1.Logger("BusinessService.class");
const businessRepository = new BusinessRepository_1.BusinessRepository();
const db = require("../../database");
class BusinessService {
    getLoggedBusiness(res) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedId = index_1.auth.loggedId;
            const user = yield businessRepository.findById(loggedId);
            delete user.password;
            LOG.debug("user", user);
            return res.status(200).send(user);
        });
    }
    updateBusiness(res, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedId = index_1.auth.loggedId;
            yield db.newTransaction();
            try {
                let business = yield businessRepository.findById(loggedId);
                business.name = obj.name;
                business.contact = obj.contact;
                business.address = obj.address;
                yield businessRepository.update(business);
                yield db.commit();
                business = yield businessRepository.findById(loggedId);
                return res.status(200).send(business);
            }
            catch (e) {
                yield db.rollback();
                LOG.error("new creator plan error", e);
                return res.status(500).send(e);
            }
        });
    }
}
exports.BusinessService = BusinessService;
//# sourceMappingURL=BusinessService.js.map