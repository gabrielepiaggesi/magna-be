import { Table } from "../Table";

export class Transaction extends Table {
    public user_id: number;
    public status: string;
    public amount: number;
    public currency: string;
    public operation_sign: string;
    public operation_resume: number;
    public provider: string = 'STRIPE';
    public card: string;

    constructor() { super(); }
}