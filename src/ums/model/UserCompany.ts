import { Table } from "../../framework/models/Table";

export class UserCompany extends Table {
    public user_id: number;
    public company_id: number;
    public status: string; //TODO enum
    public role: string; //TODO enum

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}
