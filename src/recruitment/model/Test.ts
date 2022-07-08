import { Table } from "../../framework/models/Table";

export class Test extends Table {
    public quiz_id: number;
    public question: string;
    public minutes: number;
    public type: string;
    public points: number;
    public position_order: number;
    public difficulty_level: number;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}