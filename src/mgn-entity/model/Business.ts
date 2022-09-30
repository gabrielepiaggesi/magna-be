import { Table } from "../../mgn-framework/models/Table";

export class Business extends Table {
    public name: string;
    public user_id: number;
    public status: string;
    public phone_number: string;
    public accept_reservations: number;
    public disable_reservation_today: string;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}
