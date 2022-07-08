import { Table } from "../../framework/models/Table";

export class CompanyQuiz extends Table {
    public quiz_id: number;
    public company_id: number;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}