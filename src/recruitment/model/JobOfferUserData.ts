import { Table } from "../../framework/models/Table";

export class JobOfferUserData extends Table {
    public job_offer_id: number;
    public option_id: number;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}
