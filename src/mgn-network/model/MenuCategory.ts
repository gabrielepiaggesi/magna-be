import { Table } from "../../mgn-framework/models/Table";

export class MenuCategory extends Table {
    public menu_id: string;
    public name: string;
    public cat_position: number;
    public message: string;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}
