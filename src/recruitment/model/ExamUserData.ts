import { Table } from "../../framework/models/Table";

export class ExamUserData extends Table {
    public exam_id: number;
    public option_id: number;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}