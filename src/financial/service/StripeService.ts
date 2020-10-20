import { Logger } from "../../utils/Logger";
import { StripeCustomerReq } from "./classes/StripeCustomerReq";
import Stripe from 'stripe';
import { StripePaymentMethodReq } from "./classes/StripePaymentMethodReq";
import { StripeSubScriptionReq } from "./classes/StripeSubScriptionReq";
import { SubScription } from "../model/SubScription";
const stripe = new Stripe('sk_test_51HeNJiJIcmyVzZxQvazo0whBRQ4Eil3QL5EiFQ2mAxslgaCAfCNoV7uBGr7iWTVwERaKYV2ycbaxwMJYP6SXOuAb000qwOal2N', null);
const LOG = new Logger("StripeService.class");

export class StripeService {
    // https://stripe.com/docs/billing/subscriptions/payment

    public async getOrCreateStripeCustomer(obj: StripeCustomerReq) {
        const cusFound = await stripe.customers.list(obj).then(list => list.data);
        if (cusFound.length > 0) {
            LOG.debug("found stripe customer", obj.email);
            return cusFound[0];
        } else {
            LOG.debug("creating stripe customer", obj.email);
            return await stripe.customers.create(obj).then(cus => cus);
        }
    }

    public async getStripeCustomer(obj: StripeCustomerReq): Promise<any[]> {
        // create new stripe customer
        return await stripe.customers.list(obj).then(list => list.data);
    }

    public async createStripeCustomer(obj: StripeCustomerReq): Promise<any> {
        // create new stripe customer
        return await stripe.customers.create(obj).then(cus => cus);
    }

    public async attachAndSetPaymentMethod(obj: StripePaymentMethodReq) {
        // attach new payment method for stripe customer
        LOG.debug("attaching card", obj.customer);
        const pm = await stripe.paymentMethods.attach(obj.payment_method_id, { customer: obj.customer }).then(pm => pm);
        // set this new pm as default for this customer
        LOG.debug("set default card", obj.payment_method_id);
        const cus = await stripe.customers.update(obj.customer, { invoice_settings: { default_payment_method: pm.id } }).then(cus => cus);
        return pm;
    }

    public async attachPaymentMethod(obj: StripePaymentMethodReq) {
        // attach new payment method for stripe customer
        await stripe.paymentMethods.attach(obj.payment_method_id, { customer: obj.customer });
        return true;
    }

    public async setPaymentMethod(obj: StripePaymentMethodReq) {
        // set this pm as default for this customer
        await stripe.customers.update(obj.customer, { invoice_settings: { default_payment_method: obj.payment_method_id } });
        return true;
    }

    public async getOrCreateStripeSubScription(obj: StripeSubScriptionReq) {
        const cusFound = await this.getStripeSubscriptions(obj).then(list => list);
        if (cusFound.length > 0) {
            LOG.debug("found subscription", obj.customerId);
            return cusFound[0];
        } else {
            LOG.debug("creating stripe subscription", obj.customerId);
            return await this.createStripeSubscription(obj).then(sub => sub);
        }
    }

    public async createStripeSubscription(obj: StripeSubScriptionReq) {
        // create new stripe subscription for current customer
        const sub = { customer: obj.customerId, items: [{ plan: obj.planId }], expand: [obj.expand] };
        return await stripe.subscriptions.create(sub).then(sub => sub);
    }

    public async getStripeSubscriptions(obj: StripeSubScriptionReq) {
        return await stripe.subscriptions.list({ customer: obj.customerId, plan: obj.planId, status: 'active', expand: ["data.latest_invoice.payment_intent"] }).then(list => list.data);
    }

    public async getStripeSubscription(subId: string) {
        return await stripe.subscriptions.retrieve(subId, {expand: ["latest_invoice.payment_intent"]}).then(sub => sub);
    }

    public async cancelStripeSubscription(subId: string) {
        return await stripe.subscriptions.del(subId).then(sub => sub);
    }

    public async getStripeInvoice(invId: string) {
        return await stripe.invoices.retrieve(invId).then(inv => inv);
    }

    public async getStripePaymentIntent(piId: string) {
        return await stripe.paymentIntents.retrieve(piId).then(pi => pi);
    }

    public async payStripeInvoice(invId: string) {
        return await stripe.invoices.pay(invId, { expand: ['payment_intent'] }).then(inv => inv);
    }

    public async getStripePaymentMethod(pmId: string) {
        return await stripe.paymentMethods.retrieve(pmId, { expand: ['card'] }).then(pm => pm);
    }
}

