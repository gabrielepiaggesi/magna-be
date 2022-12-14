import { Table } from "../../mgn-framework/models/Table";

export class UserFidelityCard extends Table {
    public user_id: number;
    public business_id: number;
    public fidelity_card_id: number;
    public discount_id: number;
    public status: string;
    public usage_amount: number;
    public discount_countdown: number;
    public expenses_amount: number;
    public last_scan: string;
    public type: string;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}
