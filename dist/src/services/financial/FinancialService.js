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
const TransactionRepository_1 = require("../../repositories/financial/TransactionRepository");
const CardRepository_1 = require("../../repositories/financial/CardRepository");
const LOG = new Logger_1.Logger("FinancialService.class");
const userRepository = new UserRepository_1.UserRepository();
const paymentService = new PaymentService_1.PaymentService();
const subScriptionRepository = new SubScriptionRepository_1.SubScriptionRepository();
const transactionRepository = new TransactionRepository_1.TransactionRepository();
const cardRepository = new CardRepository_1.CardRepository();
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
                let msg = (e.message) ? e.message : null;
                let error_code = (e.code) ? e.code : null;
                let decline_code = (e.decline_code) ? e.decline_code : null;
                return res.status(500).send({ msg, error_code, decline_code });
            }
        });
    }
    getUserSubScription(res, planId) {
        return __awaiter(this, void 0, void 0, function* () {
            LOG.debug("getUserSubScription");
            const userLogged = index_1.auth.loggedId;
            let userSub = yield subScriptionRepository.findCurrentSubForUser(userLogged, planId);
            userSub = userSub || new SubScription_1.SubScription();
            return res.status(200).send(userSub);
        });
    }
    getUserTransactions(res) {
        return __awaiter(this, void 0, void 0, function* () {
            LOG.debug("getUserTransactions");
            const userLogged = index_1.auth.loggedId;
            let userTras = yield transactionRepository.findByUser(userLogged);
            return res.status(200).send(userTras);
        });
    }
    getUserCards(res) {
        return __awaiter(this, void 0, void 0, function* () {
            LOG.debug("getUserCards");
            const userLogged = index_1.auth.loggedId;
            let userTras = yield cardRepository.findByUserId(userLogged);
            return res.status(200).send(userTras);
        });
    }
}
exports.FinancialService = FinancialService;
//# sourceMappingURL=FinancialService.js.map