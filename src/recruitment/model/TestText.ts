import { Table } from "../../framework/models/Table";

export class TestText extends Table {
    public test_id: number;
    public text: string;
    public position_order: number;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}