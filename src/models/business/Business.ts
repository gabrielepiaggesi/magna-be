import { Table } from "../Table";

export class Business extends Table {
    public email: string;
    public password: string;
    public status: string;
    public name: string;
    public address: string;
    public contact: string;
    public accept_terms_and_condition: boolean;
    public image_url: string;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}
