import { Table } from "../../mgn-framework/models/Table";

export class Reservation extends Table {
    public user_id: number;
    public business_id: number;
    public note: string;
    public status: string;
    public sub_status: string;
    public user_date: string;
    public business_date: string;
    public table_number: number;
    public people_amount: number;
    public name: string;
    public phone_number: string;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}