import { Table } from "../../mgn-framework/models/Table";

export class BusinessDiscount extends Table {
    public business_id: number;
    public status: string;
    public type: string;
    public origin: string;
    public amount: number;
    public monthly_limit: number;
    public minimum_expense: number;
    public slogan: string;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}
