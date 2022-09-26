import { Table } from "../../mgn-framework/models/Table";

export class UserDiscount extends Table {
    public user_id: number;
    public business_id: number;
    public discount_id: number;
    public status: string;
    public referral_id: number;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}
