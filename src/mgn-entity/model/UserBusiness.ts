import { Table } from "../../mgn-framework/models/Table";

export class UserBusiness extends Table {
    public user_id: number;
    public business_id: number;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}
