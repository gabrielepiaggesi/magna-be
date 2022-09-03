import { Table } from "../../framework/models/Table";

export class JobOfferSkill extends Table {
    public job_offer_id: number;
    public quiz_id: number;
    public text: string;
    public required: number;
    public years?: number;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}
