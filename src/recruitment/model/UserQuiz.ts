import { Table } from "../../framework/models/Table";

export class UserQuiz extends Table {
    public user_id: number;
    public quiz_id: number;
    public job_offer_id: number;
    public status: string;
    public score: number;
    public rate: number;
    public tests_given: number;
    public tests_right: number;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}