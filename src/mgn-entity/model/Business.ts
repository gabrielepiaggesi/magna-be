import { Table } from "../../mgn-framework/models/Table";

export class Business extends Table {
    public name: string;
    public user_id: number;
    public status: string;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}
