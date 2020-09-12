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
const UserStripe_1 = require("../../models/financial/UserStripe");
const Card_1 = require("../../models/financial/Card");
const StripePaymentMethodReq_1 = require("./classes/StripePaymentMethodReq");
const BusinessRepository_1 = require("../../repositories/business/BusinessRepository");
const PlanRepository_1 = require("../../repositories/financial/PlanRepository");
const StripeRepository_1 = require("../../repositories/financial/StripeRepository");
const CardRepository_1 = require("../../repositories/financial/CardRepository");
const SubScriptionRepository_1 = require("../../repositories/financial/SubScriptionRepository");
const WalletService_1 = require("./WalletService");
const TransactionRepository_1 = require("../../repositories/financial/TransactionRepository");
const PaymentStatus_1 = require("../../enums/financial/PaymentStatus");
const LOG = new Logger_1.Logger("PaymentService.class");
const stripeService = new StripeService_1.StripeService();
const userRepository = new BusinessRepository_1.BusinessRepository();
const planRepository = new PlanRepository_1.PlanRepository();
const stripeRepository = new StripeRepository_1.StripeRepository();
const cardRepository = new CardRepository_1.CardRepository();
const subScriptionRepository = new SubScriptionRepository_1.SubScriptionRepository();
const transactionRepository = new TransactionRepository_1.TransactionRepository();
const walletService = new WalletService_1.WalletService();
class PaymentService {
    subscribeTo(obj, conn = null) {
        return __awaiter(this, void 0, void 0, function* () {
            LOG.debug("subscribeTo", obj);
            const user = yield userRepository.findById(obj.userId, conn);
            const plan = yield planRepository.findById(obj.planId, conn);
            const userStripe = yield this.updateUserStripeCustomer(user.id, user.email, conn);
            const userCard = yield this.updateUserStripePaymentMethod(user.id, obj.fingerprint, obj.paymentMethodId, userStripe.customer_id, conn);
            const userSub = yield this.updateUserStripeSubScription(user.id, userCard.id, userStripe.customer_id, plan.stripe_plan_id, plan.id, conn);
            return userSub;
        });
    }
    updateUserStripeCustomer(userId, userEmail, conn = null) {
        return __awaiter(this, void 0, void 0, function* () {
            let userStripe = yield stripeRepository.findByUserId(userId, conn);
            if (!userStripe) {
                const cus = yield stripeService.getOrCreateStripeCustomer(new StripeCustomerReq_1.StripeCustomerReq(userEmail));
                userStripe = new UserStripe_1.UserStripe();
                userStripe.user_id = userId;
                userStripe.customer_id = cus.id;
                const userStripeInserted = yield stripeRepository.save(userStripe, conn);
                userStripe.id = userStripeInserted.insertId;
            }
            LOG.debug("updateUserStripeCustomer", userStripe.id);
            return userStripe;
        });
    }
    updateUserStripePaymentMethod(userId, fingerprint, paymentMethodId, customerId, conn = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const paymentMethod = yield stripeService.getStripePaymentMethod(paymentMethodId);
            let userCard = yield cardRepository.findByUserIdAndFingerprint(userId, paymentMethod.card.fingerprint, conn);
            if (!userCard) {
                yield cardRepository.resetNotPrincipalCard(userId, conn);
                const card = yield stripeService.attachAndSetPaymentMethod(new StripePaymentMethodReq_1.StripePaymentMethodReq(paymentMethodId, customerId));
                userCard = new Card_1.Card();
                userCard.principal = true;
                userCard.user_id = userId;
                userCard.payment_method_id = card.id;
                userCard.last_4 = card.card.last4;
                userCard.fingerprint = card.card.fingerprint;
                userCard.three_d_secure_supported = card.card.three_d_secure_usage.supported;
                const userCardInserted = yield cardRepository.save(userCard, conn);
                userCard.id = userCardInserted.insertId;
            }
            LOG.debug("updateUserStripePaymentMethod", userCard.id);
            return userCard;
        });
    }
    updateUserStripeSubScription(userId, cardId, customerId, stipePlanId, planId, conn = null) {
        return __awaiter(this, void 0, void 0, function* () {
            let userSub = yield subScriptionRepository.findByUserIdAndPlanId(userId, planId, conn);
            if (!userSub) {
                const sub = yield stripeService.getOrCreateStripeSubScription(new StripeSubScriptionReq_1.StripeSubScriptionReq(customerId, stipePlanId));
                userSub = yield walletService.updateUserWallet(sub, conn);
            }
            else if ((userSub.subscription_status == 'past_due' || userSub.subscription_status == 'incomplete') && userSub.status != PaymentStatus_1.PaymentStatus.PENDING) {
                const lastTra = yield transactionRepository.findLastOfUserIdAndSubId(userSub.user_id, userSub.subscription_id, conn);
                if (lastTra.stripe_invoice_status == 'open') {
                    userSub.status = PaymentStatus_1.PaymentStatus.PENDING;
                    yield subScriptionRepository.update(userSub, conn);
                    const inv = yield stripeService.payStripeInvoice(lastTra.stripe_invoice_id);
                    // webhook should do the work
                    // const sub = await stripeService.getStripeSubscription(userSub.subscription_id);
                    // walletIsUpdated = await walletService.updateUserWallet(sub);
                }
            }
            LOG.debug("updateUserStripeSubScription", userSub);
            return userSub;
        });
    }
}
exports.PaymentService = PaymentService;
//# sourceMappingURL=PaymentService.js.map