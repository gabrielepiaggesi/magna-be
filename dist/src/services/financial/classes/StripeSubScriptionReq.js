"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StripeSubScriptionReq {
    constructor(customerId, planId) {
        this.expand = "latest_invoice.payment_intent";
        this.customerId = customerId;
        this.planId = planId;
    }
}
exports.StripeSubScriptionReq = StripeSubScriptionReq;
//# sourceMappingURL=StripeSubScriptionReq.js.map