import { Table } from "../../mgn-framework/models/Table";

export class UserReferral extends Table {
    public user_id: number;
    public business_id: number;
    public uuid: string;
    public status: string;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}
