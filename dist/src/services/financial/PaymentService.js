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
const StripeCustomerReq_1 = require("./classes/StripeCustomerReq");
const StripeService_1 = require("./StripeService");
const StripeSubScriptionReq_1 = require("./classes/StripeSubScriptionReq");
const PaymentStatus_1 = require("../../enums/financial/PaymentStatus");
const UserStripe_1 = require("../../models/financial/UserStripe");
const Card_1 = require("../../models/financial/Card");
const StripePaymentMethodReq_1 = require("./classes/StripePaymentMethodReq");
const SubScription_1 = require("../../models/financial/SubScription");
const UserRepository_1 = require("../../repositories/user/UserRepository");
const PlanRepository_1 = require("../../repositories/financial/PlanRepository");
const StripeRepository_1 = require("../../repositories/financial/StripeRepository");
const CardRepository_1 = require("../../repositories/financial/CardRepository");
const SubScriptionRepository_1 = require("../../repositories/financial/SubScriptionRepository");
const TransactionRepository_1 = require("../../repositories/financial/TransactionRepository");
const Transaction_1 = require("../../models/financial/Transaction");
const OperationSign_1 = require("../../enums/financial/OperationSign");
const LOG = new Logger_1.Logger("PaymentService.class");
const stripeService = new StripeService_1.StripeService();
const userRepository = new UserRepository_1.UserRepository();
const planRepository = new PlanRepository_1.PlanRepository();
const stripeRepository = new StripeRepository_1.StripeRepository();
const cardRepository = new CardRepository_1.CardRepository();
const subScriptionRepository = new SubScriptionRepository_1.SubScriptionRepository();
const transactionRepository = new TransactionRepository_1.TransactionRepository();
class PaymentService {
    subscribeTo(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            LOG.debug("subscribeTo", obj);
            const user = yield userRepository.findById(obj.userId);
            const plan = yield planRepository.findById(obj.planId);
            const userStripe = yield this.updateUserStripeCustomer(user.id, user.email);
            const userCard = yield this.updateUserStripePaymentMethod(user.id, obj.fingerprint, obj.paymentMethodId, userStripe.customer_id);
            const userSub = yield this.updateUserStripeSubScription(user.id, userCard.id, userStripe.customer_id, plan.stripe_plan_id, plan.id);
            return userSub;
        });
    }
    updateUserStripeCustomer(userId, userEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            let userStripe = yield stripeRepository.findByUserId(userId);
            if (!userStripe) {
                const cus = yield stripeService.getOrCreateStripeCustomer(new StripeCustomerReq_1.StripeCustomerReq(userEmail));
                userStripe = new UserStripe_1.UserStripe();
                userStripe.user_id = userId;
                userStripe.customer_id = cus.id;
                const userStripeInserted = yield stripeRepository.save(userStripe);
                userStripe.id = userStripeInserted.insertId;
            }
            LOG.debug("updateUserStripeCustomer", userStripe.id);
            return userStripe;
        });
    }
    updateUserStripePaymentMethod(userId, fingerprint, paymentMethodId, customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            let userCard = yield cardRepository.findByUserIdAndFingerprint(userId, fingerprint);
            if (!userCard) {
                const card = yield stripeService.attachAndSetPaymentMethod(new StripePaymentMethodReq_1.StripePaymentMethodReq(paymentMethodId, customerId));
                userCard = new Card_1.Card();
                userCard.user_id = userId;
                userCard.payment_method_id = card.id;
                userCard.last_4 = card.card.last4;
                userCard.fingerprint = card.card.fingerprint;
                userCard.three_d_secure_supported = card.card.three_d_secure_usage.supported;
                const userCardInserted = yield cardRepository.save(userCard);
                userCard.id = userCardInserted.insertId;
            }
            LOG.debug("updateUserStripePaymentMethod", userCard.id);
            return userCard;
        });
    }
    updateUserStripeSubScription(userId, cardId, customerId, stipePlanId, planId) {
        return __awaiter(this, void 0, void 0, function* () {
            let userSub = yield subScriptionRepository.findByUserIdAndPlanId(userId, planId);
            if (!userSub) {
                const now = new Date(Date.now());
                const sub = yield stripeService.getOrCreateStripeSubScription(new StripeSubScriptionReq_1.StripeSubScriptionReq(customerId, stipePlanId));
                userSub = yield this.prepareUserTransaction(userId, planId, sub);
            }
            LOG.debug("updateUserStripeSubScription", userSub.id);
            return userSub;
        });
    }
    prepareUserTransaction(userId, planId, sub) {
        return __awaiter(this, void 0, void 0, function* () {
            let inv = yield stripeService.getStripeInvoice(sub.latest_invoice['id']);
            let pi = yield stripeService.getStripePaymentIntent(sub.latest_invoice['payment_intent']['id']);
            inv = inv || null;
            pi = pi || null;
            return yield this.updateUserTransaction(userId, planId, sub, inv, pi);
        });
    }
    updateUserTransaction(userId, planId, sub, inv, pi) {
        return __awaiter(this, void 0, void 0, function* () {
            const tra = new Transaction_1.Transaction();
            tra.user_id = userId;
            tra.stripe_sub_id = sub.id || null;
            tra.stripe_payment_id = pi.id || null;
            tra.stripe_invoice_id = inv.id || null;
            tra.stripe_sub_status = sub.status;
            tra.stripe_payment_status = pi.status;
            tra.stripe_invoice_status = inv.status;
            tra.currency = 'EUR';
            tra.amount = pi.amount / 100;
            tra.stripe_payment_method = pi.payment_method.toString();
            tra.operation_sign = OperationSign_1.OperationSign.NEGATIVE;
            tra.operation_resume = -tra.amount;
            const traInserted = yield transactionRepository.save(tra);
            LOG.debug('new transaction', traInserted.insertId);
            return yield this.updateUserSubscription(tra, planId);
        });
    }
    updateUserSubscription(obj, planId) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date(Date.now());
            let userSub = new SubScription_1.SubScription();
            userSub.subscription_id = obj.stripe_sub_id;
            userSub.user_id = obj.user_id;
            userSub.plan_id = planId;
            userSub.status = (obj.stripe_payment_status == 'succeeded') ? PaymentStatus_1.PaymentStatus.SUCCESS : PaymentStatus_1.PaymentStatus.FAILED;
            userSub.resume_status = obj.stripe_sub_status + '.' + obj.stripe_invoice_status + '.' + obj.stripe_payment_status;
            userSub.subscription_status = obj.stripe_sub_status;
            userSub.last_renew = now.toISOString();
            userSub.next_renew = new Date((now.setMonth(now.getMonth() + 1))).toISOString();
            const userSubInserted = yield subScriptionRepository.save(userSub);
            userSub.id = userSubInserted.insertId;
            if (userSub.status == PaymentStatus_1.PaymentStatus.SUCCESS) {
                const user = yield userRepository.findById(obj.user_id);
                user.status = 'active';
                const userUpdated = yield userRepository.update(user);
            }
            return userSub;
        });
    }
}
exports.PaymentService = PaymentService;
//# sourceMappingURL=PaymentService.js.map