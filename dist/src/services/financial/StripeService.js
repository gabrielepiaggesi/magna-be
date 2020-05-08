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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("../../utils/Logger");
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default('sk_live_b81pW4GV39JFBsOCJCHhCRBw00ymniER51', null);
const LOG = new Logger_1.Logger("StripeService.class");
class StripeService {
    // https://stripe.com/docs/billing/subscriptions/payment
    getOrCreateStripeCustomer(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            const cusFound = yield stripe.customers.list(obj).then(list => list.data);
            if (cusFound.length > 0) {
                LOG.debug("found stripe customer", obj.email);
                return cusFound[0];
            }
            else {
                LOG.debug("creating stripe customer", obj.email);
                return yield stripe.customers.create(obj).then(cus => cus);
            }
        });
    }
    getStripeCustomer(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            // create new stripe customer
            return yield stripe.customers.list(obj).then(list => list.data);
        });
    }
    createStripeCustomer(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            // create new stripe customer
            return yield stripe.customers.create(obj).then(cus => cus);
        });
    }
    attachAndSetPaymentMethod(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            // attach new payment method for stripe customer
            LOG.debug("attaching card", obj.customer);
            const pm = yield stripe.paymentMethods.attach(obj.payment_method_id, { customer: obj.customer }).then(pm => pm);
            // set this new pm as default for this customer
            LOG.debug("set default card", obj.payment_method_id);
            const cus = yield stripe.customers.update(obj.customer, { invoice_settings: { default_payment_method: pm.id } }).then(cus => cus);
            return pm;
        });
    }
    attachPaymentMethod(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            // attach new payment method for stripe customer
            yield stripe.paymentMethods.attach(obj.payment_method_id, { customer: obj.customer });
            return true;
        });
    }
    setPaymentMethod(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            // set this pm as default for this customer
            yield stripe.customers.update(obj.customer, { invoice_settings: { default_payment_method: obj.payment_method_id } });
            return true;
        });
    }
    getOrCreateStripeSubScription(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            const cusFound = yield this.getStripeSubscriptions(obj).then(list => list);
            if (cusFound.length > 0) {
                LOG.debug("found subscription", obj.customerId);
                return cusFound[0];
            }
            else {
                LOG.debug("creating stripe subscription", obj.customerId);
                return yield this.createStripeSubscription(obj).then(sub => sub);
            }
        });
    }
    createStripeSubscription(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            // create new stripe subscription for current customer
            const sub = { customer: obj.customerId, items: [{ plan: obj.planId }], expand: [obj.expand] };
            return yield stripe.subscriptions.create(sub).then(sub => sub);
        });
    }
    getStripeSubscriptions(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield stripe.subscriptions.list({ customer: obj.customerId, plan: obj.planId, status: 'active', expand: ["data.latest_invoice.payment_intent"] }).then(list => list.data);
        });
    }
    getStripeSubscription(subId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield stripe.subscriptions.retrieve(subId, { expand: ["latest_invoice.payment_intent"] }).then(sub => sub);
        });
    }
    getStripeInvoice(invId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield stripe.invoices.retrieve(invId).then(inv => inv);
        });
    }
    getStripePaymentIntent(piId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield stripe.paymentIntents.retrieve(piId).then(pi => pi);
        });
    }
    payStripeInvoice(invId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield stripe.invoices.pay(invId, { expand: ['payment_intent'] }).then(inv => inv);
        });
    }
    getStripePaymentMethod(pmId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield stripe.paymentMethods.retrieve(pmId, { expand: ['card'] }).then(pm => pm);
        });
    }
}
exports.StripeService = StripeService;
//# sourceMappingURL=StripeService.js.map