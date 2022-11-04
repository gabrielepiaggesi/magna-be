import { Table } from "../../mgn-framework/models/Table";

export class Business extends Table {
    public name: string;
    public address: string;
    public user_id: number;
    public status: string;
    public phone_number: string;
    public second_phone_number: string;
    public accept_reservations: number;
    public disable_reservation_today: string;
    public website: string;
    public menu_link: string;
    public instagram_page: string;
    public type: string;
    public discount_on_first_card: number;
    public discount_on_first_reservation: number;
    public discount_on_first_review: number;
    public cap: string;
    public description: string;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}
