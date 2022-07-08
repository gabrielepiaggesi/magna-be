import { Table } from "../../framework/models/Table";

export class JobOfferQuiz extends Table {
    public quiz_id: number;
    public job_offer_id: number;
    public position_order: number;
    public required: number;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}