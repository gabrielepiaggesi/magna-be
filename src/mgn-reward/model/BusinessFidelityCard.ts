import { Table } from "../../mgn-framework/models/Table";

export class BusinessFidelityCard extends Table {
    public business_id: number;
    public discount_id: number;
    public status: string;
    public expenses_amount: number;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}
