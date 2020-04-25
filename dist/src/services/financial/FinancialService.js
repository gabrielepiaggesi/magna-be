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
const database_1 = require("../../database");
const index_1 = require("../../integration/middleware/index");
const Logger_1 = require("../../utils/Logger");
const UserRepository_1 = require("../../repositories/user/UserRepository");
const PaymentService_1 = require("./PaymentService");
const SubScription_1 = require("../../models/financial/SubScription");
const SubScriptionRepository_1 = require("../../repositories/financial/SubScriptionRepository");
const LOG = new Logger_1.Logger("FinancialService.class");
const userRepository = new UserRepository_1.UserRepository();
const paymentService = new PaymentService_1.PaymentService();
const subScriptionRepository = new SubScriptionRepository_1.SubScriptionRepository();
const db = new database_1.Database();
class FinancialService {
    payUserSubScription(res, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            LOG.debug("payUserSubScription", obj);
            const userLogged = index_1.auth.loggedId;
            yield db.newTransaction();
            try {
                const user = yield userRepository.findById(userLogged);
                LOG.debug("user", user.id);
                obj.userId = user.id;
                const subscription = yield paymentService.subscribeTo(obj);
                yield db.commit();
                return res.status(200).send(subscription);
            }
            catch (e) {
                yield db.rollback();
                LOG.error("new subscription error", e);
                return res.status(500).send(e);
            }
        });
    }
    getUserSubScription(res, planId) {
        return __awaiter(this, void 0, void 0, function* () {
            LOG.debug("getUserSubScription");
            const userLogged = index_1.auth.loggedId;
            let userSub = yield subScriptionRepository.findByUserIdAndPlanId(userLogged, planId);
            userSub = userSub || new SubScription_1.SubScription();
            return res.status(200).send(userSub);
        });
    }
}
exports.FinancialService = FinancialService;
//# sourceMappingURL=FinancialService.js.map