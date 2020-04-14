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
const LOG = new Logger_1.Logger("FinancialService.class");
const userRepository = new UserRepository_1.UserRepository();
const paymentService = new PaymentService_1.PaymentService();
const db = new database_1.Database();
class FinancialService {
    trySubScription(res, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            LOG.debug("trySubScription", obj);
            const userLogged = index_1.auth.loggedId;
            yield db.newTransaction();
            try {
                const user = yield userRepository.findById(userLogged);
                obj.userId = user.getId();
                const subscription = yield paymentService.subscribeTo(obj);
                LOG.info("new subscription success", subscription.getId());
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
    updateSubScription(subScriptionWebHookEvent) {
        return __awaiter(this, void 0, void 0, function* () {
            LOG.debug("updateSubScription");
            // const userLogged = auth.loggedId;
            // await db.newTransaction();
            // try {
            //     const user = await userRepository.findById(userLogged);
            //     obj.userId = user.getId();
            //     const subscription = await paymentService.subscribeTo(obj);
            //     LOG.info("new subscription success", subscription.getId());
            //     await db.commit();
            // } catch (e) {
            //     await db.rollback();
            //     LOG.error("new subscription error", e);
            // }
        });
    }
}
exports.FinancialService = FinancialService;
//# sourceMappingURL=FinancialService.js.map