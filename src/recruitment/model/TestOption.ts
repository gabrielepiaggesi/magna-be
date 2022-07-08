import { Table } from "../../framework/models/Table";

export class TestOption extends Table {
    public test_id: number;
    public option_text: string;
    public is_correct: number;
    public points: number;
    public position_order: number;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}