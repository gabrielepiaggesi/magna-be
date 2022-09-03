import { Table } from "../../framework/models/Table";

export class UserApplication extends Table {
    public user_id: number;
    public job_offer_id: number;
    public exam_id: number;
    public company_id: number;
    public status: string;
    public note: string;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}