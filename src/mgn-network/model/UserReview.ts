import { Table } from "../../mgn-framework/models/Table";

export class UserReview extends Table {
    public user_id: number;
    public business_id: number;
    public text: string;
    public rating: number;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}