import { Table } from "../Table";

export class SubScription extends Table {
    public user_id: number;
    public plan_id: number;
    public card_id: number;
    public subscription_id: string;
    public payment_intent_id: string;
    public invoice_id: string;
    
    public status: string;
    public resume_status: string;
    public subscription_status: string;
    public invoice_status: string;
    public payment_intent_status: string;

    public last_renew: string;
    public next_renew: string;
    public expiration_date: string;

    constructor() { super(); }
}