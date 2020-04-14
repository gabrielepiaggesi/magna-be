export class StripePaymentMethodReq {
    payment_method_id: string;
    customer: string;

    constructor(payment_method_id, customer) {
        this.payment_method_id = payment_method_id;
        this.customer = customer;
    }
}