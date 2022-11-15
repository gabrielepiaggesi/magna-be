import { Table } from "../../mgn-framework/models/Table";

export class Menu extends Table {
    public business_id: number;
    public name: string;
    public status: string;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}
