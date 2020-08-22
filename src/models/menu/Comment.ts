import { Table } from "../Table";

export class Comment extends Table {
    public business_id: number;
    public text: string;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}
