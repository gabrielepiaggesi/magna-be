import { Table } from "../../mgn-framework/models/Table";

export class MenuItem extends Table {
    public category_id: number;
    public item_position: number;
    public name: string;
    public bio: string;
    public price: string;
    public status: string;
    public image_url: string;
    public is_freezed: number;
    public allergic_note: string;

    // tslint:disable-next-line:no-empty
    constructor() { super(); }
}
