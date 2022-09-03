import { Table } from "../../framework/models/Table";

export class ExamLink extends Table {
    public exam_id: number;
    public company_id: number;
    public uuid: string;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}