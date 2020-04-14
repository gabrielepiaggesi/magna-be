export class StripeSubScriptionReq {
    customerId: string;
    planId: string;
    expand: string = "latest_invoice.payment_intent";

    constructor(customerId, planId) {
        this.customerId = customerId;
        this.planId = planId;
    }
}