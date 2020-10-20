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
const Logger_1 = require("../../utils/Logger");
const SubScription_1 = require("../model/SubScription");
const SubScriptionRepository_1 = require("../repository/SubScriptionRepository");
const StripeRepository_1 = require("../repository/StripeRepository");
const PlanRepository_1 = require("../repository/PlanRepository");
const PaymentStatus_1 = require("./classes/PaymentStatus");
const StripeService_1 = require("./StripeService");
const Transaction_1 = require("../model/Transaction");
const TransactionRepository_1 = require("../repository/TransactionRepository");
const OperationSign_1 = require("./classes/OperationSign");
const UserRepository_1 = require("../../ums/repository/UserRepository");
const UserStatus_1 = require("../../ums/service/classes/UserStatus");
const EmailSender_1 = require("../../framework/services/EmailSender");
const LOG = new Logger_1.Logger("WalletService.class");
const userRepository = new UserRepository_1.UserRepository();
const subScriptionRepository = new SubScriptionRepository_1.SubScriptionRepository();
const transactionRepository = new TransactionRepository_1.TransactionRepository();
const stripeRepository = new StripeRepository_1.StripeRepository();
const planRepository = new PlanRepository_1.PlanRepository();
const stripeService = new StripeService_1.StripeService();
const db = require("../../connection");
class WalletService {
    updateUserWallet(sub, conn) {
        return __awaiter(this, void 0, void 0, function* () {
            let userStripe = yield stripeRepository.findByCustomerId(sub.customer.toString(), conn);
            let userPlan = yield planRepository.findByStripePlanId(sub.plan.id, conn);
            const user = yield userRepository.findById(userStripe.user_id, conn);
            let inv = yield stripeService.getStripeInvoice(sub.latest_invoice['id']);
            let pi = yield stripeService.getStripePaymentIntent(sub.latest_invoice['payment_intent']['id']);
            inv = inv || null;
            pi = pi || null;
            if (userStripe) {
                const userSubUpdated = yield this.updateUserSubScription(user, userPlan.id, sub, inv, pi, conn);
                yield this.updateUserTransaction(user, userPlan.id, sub, inv, pi, conn);
                return userSubUpdated;
            }
            else {
                LOG.error('no stripe user found on db!', sub.customer.toString());
                return new SubScription_1.SubScription();
            }
        });
    }
    updateUserSubScription(user, planId, sub, inv, pi, conn) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date(Date.now());
            let userSub = yield subScriptionRepository.findByUserIdAndPlanId(user.id, planId, conn);
            userSub = userSub || new SubScription_1.SubScription();
            userSub.subscription_id = sub.id;
            userSub.user_id = user.id;
            userSub.plan_id = planId;
            userSub.status = (pi.status == 'succeeded') ? PaymentStatus_1.PaymentStatus.SUCCESS : PaymentStatus_1.PaymentStatus.FAILED;
            userSub.resume_status = sub.status + '.' + inv.status + '.' + pi.status;
            userSub.subscription_status = sub.status;
            userSub.last_renew = now.toISOString();
            userSub.next_renew = new Date((now.setMonth(now.getMonth() + 1))).toISOString();
            if (userSub.id) {
                const userSubUpdated = yield yield subScriptionRepository.update(userSub, conn);
            }
            else {
                const userSubInserted = yield subScriptionRepository.save(userSub, conn);
                userSub.id = userSubInserted.insertId;
                LOG.info('new subscription', userSubInserted.insertId);
            }
            user.status = (userSub.status == PaymentStatus_1.PaymentStatus.SUCCESS) ? UserStatus_1.UserStatus.ACTIVE : UserStatus_1.UserStatus.SUSPENDED;
            if (sub.status == 'canceled') {
                EmailSender_1.EmailSender.sendSubCanceled({ email: user.email });
                user.status = UserStatus_1.UserStatus.SUSPENDED;
            }
            const userUpdated = yield userRepository.update(user, conn);
            return userSub;
        });
    }
    updateUserTransaction(user, planId, sub, inv, pi, conn) {
        return __awaiter(this, void 0, void 0, function* () {
            let tra = yield transactionRepository.findByPaymentIntentId(pi.id, conn);
            tra = tra || new Transaction_1.Transaction();
            tra.user_id = user.id;
            tra.stripe_sub_id = sub.id || null;
            tra.stripe_payment_id = pi.id || null;
            tra.stripe_invoice_id = inv.id || null;
            tra.stripe_sub_status = sub.status;
            tra.stripe_payment_status = pi.status;
            tra.stripe_invoice_status = inv.status;
            tra.status = (tra.stripe_payment_status == 'succeeded') ? PaymentStatus_1.PaymentStatus.SUCCESS : PaymentStatus_1.PaymentStatus.FAILED;
            tra.currency = 'EUR';
            tra.amount = pi.amount / 100;
            tra.invoice_pdf_url = inv.invoice_pdf;
            tra.stripe_payment_method = pi.payment_method.toString();
            tra.operation_sign = OperationSign_1.OperationSign.NEGATIVE;
            tra.operation_resume = -tra.amount;
            if (tra.id) {
                const traUpdated = yield transactionRepository.update(tra, conn);
            }
            else {
                const traInserted = yield transactionRepository.save(tra, conn);
                tra.id = traInserted.insertId;
                EmailSender_1.EmailSender.sendNewRenewMessage({ email: user.email, params: { paymentValue: (pi.amount / 100).toFixed(2), subscription_id: tra.stripe_sub_id, invoice_pdf_url: tra.invoice_pdf_url } });
                LOG.info('new transaction', traInserted.insertId);
            }
            return tra;
        });
    }
}
exports.WalletService = WalletService;
//# sourceMappingURL=WalletService.js.map