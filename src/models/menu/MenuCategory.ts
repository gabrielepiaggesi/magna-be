import { Table } from "../Table";

export class MenuCategory extends Table {
    public menu_id: string;
    public name: string;
    public position: number;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}
