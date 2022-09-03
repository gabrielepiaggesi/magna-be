import { Table } from "../../framework/models/Table";

export class Exam extends Table {
    public role: string;
    public description: string;
    public status: 'DRAFT'|'CLOSED'|'ACTIVE';
    public company_id: number;
    public author_user_id: number;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}