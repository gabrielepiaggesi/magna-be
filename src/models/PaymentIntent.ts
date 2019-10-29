import { Table } from "./Table";

export class PaymentIntent extends Table {
    // tslint:disable-next-line:variable-name
    public user_id: number;
    // tslint:disable-next-line:variable-name
    public creator_id: number;
    public quantity: number;
    public status: string;
    // tslint:disable-next-line:variable-name
    public stock_price: number;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}
