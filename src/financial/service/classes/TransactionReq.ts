export class TransactionReq {
    user_id: number;
    card_id: number;
    stripe_sub_id: string;
    stripe_payment_id: string;
    stripe_invoice_id: string;
    stripe_sub_status: string;
    stripe_payment_status: string;
    stripe_invoice_status: string;
    amount: number;
    currency: string = 'EUR';

    constructor() {}
}