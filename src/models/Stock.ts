import { StockStatus } from "../enums/StockStatus";
import { Table } from "./Table";

export class Stock extends Table {
    // tslint:disable-next-line:variable-name
    public user_id: number;
    // tslint:disable-next-line:variable-name
    public buyer_id: number;
    // tslint:disable-next-line:variable-name
    public seller_id: number;
    // tslint:disable-next-line:variable-name
    public payment_id: number;
    // tslint:disable-next-line:variable-name
    public creator_id: number;
    public quantity: number;
    public status: StockStatus;
    // tslint:disable-next-line:variable-name
    public parent_payment_id: number;
    // tslint:disable-next-line:variable-name
    public stock_price: number;
    public operation: number;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}
