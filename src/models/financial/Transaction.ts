import { Table } from "../Table";

export class Transaction extends Table {
    public user_id: number;
    public status: string;
    public amount: number;
    public currency: string;
    public stripe_sub_id: string;
    public stripe_payment_id: string;
    public stripe_invoice_id: string;
    public stripe_sub_status: string;
    public stripe_payment_status: string;
    public stripe_invoice_status: string;
    public operation_sign: string;
    public operation_resume: number;
    public provider: string = 'STRIPE';
    public stripe_payment_method: string;

    constructor() { super(); }
}
