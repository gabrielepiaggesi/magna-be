import { Table } from "../../mgn-framework/models/Table";

export class Notification extends Table {
    public business_id: number;
    public title: string;
    public body: string;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}
