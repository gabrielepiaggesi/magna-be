import { Table } from "../../framework/models/Table";

export class JobOfferLink extends Table {
    public job_offer_id: number;
    public company_id: number;
    public uuid: string;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}