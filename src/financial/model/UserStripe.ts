import { Table } from "../../framework/models/Table";

export class UserStripe extends Table {
    public user_id: number;
    public status: string;
    public customer_id: string;
    public account_id: string;

    constructor() { super(); }
}