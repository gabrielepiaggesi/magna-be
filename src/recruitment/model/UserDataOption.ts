import { Table } from "../../framework/models/Table";

export class UserDataOption extends Table {
    public option_key: string;
    public type: string;
    public relevant: number;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}
