import { Table } from "../Table";

export class MenuItem extends Table {
    public category_id: number;
    public name: string;
    public bio: string;
    public price: string;
    public status: string;
    public image_url: string;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}
