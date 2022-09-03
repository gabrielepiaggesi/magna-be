import { Table } from "../../framework/models/Table";

export class ExamQuiz extends Table {
    public quiz_id: number;
    public exam_id: number;
    public position_order: number;
    public required: number;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}