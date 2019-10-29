import { Table } from "./Table";

export class Creator extends Table {
    public name: string;
    public lastname: string;
    public username: string;
    public platform: string;
    public email: string;
    public password: string;
    public birthday: Date;
    public bio: string;
    // tslint:disable-next-line:variable-name
    public stock_price: number;
    // tslint:disable-next-line:variable-name
    public total_stocks: number;
    // tslint:disable-next-line:variable-name
    public available_stocks: number;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}
