import { Table } from "../../framework/models/Table";

export class ExamSkill extends Table {
    public exam_id: number;
    public text: string;
    public required: number;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}