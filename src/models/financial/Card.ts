import { Table } from "../Table";

export class Card extends Table {
    public user_id: number;
    public status: string;
    public payment_method_id: string;
    public last_4: string;
    public fingerprint: string;
    public three_d_secure_supported: boolean;
    public provider: string = 'STRIPE';
    public detail: string;
    public principal: boolean;

    constructor() { super(); }
}